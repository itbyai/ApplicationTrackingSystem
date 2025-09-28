// 共享的TypeScript类型定义
// 这些类型将在前端和后端之间共享

// 用户相关类型
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  
  // 职业偏好
  desiredPosition?: string;
  desiredLocation?: string;
  salaryMin?: number;
  salaryMax?: number;
  workType: WorkType;
  remoteType: RemoteType;
  
  // 通知设置
  emailNotifications: boolean;
  jobMatchNotifications: boolean;
  statusUpdateNotifications: boolean;
  interviewReminders: boolean;
  marketingEmails: boolean;
  
  // 隐私设置
  resumeVisibility: ResumeVisibility;
  
  // 时间戳
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// 简历相关类型
export interface Resume {
  id: string;
  userId: string;
  title: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  
  // 解析后的内容
  content?: string;
  skills: string[];
  experience?: Experience[];
  education?: Education[];
  
  // 元数据
  isDefault: boolean;
  isAnalyzed: boolean;
  
  // 时间戳
  createdAt: string;
  updatedAt: string;
}

// 工作经历类型
export interface Experience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  location?: string;
  skills?: string[];
}

// 教育经历类型
export interface Education {
  id?: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  gpa?: number;
  description?: string;
}

// 职位相关类型
export interface Job {
  id: string;
  userId: string;
  title: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  
  // 职位详情
  description?: string;
  requirements?: string;
  benefits?: string;
  jobType: WorkType;
  remoteType: RemoteType;
  
  // 来源信息
  source?: string;
  sourceUrl?: string;
  
  // 状态管理
  status: JobStatus;
  priority: Priority;
  isFavorite: boolean;
  
  // AI分析
  aiScore?: number;
  aiAnalysis?: any;
  
  // 时间戳
  createdAt: string;
  updatedAt: string;
}

// 申请相关类型
export interface Application {
  id: string;
  userId: string;
  jobId: string;
  resumeId: string;
  
  // 申请信息
  status: ApplicationStatus;
  appliedAt: string;
  
  // 跟进信息
  nextFollowUp?: string;
  notes?: string;
  
  // 关联数据
  job?: Job;
  resume?: Resume;
  interviews: Interview[];
  timeline: ApplicationTimeline[];
  
  // 时间戳
  createdAt: string;
  updatedAt: string;
}

// 面试相关类型
export interface Interview {
  id: string;
  applicationId: string;
  type: InterviewType;
  scheduledAt: string;
  duration?: number; // 面试时长(分钟)
  location?: string; // 面试地点或链接
  interviewer?: string; // 面试官
  notes?: string; // 面试笔记
  feedback?: string; // 面试反馈
  status: InterviewStatus;
  
  createdAt: string;
  updatedAt: string;
}

// 申请时间线
export interface ApplicationTimeline {
  id: string;
  applicationId: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: string;
}

// AI分析相关类型
export interface AiAnalysis {
  id: string;
  userId: string;
  resumeId?: string;
  jobId?: string;
  type: AnalysisType;
  
  // 分析结果
  score?: number;
  analysis: any; // 详细分析结果
  
  // 元数据
  model: string; // 使用的AI模型
  tokens?: number; // 消耗的token数
  cost?: number; // 分析成本
  
  createdAt: string;
}

// 技能类型
export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  createdAt: string;
}

// 枚举类型
export enum WorkType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
  FREELANCE = 'FREELANCE'
}

export enum RemoteType {
  OFFICE = 'OFFICE',
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID'
}

export enum JobStatus {
  SAVED = 'SAVED',
  APPLIED = 'APPLIED',
  INTERVIEWING = 'INTERVIEWING',
  OFFER_RECEIVED = 'OFFER_RECEIVED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  SCREENING = 'SCREENING',
  PHONE_INTERVIEW = 'PHONE_INTERVIEW',
  TECHNICAL_INTERVIEW = 'TECHNICAL_INTERVIEW',
  ONSITE_INTERVIEW = 'ONSITE_INTERVIEW',
  FINAL_INTERVIEW = 'FINAL_INTERVIEW',
  OFFER_RECEIVED = 'OFFER_RECEIVED',
  OFFER_ACCEPTED = 'OFFER_ACCEPTED',
  OFFER_DECLINED = 'OFFER_DECLINED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

export enum InterviewType {
  PHONE = 'PHONE',
  VIDEO = 'VIDEO',
  ONSITE = 'ONSITE',
  TECHNICAL = 'TECHNICAL',
  BEHAVIORAL = 'BEHAVIORAL',
  PANEL = 'PANEL'
}

export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum ResumeVisibility {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  CONTACTS_ONLY = 'CONTACTS_ONLY'
}

export enum AnalysisType {
  RESUME_ANALYSIS = 'RESUME_ANALYSIS',
  JOB_MATCHING = 'JOB_MATCHING',
  RESUME_SCORING = 'RESUME_SCORING',
  SKILL_ANALYSIS = 'SKILL_ANALYSIS'
}