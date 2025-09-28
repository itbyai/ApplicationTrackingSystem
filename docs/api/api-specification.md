# API 设计文档

## 🌐 API 概览

### 基本信息
- **Base URL**: `https://api.jobtracker.com/v1`
- **协议**: HTTPS
- **认证**: JWT Bearer Token
- **数据格式**: JSON
- **编码**: UTF-8

### 响应格式
```typescript
// 成功响应
{
  "success": true,
  "data": any,
  "message": string,
  "timestamp": string
}

// 错误响应
{
  "success": false,
  "error": {
    "code": string,
    "message": string,
    "details": any
  },
  "timestamp": string
}
```

## 🔐 认证模块 API

### POST /auth/register
用户注册

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "张",
  "lastName": "三",
  "phone": "+86-13800138000"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clp123456789",
      "email": "user@example.com",
      "firstName": "张",
      "lastName": "三",
      "avatar": null,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "注册成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /auth/login
用户登录

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clp123456789",
      "email": "user@example.com",
      "firstName": "张",
      "lastName": "三",
      "avatar": "https://example.com/avatar.jpg"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "登录成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET /auth/me
获取当前用户信息

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "clp123456789",
    "email": "user@example.com",
    "firstName": "张",
    "lastName": "三",
    "avatar": "https://example.com/avatar.jpg",
    "phone": "+86-13800138000",
    "location": "北京市",
    "preferredJobTitle": "前端工程师",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "获取用户信息成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /auth/refresh
刷新访问令牌

**请求体**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /auth/logout
用户退出登录

## 📄 简历管理 API

### GET /resumes
获取用户简历列表

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 10, 最大: 50)
- `sort`: 排序字段 (createdAt, updatedAt, title)
- `order`: 排序方向 (asc, desc)

**响应**:
```json
{
  "success": true,
  "data": {
    "resumes": [
      {
        "id": "clr123456789",
        "title": "前端开发工程师简历",
        "fileType": "PDF",
        "fileSize": 1024000,
        "isPrimary": true,
        "lastAnalyzedAt": "2024-01-01T00:00:00.000Z",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  },
  "message": "获取简历列表成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /resumes
上传简历

**请求格式**: `multipart/form-data`

**请求字段**:
- `file`: 简历文件 (PDF, DOC, DOCX)
- `title`: 简历标题
- `isPrimary`: 是否设为主简历 (可选)

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "clr123456789",
    "title": "前端开发工程师简历",
    "filePath": "/uploads/resumes/clr123456789.pdf",
    "fileType": "PDF",
    "fileSize": 1024000,
    "isPrimary": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "简历上传成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET /resumes/:id
获取特定简历详情

**路径参数**:
- `id`: 简历ID

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "clr123456789",
    "title": "前端开发工程师简历",
    "content": {
      "personalInfo": {
        "name": "张三",
        "email": "user@example.com",
        "phone": "+86-13800138000"
      },
      "experience": [
        {
          "company": "ABC科技有限公司",
          "position": "前端开发工程师",
          "duration": "2022-01 至 2024-01",
          "description": "负责公司主要产品的前端开发..."
        }
      ],
      "skills": ["JavaScript", "React", "TypeScript", "Node.js"],
      "education": [
        {
          "school": "北京理工大学",
          "degree": "计算机科学与技术学士",
          "duration": "2018-09 至 2022-06"
        }
      ]
    },
    "analysis": {
      "skillsExtracted": ["JavaScript", "React", "TypeScript"],
      "experienceYears": 2,
      "strongPoints": ["前端开发经验丰富", "技术栈全面"],
      "suggestions": ["建议增加项目管理经验描述"]
    },
    "filePath": "/uploads/resumes/clr123456789.pdf",
    "fileType": "PDF",
    "isPrimary": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "获取简历详情成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### PUT /resumes/:id
更新简历信息

**请求体**:
```json
{
  "title": "高级前端开发工程师简历",
  "isPrimary": true
}
```

### DELETE /resumes/:id
删除简历

## 💼 职位管理 API

### GET /jobs
获取职位列表

**查询参数**:
- `page`: 页码
- `limit`: 每页数量
- `status`: 职位状态筛选
- `company`: 公司名称筛选
- `location`: 地点筛选
- `search`: 搜索关键词
- `sort`: 排序字段
- `order`: 排序方向

**响应**:
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "clj123456789",
        "title": "前端开发工程师",
        "company": "阿里巴巴集团",
        "location": "杭州市",
        "salaryMin": 20000,
        "salaryMax": 35000,
        "salaryCurrency": "CNY",
        "workType": "FULL_TIME",
        "remoteOption": "HYBRID",
        "status": "SAVED",
        "priority": "HIGH",
        "source": "Boss直聘",
        "isFavorite": true,
        "deadline": "2024-02-01",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    },
    "filters": {
      "statusCounts": {
        "SAVED": 20,
        "APPLIED": 15,
        "INTERVIEW": 5,
        "OFFER": 2,
        "REJECTED": 3
      },
      "companyCounts": {
        "阿里巴巴集团": 5,
        "腾讯科技": 3,
        "字节跳动": 4
      }
    }
  },
  "message": "获取职位列表成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /jobs
添加职位

**请求体**:
```json
{
  "title": "前端开发工程师",
  "company": "阿里巴巴集团",
  "description": "负责公司核心产品的前端开发工作...",
  "requirements": "熟练掌握React、Vue等前端框架...",
  "salaryMin": 20000,
  "salaryMax": 35000,
  "location": "杭州市",
  "workType": "FULL_TIME",
  "remoteOption": "HYBRID",
  "source": "Boss直聘",
  "sourceUrl": "https://boss.zhipin.com/job/123456",
  "deadline": "2024-02-01",
  "priority": "HIGH",
  "tags": ["前端", "React", "大厂"],
  "notes": "看起来很不错的机会"
}
```

### GET /jobs/:id
获取职位详情

### PUT /jobs/:id
更新职位信息

### PUT /jobs/:id/status
更新职位状态

**请求体**:
```json
{
  "status": "APPLIED",
  "notes": "已提交申请，等待回复"
}
```

### DELETE /jobs/:id
删除职位

## 📋 申请记录 API

### GET /applications
获取申请记录列表

**查询参数**:
- `page`, `limit`: 分页参数
- `status`: 申请状态筛选
- `jobId`: 特定职位的申请
- `resumeId`: 使用特定简历的申请
- `dateFrom`, `dateTo`: 申请日期范围

**响应**:
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "cla123456789",
        "job": {
          "id": "clj123456789",
          "title": "前端开发工程师",
          "company": "阿里巴巴集团",
          "location": "杭州市"
        },
        "resume": {
          "id": "clr123456789",
          "title": "前端开发工程师简历"
        },
        "status": "FIRST_INTERVIEW",
        "appliedAt": "2024-01-01T00:00:00.000Z",
        "lastStatusUpdate": "2024-01-05T00:00:00.000Z",
        "matchScore": 85.5,
        "followUpDate": "2024-01-10",
        "timeline": [
          {
            "status": "APPLIED",
            "date": "2024-01-01T00:00:00.000Z",
            "notes": "提交申请"
          },
          {
            "status": "SCREENING",
            "date": "2024-01-03T00:00:00.000Z",
            "notes": "通过简历筛选"
          },
          {
            "status": "FIRST_INTERVIEW",
            "date": "2024-01-05T00:00:00.000Z",
            "notes": "完成一轮技术面试"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 12,
      "totalPages": 1
    },
    "statistics": {
      "totalApplications": 12,
      "pendingApplications": 5,
      "interviewRate": 0.42,
      "offerRate": 0.17,
      "successRate": 0.08
    }
  },
  "message": "获取申请记录成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /applications
创建申请记录

**请求体**:
```json
{
  "jobId": "clj123456789",
  "resumeId": "clr123456789",
  "coverLetter": "尊敬的招聘经理...",
  "notes": "通过内推申请的职位"
}
```

### PUT /applications/:id/status
更新申请状态

**请求体**:
```json
{
  "status": "SECOND_INTERVIEW",
  "notes": "二轮面试安排在下周三",
  "followUpDate": "2024-01-15",
  "interviewFeedback": "技术面试表现良好，需要加强项目经验介绍"
}
```

### GET /applications/:id/timeline
获取申请时间线

## 🤖 AI 分析 API

### POST /ai/analyze-resume
AI简历分析

**请求体**:
```json
{
  "resumeId": "clr123456789"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "resumeId": "clr123456789",
    "analysis": {
      "skillsExtracted": [
        {
          "name": "JavaScript",
          "category": "PROGRAMMING_LANGUAGE",
          "confidence": 0.95,
          "yearsExperience": 3
        },
        {
          "name": "React",
          "category": "FRAMEWORK", 
          "confidence": 0.90,
          "yearsExperience": 2
        }
      ],
      "experienceSummary": {
        "totalYears": 3.5,
        "companies": ["ABC科技", "XYZ公司"],
        "positions": ["前端开发工程师", "初级前端开发"]
      },
      "strengths": [
        "前端技术栈完整",
        "有大型项目经验",
        "学习能力强"
      ],
      "weaknesses": [
        "缺少团队管理经验",
        "后端技能有限"
      ],
      "suggestions": [
        "建议补充项目管理相关经验",
        "可以学习一些后端技术",
        "增加开源项目贡献"
      ],
      "overallScore": 82,
      "scoreBreakdown": {
        "technical": 85,
        "experience": 78,
        "education": 80,
        "projects": 85
      }
    },
    "processingTime": 2500,
    "modelVersion": "gpt-4-turbo",
    "tokensUsed": 1500
  },
  "message": "简历分析完成",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /ai/match-jobs
AI职位匹配

**请求体**:
```json
{
  "resumeId": "clr123456789",
  "jobIds": ["clj123456789", "clj987654321"],
  "limit": 10
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "jobId": "clj123456789",
        "job": {
          "title": "前端开发工程师",
          "company": "阿里巴巴集团",
          "location": "杭州市"
        },
        "matchScore": 87.5,
        "matchDetails": {
          "skillsMatch": 0.85,
          "experienceMatch": 0.90,
          "locationMatch": 0.80,
          "salaryMatch": 0.95
        },
        "matchedSkills": [
          "JavaScript", "React", "TypeScript"
        ],
        "missingSkills": [
          "Vue.js", "微信小程序"
        ],
        "recommendations": [
          "你的React经验很符合要求",
          "建议学习Vue.js以提高匹配度"
        ]
      }
    ],
    "summary": {
      "totalJobs": 2,
      "averageScore": 78.5,
      "bestMatch": {
        "jobId": "clj123456789",
        "score": 87.5
      }
    }
  },
  "message": "职位匹配分析完成",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /ai/score-resume
AI简历评分

**请求体**:
```json
{
  "resumeId": "clr123456789",
  "jobId": "clj123456789"
}
```

### POST /ai/generate-suggestions
生成改进建议

## 📊 统计分析 API

### GET /analytics/dashboard
获取仪表盘数据

**响应**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalResumes": 3,
      "totalJobs": 25,
      "totalApplications": 12,
      "activeApplications": 5,
      "offerCount": 2,
      "interviewCount": 3
    },
    "applicationTrend": [
      {
        "month": "2024-01",
        "applications": 8,
        "interviews": 3,
        "offers": 1
      }
    ],
    "statusDistribution": [
      {"status": "APPLIED", "count": 5},
      {"status": "SCREENING", "count": 2},
      {"status": "FIRST_INTERVIEW", "count": 3}
    ],
    "topCompanies": [
      {"company": "阿里巴巴集团", "applications": 3},
      {"company": "腾讯科技", "applications": 2}
    ],
    "skillsAnalysis": {
      "mostRequiredSkills": [
        {"skill": "JavaScript", "frequency": 15},
        {"skill": "React", "frequency": 12}
      ],
      "skillsGap": [
        {"skill": "Vue.js", "missingInResume": true},
        {"skill": "Docker", "missingInResume": true}
      ]
    }
  },
  "message": "获取仪表盘数据成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET /analytics/reports
获取详细报告

## 🔍 搜索 API

### GET /search/jobs
职位搜索

**查询参数**:
- `q`: 搜索关键词
- `location`: 地点
- `salary`: 薪资范围
- `workType`: 工作类型
- `experience`: 经验要求

### GET /search/suggestions
搜索建议

## 📱 用户设置 API

### GET /profile
获取用户档案

### PUT /profile
更新用户档案

### POST /profile/avatar
上传头像

### GET /settings
获取用户设置

### PUT /settings
更新用户设置

## 🚨 错误码定义

| 错误码 | HTTP状态码 | 描述 |
|--------|------------|------|
| AUTH_TOKEN_MISSING | 401 | 缺少认证token |
| AUTH_TOKEN_INVALID | 401 | 无效的token |
| AUTH_TOKEN_EXPIRED | 401 | token已过期 |
| USER_NOT_FOUND | 404 | 用户不存在 |
| RESUME_NOT_FOUND | 404 | 简历不存在 |
| JOB_NOT_FOUND | 404 | 职位不存在 |
| FILE_TOO_LARGE | 413 | 文件过大 |
| FILE_TYPE_NOT_SUPPORTED | 400 | 不支持的文件类型 |
| VALIDATION_ERROR | 400 | 数据验证失败 |
| RATE_LIMIT_EXCEEDED | 429 | 请求频率超限 |
| AI_SERVICE_UNAVAILABLE | 503 | AI服务不可用 |
| INTERNAL_SERVER_ERROR | 500 | 内部服务器错误 |