# AI 集成方案设计

## 🤖 AI 服务概览

### 集成目标
1. **简历智能分析** - 提取关键信息，评估简历质量
2. **职位智能匹配** - 分析职位与简历的匹配度
3. **简历评分系统** - 针对特定职位对简历打分
4. **个性化建议** - 提供简历改进和职业发展建议

### AI 服务架构
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端应用       │    │   后端API       │    │   AI服务层      │
│                │    │                │    │                │
│  ┌──────────┐   │    │  ┌──────────┐   │    │  ┌──────────┐   │
│  │ AI分析页  │   │────┤  │ AI控制器  │   │────┤  │ OpenAI   │   │
│  │          │   │    │  │          │   │    │  │  API     │   │
│  └──────────┘   │    │  └──────────┘   │    │  └──────────┘   │
│                │    │                │    │                │
│  ┌──────────┐   │    │  ┌──────────┐   │    │  ┌──────────┐   │
│  │ 匹配结果  │   │    │  │ 业务逻辑  │   │    │  │ 提示工程  │   │
│  │ 显示     │   │    │  │ 处理     │   │    │  │ 模块     │   │
│  └──────────┘   │    │  └──────────┘   │    │  └──────────┘   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   缓存层        │    │   队列处理       │    │   结果存储       │
│  (Redis)       │    │  (Bull/Bee)     │    │ (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🧠 OpenAI API 集成

### API 配置
```typescript
// config/ai.ts
export const aiConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG_ID,
    model: {
      primary: 'gpt-4-turbo-preview',
      fallback: 'gpt-3.5-turbo',
      embedding: 'text-embedding-3-small'
    },
    maxTokens: {
      analysis: 4000,
      matching: 3000,
      suggestions: 2000
    },
    temperature: 0.3,
    timeout: 30000
  },
  rateLimits: {
    perUser: {
      hour: 50,    // 每用户每小时50次请求
      day: 200     // 每用户每天200次请求
    },
    global: {
      minute: 100, // 全局每分钟100次请求
      hour: 1000   // 全局每小时1000次请求
    }
  }
};
```

### AI 服务基础类
```typescript
// services/aiService.ts
import { OpenAI } from 'openai';
import { aiConfig } from '../config/ai';

export class AIService {
  private openai: OpenAI;
  private cache: Redis;
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: aiConfig.openai.apiKey,
      organization: aiConfig.openai.organization
    });
    this.cache = new Redis(process.env.REDIS_URL);
  }
  
  /**
   * 通用AI请求方法
   */
  private async makeAIRequest(
    messages: OpenAI.Chat.ChatCompletionMessageParam[],
    options: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      responseFormat?: 'json' | 'text';
    } = {}
  ): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: options.model || aiConfig.openai.model.primary,
        messages,
        max_tokens: options.maxTokens || aiConfig.openai.maxTokens.analysis,
        temperature: options.temperature || aiConfig.openai.temperature,
        response_format: options.responseFormat === 'json' 
          ? { type: 'json_object' }
          : undefined
      });
      
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      // 如果主模型失败，尝试备用模型
      if (options.model !== aiConfig.openai.model.fallback) {
        return this.makeAIRequest(messages, {
          ...options,
          model: aiConfig.openai.model.fallback
        });
      }
      throw error;
    }
  }
  
  /**
   * 生成缓存键
   */
  private generateCacheKey(type: string, data: any): string {
    const hash = crypto
      .createHash('md5')
      .update(JSON.stringify(data))
      .digest('hex');
    return `ai:${type}:${hash}`;
  }
}
```

## 📝 简历分析模块

### 简历分析提示词
```typescript
// prompts/resumeAnalysis.ts
export const RESUME_ANALYSIS_PROMPT = `
你是一个专业的简历分析专家。请仔细分析以下简历内容，并以JSON格式返回详细的分析结果。

分析要求：
1. 提取个人基本信息
2. 识别所有技能和技术栈
3. 分析工作经验和项目经验
4. 评估教育背景
5. 识别证书和成就
6. 分析简历的整体质量

请按照以下JSON结构返回结果：
{
  "personalInfo": {
    "name": "姓名",
    "email": "邮箱",
    "phone": "电话",
    "location": "地址",
    "linkedin": "LinkedIn链接",
    "github": "GitHub链接"
  },
  "summary": "简历摘要",
  "skills": [
    {
      "name": "技能名称",
      "category": "技能分类",
      "level": "熟练程度",
      "yearsExperience": 使用年限
    }
  ],
  "experience": [
    {
      "company": "公司名称",
      "position": "职位",
      "duration": "工作时间",
      "description": "工作描述",
      "achievements": ["成就1", "成就2"]
    }
  ],
  "projects": [
    {
      "name": "项目名称",
      "description": "项目描述",
      "technologies": ["技术1", "技术2"],
      "role": "担任角色"
    }
  ],
  "education": [
    {
      "school": "学校名称",
      "degree": "学位",
      "major": "专业",
      "duration": "就读时间",
      "gpa": "绩点"
    }
  ],
  "certifications": ["证书1", "证书2"],
  "languages": [
    {
      "language": "语言",
      "proficiency": "熟练程度"
    }
  ],
  "analysis": {
    "strengths": ["优势1", "优势2"],
    "weaknesses": ["不足1", "不足2"],
    "suggestions": ["建议1", "建议2"],
    "overallScore": 85,
    "scoreBreakdown": {
      "format": 90,
      "content": 85,
      "experience": 80,
      "skills": 88,
      "education": 85
    }
  }
}

简历内容：
`;
```

### 简历分析服务实现
```typescript
// services/resumeAnalysisService.ts
export class ResumeAnalysisService extends AIService {
  /**
   * 分析简历内容
   */
  async analyzeResume(resumeContent: string, userId: string): Promise<ResumeAnalysis> {
    // 检查缓存
    const cacheKey = this.generateCacheKey('resume_analysis', { resumeContent });
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // 检查用户速率限制
    await this.checkRateLimit(userId, 'analysis');
    
    try {
      // 构建提示词
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: RESUME_ANALYSIS_PROMPT
        },
        {
          role: 'user',
          content: resumeContent
        }
      ];
      
      // 调用AI API
      const response = await this.makeAIRequest(messages, {
        maxTokens: aiConfig.openai.maxTokens.analysis,
        responseFormat: 'json'
      });
      
      // 解析响应
      const analysis: ResumeAnalysis = JSON.parse(response);
      
      // 验证和清理数据
      const cleanedAnalysis = this.validateAndCleanAnalysis(analysis);
      
      // 缓存结果（1小时）
      await this.cache.setex(cacheKey, 3600, JSON.stringify(cleanedAnalysis));
      
      // 记录使用情况
      await this.recordUsage(userId, 'resume_analysis', {
        tokensUsed: this.estimateTokens(response),
        success: true
      });
      
      return cleanedAnalysis;
      
    } catch (error) {
      await this.recordUsage(userId, 'resume_analysis', {
        success: false,
        error: error.message
      });
      throw new Error('简历分析失败: ' + error.message);
    }
  }
  
  /**
   * 验证和清理分析结果
   */
  private validateAndCleanAnalysis(analysis: any): ResumeAnalysis {
    // 验证必需字段
    if (!analysis.personalInfo) {
      throw new Error('分析结果缺少个人信息');
    }
    
    // 清理和标准化技能数据
    if (analysis.skills) {
      analysis.skills = analysis.skills.map((skill: any) => ({
        name: skill.name || '',
        category: this.standardizeSkillCategory(skill.category),
        level: this.standardizeSkillLevel(skill.level),
        yearsExperience: Math.max(0, parseInt(skill.yearsExperience) || 0)
      }));
    }
    
    // 验证评分
    if (analysis.analysis?.overallScore) {
      analysis.analysis.overallScore = Math.min(100, Math.max(0, analysis.analysis.overallScore));
    }
    
    return analysis;
  }
  
  /**
   * 标准化技能分类
   */
  private standardizeSkillCategory(category: string): string {
    const categoryMap: Record<string, string> = {
      '编程语言': 'PROGRAMMING_LANGUAGE',
      '框架': 'FRAMEWORK',
      '数据库': 'DATABASE',
      '工具': 'TOOL',
      '软技能': 'SOFT_SKILL',
      '证书': 'CERTIFICATION',
      '语言': 'LANGUAGE'
    };
    
    return categoryMap[category] || 'OTHER';
  }
  
  /**
   * 标准化技能水平
   */
  private standardizeSkillLevel(level: string): string {
    const levelMap: Record<string, string> = {
      '初级': 'BEGINNER',
      '中级': 'INTERMEDIATE', 
      '高级': 'ADVANCED',
      '专家': 'EXPERT'
    };
    
    return levelMap[level] || 'INTERMEDIATE';
  }
}
```

## 🎯 职位匹配模块

### 职位匹配提示词
```typescript
// prompts/jobMatching.ts
export const JOB_MATCHING_PROMPT = `
你是一个专业的职位匹配专家。请分析简历与职位描述的匹配程度，并提供详细的匹配报告。

分析维度：
1. 技能匹配度 - 简历技能与职位要求的匹配程度
2. 经验匹配度 - 工作经验与职位经验要求的匹配
3. 教育背景匹配度 - 学历与专业的匹配程度
4. 地理位置匹配度 - 工作地点的匹配程度
5. 薪资匹配度 - 期望薪资与职位薪资的匹配

请以JSON格式返回匹配分析结果：
{
  "overallScore": 85,
  "matchDetails": {
    "skills": {
      "score": 88,
      "matched": ["JavaScript", "React", "Node.js"],
      "missing": ["Vue.js", "Docker"],
      "additional": ["TypeScript", "GraphQL"]
    },
    "experience": {
      "score": 82,
      "requiredYears": 3,
      "candidateYears": 2.5,
      "relevantExperience": ["前端开发", "全栈开发"]
    },
    "education": {
      "score": 90,
      "required": "本科",
      "candidate": "本科",
      "relevantMajor": true
    },
    "location": {
      "score": 95,
      "required": "北京",
      "candidate": "北京",
      "remoteOption": true
    },
    "salary": {
      "score": 75,
      "requiredMin": 15000,
      "requiredMax": 25000,
      "candidateExpectation": 22000
    }
  },
  "recommendations": [
    "建议学习Vue.js以提高前端技能匹配度",
    "可以强调全栈开发经验"
  ],
  "fitLevel": "HIGH",
  "applicationPriority": "HIGH"
}

简历信息：
{resumeData}

职位描述：
{jobDescription}
`;
```

### 职位匹配服务
```typescript
// services/jobMatchingService.ts
export class JobMatchingService extends AIService {
  /**
   * 分析职位匹配度
   */
  async analyzeJobMatch(
    resume: Resume,
    job: Job,
    userId: string
  ): Promise<JobMatchResult> {
    const cacheKey = this.generateCacheKey('job_match', {
      resumeId: resume.id,
      jobId: job.id
    });
    
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    await this.checkRateLimit(userId, 'matching');
    
    try {
      // 准备数据
      const resumeData = this.extractResumeData(resume);
      const jobDescription = this.extractJobData(job);
      
      // 构建提示词
      const prompt = JOB_MATCHING_PROMPT
        .replace('{resumeData}', JSON.stringify(resumeData, null, 2))
        .replace('{jobDescription}', JSON.stringify(jobDescription, null, 2));
      
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: prompt
        },
        {
          role: 'user',
          content: '请分析以上简历和职位的匹配程度。'
        }
      ];
      
      const response = await this.makeAIRequest(messages, {
        maxTokens: aiConfig.openai.maxTokens.matching,
        responseFormat: 'json'
      });
      
      const matchResult: JobMatchResult = JSON.parse(response);
      const cleanedResult = this.validateMatchResult(matchResult);
      
      // 缓存结果（30分钟）
      await this.cache.setex(cacheKey, 1800, JSON.stringify(cleanedResult));
      
      await this.recordUsage(userId, 'job_matching', {
        tokensUsed: this.estimateTokens(response),
        success: true
      });
      
      return cleanedResult;
      
    } catch (error) {
      await this.recordUsage(userId, 'job_matching', {
        success: false,
        error: error.message
      });
      throw new Error('职位匹配分析失败: ' + error.message);
    }
  }
  
  /**
   * 批量分析多个职位
   */
  async analyzeMultipleJobs(
    resume: Resume,
    jobs: Job[],
    userId: string
  ): Promise<JobMatchResult[]> {
    // 限制批量分析的数量
    if (jobs.length > 10) {
      throw new Error('单次最多只能分析10个职位');
    }
    
    // 并发执行，但限制并发数
    const results = await Promise.allSettled(
      jobs.map(job => 
        this.analyzeJobMatch(resume, job, userId)
      )
    );
    
    return results
      .filter((result): result is PromiseFulfilledResult<JobMatchResult> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value)
      .sort((a, b) => b.overallScore - a.overallScore); // 按匹配度降序
  }
  
  /**
   * 提取简历关键数据
   */
  private extractResumeData(resume: Resume) {
    return {
      skills: resume.analysis?.skills || [],
      experience: resume.analysis?.experience || [],
      education: resume.analysis?.education || [],
      totalExperience: resume.totalExperience || 0,
      summary: resume.summary || ''
    };
  }
  
  /**
   * 提取职位关键数据
   */
  private extractJobData(job: Job) {
    return {
      title: job.title,
      company: job.company,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      salaryRange: {
        min: job.salaryMin,
        max: job.salaryMax
      },
      experienceLevel: job.experienceLevel,
      workType: job.workType,
      remoteOption: job.remoteOption
    };
  }
  
  /**
   * 验证匹配结果
   */
  private validateMatchResult(result: any): JobMatchResult {
    // 验证分数范围
    result.overallScore = Math.min(100, Math.max(0, result.overallScore || 0));
    
    // 验证匹配详情
    if (result.matchDetails) {
      Object.keys(result.matchDetails).forEach(key => {
        if (result.matchDetails[key]?.score) {
          result.matchDetails[key].score = Math.min(100, Math.max(0, result.matchDetails[key].score));
        }
      });
    }
    
    // 设置匹配等级
    if (result.overallScore >= 80) {
      result.fitLevel = 'HIGH';
      result.applicationPriority = 'HIGH';
    } else if (result.overallScore >= 60) {
      result.fitLevel = 'MEDIUM';
      result.applicationPriority = 'MEDIUM';
    } else {
      result.fitLevel = 'LOW';
      result.applicationPriority = 'LOW';
    }
    
    return result;
  }
}
```

## 🎯 简历评分系统

### 评分服务
```typescript
// services/resumeScoringService.ts
export class ResumeScoringService extends AIService {
  /**
   * 针对特定职位对简历评分
   */
  async scoreResumeForJob(
    resume: Resume,
    job: Job,
    userId: string
  ): Promise<ResumeScore> {
    const cacheKey = this.generateCacheKey('resume_score', {
      resumeId: resume.id,
      jobId: job.id
    });
    
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    await this.checkRateLimit(userId, 'scoring');
    
    try {
      const prompt = this.buildScoringPrompt(resume, job);
      
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: prompt
        },
        {
          role: 'user',
          content: '请对这份简历进行详细评分。'
        }
      ];
      
      const response = await this.makeAIRequest(messages, {
        maxTokens: aiConfig.openai.maxTokens.analysis,
        responseFormat: 'json'
      });
      
      const score: ResumeScore = JSON.parse(response);
      const validatedScore = this.validateScore(score);
      
      // 缓存结果
      await this.cache.setex(cacheKey, 1800, JSON.stringify(validatedScore));
      
      await this.recordUsage(userId, 'resume_scoring', {
        tokensUsed: this.estimateTokens(response),
        success: true
      });
      
      return validatedScore;
      
    } catch (error) {
      await this.recordUsage(userId, 'resume_scoring', {
        success: false,
        error: error.message
      });
      throw new Error('简历评分失败: ' + error.message);
    }
  }
  
  private buildScoringPrompt(resume: Resume, job: Job): string {
    return `
    你是一个专业的HR专家。请根据以下职位要求，对候选人的简历进行详细评分。

    评分维度：
    1. 技能匹配 (30%) - 技能与职位要求的匹配程度
    2. 经验相关性 (25%) - 工作经验与职位的相关程度
    3. 教育背景 (15%) - 学历和专业的匹配程度
    4. 项目经验 (20%) - 项目经验的质量和相关性
    5. 简历质量 (10%) - 简历的格式和表达质量

    请以JSON格式返回评分结果：
    {
      "overallScore": 85,
      "categoryScores": {
        "skillsMatch": {
          "score": 88,
          "weight": 0.3,
          "feedback": "技能匹配度很高，掌握了大部分要求的技术"
        },
        "experienceRelevance": {
          "score": 82,
          "weight": 0.25,
          "feedback": "工作经验相关，但可以更强调相关项目"
        },
        "education": {
          "score": 90,
          "weight": 0.15,
          "feedback": "教育背景完全符合要求"
        },
        "projectExperience": {
          "score": 85,
          "weight": 0.2,
          "feedback": "项目经验丰富，与职位高度相关"
        },
        "resumeQuality": {
          "score": 92,
          "weight": 0.1,
          "feedback": "简历格式清晰，表达简洁明了"
        }
      },
      "strengths": ["技术栈全面", "项目经验丰富"],
      "improvements": ["可以增加团队协作经验描述"],
      "hiringRecommendation": "RECOMMEND",
      "confidenceLevel": "HIGH"
    }

    职位信息：
    ${JSON.stringify(this.extractJobData(job), null, 2)}

    简历信息：
    ${JSON.stringify(this.extractResumeData(resume), null, 2)}
    `;
  }
  
  private validateScore(score: any): ResumeScore {
    // 验证总分
    score.overallScore = Math.min(100, Math.max(0, score.overallScore || 0));
    
    // 验证各分类评分
    if (score.categoryScores) {
      Object.keys(score.categoryScores).forEach(key => {
        const category = score.categoryScores[key];
        if (category.score) {
          category.score = Math.min(100, Math.max(0, category.score));
        }
      });
    }
    
    return score;
  }
}
```

## 💡 建议生成系统

### 建议生成服务
```typescript
// services/suggestionService.ts
export class SuggestionService extends AIService {
  /**
   * 生成简历改进建议
   */
  async generateResumeSuggestions(
    resume: Resume,
    targetJobs: Job[],
    userId: string
  ): Promise<ResumeSuggestions> {
    const cacheKey = this.generateCacheKey('suggestions', {
      resumeId: resume.id,
      jobIds: targetJobs.map(j => j.id)
    });
    
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    await this.checkRateLimit(userId, 'suggestions');
    
    try {
      const prompt = this.buildSuggestionPrompt(resume, targetJobs);
      
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: prompt
        },
        {
          role: 'user',
          content: '请提供详细的简历改进建议。'
        }
      ];
      
      const response = await this.makeAIRequest(messages, {
        maxTokens: aiConfig.openai.maxTokens.suggestions,
        responseFormat: 'json'
      });
      
      const suggestions: ResumeSuggestions = JSON.parse(response);
      
      // 缓存结果（6小时）
      await this.cache.setex(cacheKey, 21600, JSON.stringify(suggestions));
      
      await this.recordUsage(userId, 'suggestions', {
        tokensUsed: this.estimateTokens(response),
        success: true
      });
      
      return suggestions;
      
    } catch (error) {
      await this.recordUsage(userId, 'suggestions', {
        success: false,
        error: error.message
      });
      throw new Error('建议生成失败: ' + error.message);
    }
  }
  
  private buildSuggestionPrompt(resume: Resume, targetJobs: Job[]): string {
    return `
    你是一个资深的职业发展顾问。请根据候选人的简历和目标职位，提供个性化的改进建议。

    请以JSON格式返回建议：
    {
      "skillDevelopment": [
        {
          "skill": "Vue.js",
          "reason": "60%的目标职位要求此技能",
          "priority": "HIGH",
          "learningPath": ["官方文档", "实战项目", "在线课程"],
          "timeEstimate": "2-3个月"
        }
      ],
      "resumeImprovements": [
        {
          "section": "工作经验",
          "suggestion": "添加量化数据，如'提升页面加载速度30%'",
          "priority": "MEDIUM",
          "impact": "提高简历说服力"
        }
      ],
      "careerAdvice": [
        {
          "advice": "考虑向全栈开发方向发展",
          "reasoning": "市场需求大，薪资潜力高",
          "actionItems": ["学习后端技术", "参与全栈项目"]
        }
      ],
      "marketInsights": {
        "demandTrends": "前端开发需求稳定增长",
        "salaryTrends": "React开发者平均薪资上涨15%",
        "hotSkills": ["TypeScript", "微前端", "性能优化"]
      },
      "nextSteps": [
        "完善GitHub项目展示",
        "准备技术面试题库",
        "更新LinkedIn档案"
      ]
    }

    当前简历：
    ${JSON.stringify(this.extractResumeData(resume), null, 2)}

    目标职位：
    ${JSON.stringify(targetJobs.map(job => this.extractJobData(job)), null, 2)}
    `;
  }
}
```

## 🚦 使用限制与监控

### 速率限制
```typescript
// middleware/rateLimitMiddleware.ts
export class RateLimitService {
  private redis: Redis;
  
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }
  
  async checkRateLimit(userId: string, action: string): Promise<void> {
    const limits = aiConfig.rateLimits.perUser;
    
    // 检查小时限制
    const hourKey = `rate_limit:${userId}:${action}:${new Date().getHours()}`;
    const hourCount = await this.redis.incr(hourKey);
    if (hourCount === 1) {
      await this.redis.expire(hourKey, 3600);
    }
    if (hourCount > limits.hour) {
      throw new Error('超过每小时请求限制');
    }
    
    // 检查日限制
    const dayKey = `rate_limit:${userId}:${action}:${new Date().getDate()}`;
    const dayCount = await this.redis.incr(dayKey);
    if (dayCount === 1) {
      await this.redis.expire(dayKey, 86400);
    }
    if (dayCount > limits.day) {
      throw new Error('超过每日请求限制');
    }
  }
}
```

### 使用情况记录
```typescript
// services/usageTrackingService.ts
export class UsageTrackingService {
  async recordUsage(
    userId: string,
    action: string,
    metadata: {
      tokensUsed?: number;
      success: boolean;
      error?: string;
      processingTime?: number;
    }
  ): Promise<void> {
    await prisma.aiUsage.create({
      data: {
        userId,
        action,
        tokensUsed: metadata.tokensUsed || 0,
        success: metadata.success,
        error: metadata.error,
        processingTime: metadata.processingTime,
        cost: this.calculateCost(action, metadata.tokensUsed),
        createdAt: new Date()
      }
    });
  }
  
  private calculateCost(action: string, tokens: number): number {
    // GPT-4 定价 (假设)
    const pricePerToken = 0.00003; // $0.03/1K tokens
    return (tokens || 0) * pricePerToken;
  }
}
```

## 🔧 部署和监控

### 环境配置
```env
# .env
OPENAI_API_KEY=sk-...
OPENAI_ORG_ID=org-...
REDIS_URL=redis://localhost:6379
AI_RATE_LIMIT_ENABLED=true
AI_CACHE_TTL=3600
AI_REQUEST_TIMEOUT=30000
```

### 健康检查
```typescript
// routes/health.ts
app.get('/health/ai', async (req, res) => {
  try {
    // 测试OpenAI连接
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 5
    });
    
    res.json({
      status: 'healthy',
      services: {
        openai: 'connected',
        redis: await redis.ping() === 'PONG' ? 'connected' : 'disconnected'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});
```