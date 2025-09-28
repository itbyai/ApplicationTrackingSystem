# 数据库设计文档

## 📊 数据模型概览

### 实体关系图 (ERD)
```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│      User       │      │     Resume      │      │   Application   │
├─────────────────┤      ├─────────────────┤      ├─────────────────┤
│ id (PK)         │─────<│ userId (FK)     │>────<│ resumeId (FK)   │
│ email           │      │ id (PK)         │      │ id (PK)         │
│ password        │      │ title           │      │ userId (FK)     │
│ firstName       │      │ content (JSON)  │      │ jobId (FK)      │
│ lastName        │      │ filePath        │      │ status          │
│ avatar          │      │ fileType        │      │ appliedAt       │
│ createdAt       │      │ analysis (JSON) │      │ notes           │
│ updatedAt       │      │ createdAt       │      │ timeline (JSON) │
└─────────────────┘      │ updatedAt       │      │ matchScore      │
                         └─────────────────┘      └─────────────────┘
                                   │                        │
                                   │              ┌─────────────────┐
                                   │              │      Job        │
                                   │              ├─────────────────┤
                                   └─────────────<│ id (PK)         │
                                                  │ userId (FK)     │>─────┐
                                                  │ title           │      │
                                                  │ company         │      │
                                                  │ description     │      │
                                                  │ requirements    │      │
                                                  │ salary          │      │
                                                  │ location        │      │
                                                  │ source          │      │
                                                  │ sourceUrl       │      │
                                                  │ status          │      │
                                                  │ createdAt       │      │
                                                  │ updatedAt       │      │
                                                  └─────────────────┘      │
                                                                           │
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐    │
│   ResumeSkill   │      │      Skill      │      │    JobSkill     │    │
├─────────────────┤      ├─────────────────┤      ├─────────────────┤    │
│ id (PK)         │     >│ id (PK)         │<     │ id (PK)         │<───┘
│ resumeId (FK)   │      │ name            │      │ jobId (FK)      │
│ skillId (FK)    │      │ category        │      │ skillId (FK)    │
│ level           │      │ description     │      │ required        │
│ yearsExp        │      │ createdAt       │      │ priority        │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## 🗃️ 详细表结构

### 1. 用户表 (users)
```sql
CREATE TABLE users (
  id VARCHAR(30) PRIMARY KEY DEFAULT gen_cuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  avatar VARCHAR(500),
  phone VARCHAR(20),
  date_of_birth DATE,
  location VARCHAR(200),
  linkedin_url VARCHAR(500),
  github_url VARCHAR(500),
  portfolio_url VARCHAR(500),
  preferred_job_title VARCHAR(200),
  preferred_location VARCHAR(200),
  preferred_salary_min INTEGER,
  preferred_salary_max INTEGER,
  email_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_location ON users(location);
```

### 2. 简历表 (resumes)
```sql
CREATE TABLE resumes (
  id VARCHAR(30) PRIMARY KEY DEFAULT gen_cuid(),
  user_id VARCHAR(30) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content JSON,  -- 结构化简历内容
  file_path VARCHAR(500),  -- 原始文件存储路径
  file_type VARCHAR(50),   -- PDF, DOC, DOCX
  file_size INTEGER,       -- 文件大小（字节）
  analysis JSON,           -- AI分析结果
  summary TEXT,            -- 简历摘要
  total_experience INTEGER, -- 总工作年限（月）
  is_primary BOOLEAN DEFAULT false, -- 是否为主简历
  last_analyzed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_created_at ON resumes(created_at);
CREATE INDEX idx_resumes_is_primary ON resumes(is_primary);
```

### 3. 职位表 (jobs)
```sql
CREATE TABLE jobs (
  id VARCHAR(30) PRIMARY KEY DEFAULT gen_cuid(),
  user_id VARCHAR(30) NOT NULL,
  title VARCHAR(300) NOT NULL,
  company VARCHAR(200) NOT NULL,
  description TEXT,
  requirements TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency VARCHAR(10) DEFAULT 'CNY',
  location VARCHAR(200),
  work_type ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE') DEFAULT 'FULL_TIME',
  remote_option ENUM('ON_SITE', 'REMOTE', 'HYBRID') DEFAULT 'ON_SITE',
  experience_level ENUM('ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE') DEFAULT 'MID',
  source VARCHAR(100),     -- 来源网站 (LinkedIn, Boss直聘, etc.)
  source_url VARCHAR(1000), -- 原始职位链接
  external_id VARCHAR(200), -- 外部网站的职位ID
  status ENUM('SAVED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN') DEFAULT 'SAVED',
  priority ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
  deadline DATE,           -- 申请截止日期
  notes TEXT,              -- 用户备注
  tags JSON,               -- 用户标签
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_company ON jobs(company);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
CREATE INDEX idx_jobs_deadline ON jobs(deadline);
CREATE INDEX idx_jobs_is_favorite ON jobs(is_favorite);
```

### 4. 申请记录表 (applications)
```sql
CREATE TABLE applications (
  id VARCHAR(30) PRIMARY KEY DEFAULT gen_cuid(),
  user_id VARCHAR(30) NOT NULL,
  resume_id VARCHAR(30) NOT NULL,
  job_id VARCHAR(30) NOT NULL,
  status ENUM(
    'APPLIED',
    'SCREENING',
    'PHONE_SCREEN',
    'TECHNICAL_TEST',
    'INTERVIEW_SCHEDULED',
    'FIRST_INTERVIEW',
    'SECOND_INTERVIEW',
    'FINAL_INTERVIEW',
    'REFERENCE_CHECK',
    'OFFER_PENDING',
    'OFFER_RECEIVED',
    'OFFER_ACCEPTED',
    'OFFER_DECLINED',
    'REJECTED',
    'WITHDRAWN'
  ) DEFAULT 'APPLIED',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_status_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  timeline JSON,           -- 申请时间线记录
  match_score DECIMAL(5,2), -- AI匹配分数 (0-100)
  cover_letter TEXT,       -- 求职信
  follow_up_date DATE,     -- 计划跟进日期
  interview_feedback TEXT, -- 面试反馈
  salary_offered INTEGER,  -- 收到的薪资offer
  rejection_reason TEXT,   -- 拒绝原因
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  
  UNIQUE KEY unique_user_job (user_id, job_id)  -- 每个用户每个职位只能申请一次
);

-- 索引
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at);
CREATE INDEX idx_applications_follow_up_date ON applications(follow_up_date);
```

### 5. 技能表 (skills)
```sql
CREATE TABLE skills (
  id VARCHAR(30) PRIMARY KEY DEFAULT gen_cuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  category ENUM(
    'PROGRAMMING_LANGUAGE',
    'FRAMEWORK',
    'DATABASE',
    'TOOL',
    'SOFT_SKILL',
    'CERTIFICATION',
    'LANGUAGE',
    'OTHER'
  ) NOT NULL,
  description TEXT,
  popularity_score INTEGER DEFAULT 0,  -- 技能热度评分
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_popularity ON skills(popularity_score);
```

### 6. 简历技能关联表 (resume_skills)
```sql
CREATE TABLE resume_skills (
  id VARCHAR(30) PRIMARY KEY DEFAULT gen_cuid(),
  resume_id VARCHAR(30) NOT NULL,
  skill_id VARCHAR(30) NOT NULL,
  level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT') DEFAULT 'INTERMEDIATE',
  years_experience DECIMAL(3,1) DEFAULT 0,  -- 使用该技能的年限
  last_used_year INTEGER,  -- 最后使用年份
  is_primary BOOLEAN DEFAULT false,  -- 是否为核心技能
  
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  
  UNIQUE KEY unique_resume_skill (resume_id, skill_id)
);

-- 索引
CREATE INDEX idx_resume_skills_resume_id ON resume_skills(resume_id);
CREATE INDEX idx_resume_skills_skill_id ON resume_skills(skill_id);
CREATE INDEX idx_resume_skills_level ON resume_skills(level);
```

### 7. 职位技能关联表 (job_skills)
```sql
CREATE TABLE job_skills (
  id VARCHAR(30) PRIMARY KEY DEFAULT gen_cuid(),
  job_id VARCHAR(30) NOT NULL,
  skill_id VARCHAR(30) NOT NULL,
  required BOOLEAN DEFAULT true,      -- 是否必需
  priority ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
  min_experience_years DECIMAL(3,1) DEFAULT 0,
  
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  
  UNIQUE KEY unique_job_skill (job_id, skill_id)
);

-- 索引
CREATE INDEX idx_job_skills_job_id ON job_skills(job_id);
CREATE INDEX idx_job_skills_skill_id ON job_skills(skill_id);
CREATE INDEX idx_job_skills_required ON job_skills(required);
```

### 8. AI分析结果表 (ai_analyses)
```sql
CREATE TABLE ai_analyses (
  id VARCHAR(30) PRIMARY KEY DEFAULT gen_cuid(),
  user_id VARCHAR(30) NOT NULL,
  resume_id VARCHAR(30),
  job_id VARCHAR(30),
  analysis_type ENUM('RESUME_ANALYSIS', 'JOB_MATCH', 'RESUME_SCORE', 'SUGGESTIONS') NOT NULL,
  input_data JSON,         -- 分析输入数据
  output_data JSON,        -- 分析输出结果
  model_version VARCHAR(50), -- 使用的AI模型版本
  confidence_score DECIMAL(5,2), -- 置信度分数
  processing_time INTEGER, -- 处理时间（毫秒）
  tokens_used INTEGER,     -- 使用的token数量
  cost DECIMAL(10,6),      -- 分析成本
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX idx_ai_analyses_user_id ON ai_analyses(user_id);
CREATE INDEX idx_ai_analyses_type ON ai_analyses(analysis_type);
CREATE INDEX idx_ai_analyses_created_at ON ai_analyses(created_at);
```

### 9. 用户活动日志表 (user_activities)
```sql
CREATE TABLE user_activities (
  id VARCHAR(30) PRIMARY KEY DEFAULT gen_cuid(),
  user_id VARCHAR(30) NOT NULL,
  activity_type ENUM(
    'LOGIN',
    'LOGOUT', 
    'RESUME_UPLOAD',
    'RESUME_UPDATE',
    'JOB_SAVED',
    'APPLICATION_SUBMITTED',
    'APPLICATION_STATUS_UPDATED',
    'AI_ANALYSIS_REQUESTED',
    'PROFILE_UPDATED'
  ) NOT NULL,
  entity_type VARCHAR(50),  -- 相关实体类型 (resume, job, application)
  entity_id VARCHAR(30),    -- 相关实体ID
  metadata JSON,            -- 活动元数据
  ip_address INET,          -- IP地址
  user_agent TEXT,          -- 用户代理
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX idx_user_activities_created_at ON user_activities(created_at);
```

## 📈 数据统计视图

### 用户统计视图
```sql
CREATE VIEW user_stats AS
SELECT 
  u.id,
  u.email,
  u.created_at,
  COUNT(DISTINCT r.id) as resume_count,
  COUNT(DISTINCT j.id) as job_count,
  COUNT(DISTINCT a.id) as application_count,
  COUNT(CASE WHEN a.status IN ('OFFER_RECEIVED', 'OFFER_ACCEPTED') THEN 1 END) as offer_count,
  COUNT(CASE WHEN a.status = 'REJECTED' THEN 1 END) as rejection_count,
  ROUND(
    COUNT(CASE WHEN a.status IN ('OFFER_RECEIVED', 'OFFER_ACCEPTED') THEN 1 END) * 100.0 / 
    NULLIF(COUNT(a.id), 0), 2
  ) as success_rate
FROM users u
LEFT JOIN resumes r ON u.id = r.user_id
LEFT JOIN jobs j ON u.id = j.user_id
LEFT JOIN applications a ON u.id = a.user_id
GROUP BY u.id, u.email, u.created_at;
```

### 职位申请流程统计
```sql
CREATE VIEW application_funnel AS
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM applications 
GROUP BY status
ORDER BY 
  CASE status
    WHEN 'APPLIED' THEN 1
    WHEN 'SCREENING' THEN 2
    WHEN 'PHONE_SCREEN' THEN 3
    WHEN 'TECHNICAL_TEST' THEN 4
    WHEN 'FIRST_INTERVIEW' THEN 5
    WHEN 'SECOND_INTERVIEW' THEN 6
    WHEN 'FINAL_INTERVIEW' THEN 7
    WHEN 'REFERENCE_CHECK' THEN 8
    WHEN 'OFFER_PENDING' THEN 9
    WHEN 'OFFER_RECEIVED' THEN 10
    WHEN 'OFFER_ACCEPTED' THEN 11
    WHEN 'OFFER_DECLINED' THEN 12
    WHEN 'REJECTED' THEN 13
    WHEN 'WITHDRAWN' THEN 14
  END;
```

## 🔧 数据库维护

### 分区策略
```sql
-- 按月分区用户活动日志
CREATE TABLE user_activities_2024_01 PARTITION OF user_activities
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE user_activities_2024_02 PARTITION OF user_activities
FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
```

### 清理策略
```sql
-- 清理90天前的用户活动日志
DELETE FROM user_activities 
WHERE created_at < NOW() - INTERVAL '90 days'
AND activity_type NOT IN ('LOGIN', 'RESUME_UPLOAD', 'APPLICATION_SUBMITTED');

-- 清理已删除用户的相关数据（级联删除已处理）
-- 定期清理过期的AI分析结果
DELETE FROM ai_analyses 
WHERE created_at < NOW() - INTERVAL '180 days'
AND analysis_type = 'SUGGESTIONS';
```

### 性能优化
```sql
-- 定期更新表统计信息
ANALYZE users, resumes, jobs, applications, skills;

-- 重建可能碎片化的索引
REINDEX INDEX CONCURRENTLY idx_applications_user_id;
REINDEX INDEX CONCURRENTLY idx_jobs_created_at;

-- 清理膨胀的表空间
VACUUM (VERBOSE, ANALYZE) applications;
VACUUM (VERBOSE, ANALYZE) user_activities;
```