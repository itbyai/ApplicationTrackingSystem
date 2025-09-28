// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// 认证相关API类型
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

// 文件上传相关类型
export interface FileUploadResponse {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  uploadedAt: Date;
}

// 搜索和过滤类型
export interface JobSearchParams {
  query?: string;
  location?: string;
  company?: string;
  salaryMin?: number;
  salaryMax?: number;
  jobType?: WorkType;
  remoteType?: RemoteType;
  status?: JobStatus;
  priority?: Priority;
  isFavorite?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApplicationSearchParams {
  status?: ApplicationStatus;
  company?: string;
  position?: string;
  appliedFrom?: Date;
  appliedTo?: Date;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// AI分析请求类型
export interface ResumeAnalysisRequest {
  resumeId: string;
  analysisTypes: AnalysisType[];
}

export interface JobMatchingRequest {
  resumeId: string;
  jobIds?: string[];
  filters?: JobSearchParams;
  maxResults?: number;
}

export interface ResumeAnalysisResponse {
  score: number;
  strengths: string[];
  improvements: string[];
  skillsAnalysis: {
    technical: SkillAnalysis[];
    soft: SkillAnalysis[];
    missing: string[];
  };
  experienceAnalysis: {
    totalYears: number;
    relevantExperience: number;
    careerProgression: 'junior' | 'mid' | 'senior' | 'lead';
  };
  educationAnalysis: {
    relevance: number;
    certifications: string[];
  };
}

export interface SkillAnalysis {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  relevance: number;
}

export interface JobMatchingResponse {
  matches: JobMatch[];
  totalMatches: number;
  searchCriteria: JobSearchParams;
}

export interface JobMatch {
  job: Job;
  score: number;
  matchReasons: string[];
  skillsMatch: {
    matching: string[];
    missing: string[];
    percentage: number;
  };
  salaryMatch?: {
    isMatch: boolean;
    difference: number;
    percentage: number;
  };
  locationMatch?: {
    isMatch: boolean;
    distance?: number;
  };
}

// 统计数据类型
export interface DashboardStats {
  totalResumes: number;
  totalJobs: number;
  totalApplications: number;
  activeInterviews: number;
  offersReceived: number;
  applicationStats: {
    applied: number;
    screening: number;
    interviewing: number;
    offers: number;
    rejected: number;
  };
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'resume_uploaded' | 'job_applied' | 'interview_scheduled' | 'status_updated';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: any;
}

// 图表数据类型
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}

// 表单相关类型
export interface FormErrors {
  [key: string]: string | undefined;
}

export interface FormState<T = any> {
  data: T;
  errors: FormErrors;
  isSubmitting: boolean;
  isValid: boolean;
}

// 通用工具类型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type CreateRequest<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateRequest<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;

// 重新导出核心类型
export * from './index';