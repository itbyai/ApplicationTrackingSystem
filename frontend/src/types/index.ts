// 用户相关类型
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: Date;
  
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
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
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
  experience?: any;
  education?: any;
  
  // 元数据
  isDefault: boolean;
  isAnalyzed: boolean;
  
  // 时间戳
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

// 申请相关类型
export interface Application {
  id: string;
  userId: string;
  jobId: string;
  resumeId: string;
  
  // 申请信息
  status: ApplicationStatus;
  appliedAt: Date;
  
  // 跟进信息
  nextFollowUp?: Date;
  notes?: string;
  
  // 关联数据
  job?: Job;
  resume?: Resume;
  interviews: Interview[];
  timeline: ApplicationTimeline[];
  
  // 时间戳
  createdAt: Date;
  updatedAt: Date;
}

// 面试相关类型
export interface Interview {
  id: string;
  applicationId: string;
  type: InterviewType;
  scheduledAt: Date;
  duration?: number;
  location?: string;
  interviewer?: string;
  notes?: string;
  feedback?: string;
  status: InterviewStatus;
  
  createdAt: Date;
  updatedAt: Date;
}

// 申请时间线
export interface ApplicationTimeline {
  id: string;
  applicationId: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: Date;
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
  analysis: any;
  
  // 元数据
  model: string;
  tokens?: number;
  cost?: number;
  
  createdAt: Date;
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