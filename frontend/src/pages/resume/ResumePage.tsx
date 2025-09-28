import React, { useState, useRef } from 'react';

interface ResumeFile {
  id: string;
  name: string;
  originalName: string;
  version: string;
  size: number;
  uploadTime: string;
  lastModified: string;
  status: 'uploading' | 'analyzing' | 'completed' | 'error';
  analysisScore?: number | undefined;
  isActive: boolean;
  tags: string[];
  description: string;
  targetJobs: string[];
  parentId?: string | undefined; // 用于版本关联
}

const ResumePage: React.FC = () => {
  const [resumes, setResumes] = useState<ResumeFile[]>([
    {
      id: '1',
      name: '软件工程师_张三_v2.1.pdf',
      originalName: '软件工程师_张三.pdf',
      version: 'v2.1',
      size: 1024000,
      uploadTime: '2024-01-15 14:30',
      lastModified: '2024-01-16 09:20',
      status: 'completed',
      analysisScore: 92,
      isActive: true,
      tags: ['前端', 'React', 'TypeScript'],
      description: '专注于前端开发的简历版本，突出React和TypeScript技能',
      targetJobs: ['高级前端工程师', '全栈开发工程师']
    },
    {
      id: '2',
      name: '软件工程师_张三_v1.0.pdf',
      originalName: '软件工程师_张三.pdf',
      version: 'v1.0',
      size: 980000,
      uploadTime: '2024-01-10 09:15',
      lastModified: '2024-01-10 09:15',
      status: 'completed',
      analysisScore: 85,
      isActive: false,
      tags: ['前端', 'Vue'],
      description: '初版简历，主要展示Vue.js相关经验',
      targetJobs: ['前端开发工程师'],
      parentId: '1'
    },
    {
      id: '3',
      name: '后端开发_张三_v1.0.docx',
      originalName: '后端开发_张三.docx',
      version: 'v1.0',
      size: 2048000,
      uploadTime: '2024-01-08 16:45',
      lastModified: '2024-01-08 16:45',
      status: 'analyzing',
      isActive: true,
      tags: ['后端', 'Node.js', 'Python'],
      description: '专门针对后端开发职位的简历版本',
      targetJobs: ['后端开发工程师', 'Node.js工程师']
    }
  ]);
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [editingResume, setEditingResume] = useState<ResumeFile | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'active'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'score'>('date');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleFileSelect called');
    const files = event.target.files;
    console.log('Selected files:', files);
    
    if (files && files.length > 0) {
      console.log('Processing', files.length, 'files');
      handleFileUpload(Array.from(files));
    } else {
      console.log('No files selected');
    }
  };

  const handleFileUpload = async (files: File[]) => {
    console.log('handleFileUpload called with files:', files);
    
    for (const file of files) {
      console.log('Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);
      
      // 验证文件类型和大小
      if (!isValidFile(file)) {
        alert(`文件 ${file.name} 不符合要求。请上传PDF或Word文档，大小不超过10MB。`);
        console.log('File validation failed for:', file.name);
        continue;
      }

      console.log('File validation passed for:', file.name);
      
      // 创建新的简历记录
      const newResume: ResumeFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        originalName: file.name.replace(/\.[^/.]+$/, ""),
        version: 'v1.0',
        size: file.size,
        uploadTime: new Date().toLocaleString('zh-CN'),
        lastModified: new Date().toLocaleString('zh-CN'),
        status: 'uploading',
        isActive: true,
        tags: [],
        description: '新上传的简历',
        targetJobs: []
      };

      console.log('Created resume record:', newResume);
      
      // 添加到列表
      setResumes(prev => {
        console.log('Adding resume to list');
        return [newResume, ...prev];
      });

      try {
        // 模拟上传过程
        console.log('Starting upload simulation for:', file.name);
        await simulateUpload();
        
        console.log('Upload completed, starting analysis for:', file.name);
        // 上传完成后开始分析
        setResumes(prev => prev.map(resume => 
          resume.id === newResume.id 
            ? { ...resume, status: 'analyzing' }
            : resume
        ));

        // 模拟AI分析过程
        setTimeout(() => {
          const score = Math.floor(Math.random() * 30) + 70; // 70-100分
          console.log('Analysis completed for:', file.name, 'Score:', score);
          setResumes(prev => prev.map(resume => 
            resume.id === newResume.id 
              ? { ...resume, status: 'completed', analysisScore: score }
              : resume
          ));
        }, 3000);

      } catch (error) {
        console.error('Upload failed for:', file.name, error);
        setResumes(prev => prev.map(resume => 
          resume.id === newResume.id 
            ? { ...resume, status: 'error' }
            : resume
        ));
        alert(`文件 ${file.name} 上传失败，请重试。`);
      }
    }

    console.log('Upload process completed');
    setShowUploadModal(false);
  };

  const isValidFile = (file: File): boolean => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    console.log('Validating file:', file.name, 'Type:', file.type, 'Size:', file.size);
    console.log('Valid types:', validTypes);
    console.log('Type check:', validTypes.includes(file.type));
    console.log('Size check:', file.size <= maxSize, '(', file.size, '<=', maxSize, ')');

    const isValid = validTypes.includes(file.type) && file.size <= maxSize;
    console.log('File validation result:', isValid);
    
    return isValid;
  };

  const simulateUpload = (): Promise<void> => {
    return new Promise((resolve) => {
      // 模拟上传进度
      setTimeout(resolve, 2000);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Files dropped:', e.dataTransfer.files);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      console.log('Processing dropped files:', files.length);
      handleFileUpload(files);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading': return 'bg-blue-100 text-blue-800';
      case 'analyzing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading': return '上传中';
      case 'analyzing': return '分析中';
      case 'completed': return '已完成';
      case 'error': return '上传失败';
      default: return '未知状态';
    }
  };

  const deleteResume = (id: string) => {
    if (window.confirm('确定要删除这份简历吗？')) {
      setResumes(prev => prev.filter(resume => resume.id !== id));
    }
  };

  // 创建简历新版本
  const createNewVersion = (resume: ResumeFile) => {
    const currentVersionNum = parseFloat(resume.version.replace('v', ''));
    const newVersion = `v${(currentVersionNum + 0.1).toFixed(1)}`;
    
    const newResume: ResumeFile = {
      ...resume,
      id: Date.now().toString() + Math.random(),
      name: resume.originalName + '_' + newVersion + resume.name.substring(resume.name.lastIndexOf('.')),
      version: newVersion,
      uploadTime: new Date().toLocaleString('zh-CN'),
      lastModified: new Date().toLocaleString('zh-CN'),
      status: 'completed',
      analysisScore: undefined,
      parentId: resume.parentId || resume.id
    };
    
    // 将旧版本设为非活跃状态
    setResumes(prev => prev.map(r => 
      r.originalName === resume.originalName ? { ...r, isActive: false } : r
    ));
    
    // 添加新版本
    setResumes(prev => [newResume, ...prev]);
    setEditingResume(newResume);
    setShowEditModal(true);
  };

  // 克隆简历（创建副本）
  const cloneResume = (resume: ResumeFile) => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const clonedResume: ResumeFile = {
      ...resume,
      id: Date.now().toString() + Math.random(),
      name: `${resume.originalName}_副本_${timestamp}${resume.name.substring(resume.name.lastIndexOf('.'))}`,
      originalName: `${resume.originalName}_副本_${timestamp}`,
      version: 'v1.0',
      uploadTime: new Date().toLocaleString('zh-CN'),
      lastModified: new Date().toLocaleString('zh-CN'),
      status: 'completed',
      analysisScore: undefined,
      parentId: undefined
    };
    
    setResumes(prev => [clonedResume, ...prev]);
  };

  // 设置为主要版本
  const setAsActiveVersion = (resume: ResumeFile) => {
    setResumes(prev => prev.map(r => {
      if (r.originalName === resume.originalName) {
        return { ...r, isActive: r.id === resume.id };
      }
      return r;
    }));
  };

  // 编辑简历信息
  const saveResumeEdit = (updatedResume: ResumeFile) => {
    setResumes(prev => prev.map(r => 
      r.id === updatedResume.id 
        ? { ...updatedResume, lastModified: new Date().toLocaleString('zh-CN') }
        : r
    ));
    setShowEditModal(false);
    setEditingResume(null);
  };

  // 获取简历版本历史
  const getResumeVersions = (resume: ResumeFile) => {
    return resumes.filter(r => 
      r.originalName === resume.originalName || 
      r.parentId === resume.id || 
      r.id === resume.parentId
    ).sort((a, b) => parseFloat(b.version.replace('v', '')) - parseFloat(a.version.replace('v', '')));
  };

  // 过滤和排序简历
  const getFilteredAndSortedResumes = () => {
    let filtered = viewMode === 'active' ? resumes.filter(r => r.isActive) : resumes;
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'score':
          return (b.analysisScore || 0) - (a.analysisScore || 0);
        case 'date':
        default:
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">简历管理</h1>
          <p className="mt-1 text-sm text-gray-600">
            管理您的简历文件、多版本和AI分析结果
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* 筛选控制 */}
          <select 
            value={viewMode} 
            onChange={(e) => setViewMode(e.target.value as 'all' | 'active')}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="all">全部简历</option>
            <option value="active">仅活跃版本</option>
          </select>
          
          {/* 排序控制 */}
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'score')}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="date">按时间排序</option>
            <option value="name">按名称排序</option>
            <option value="score">按评分排序</option>
          </select>
          
          <button 
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            上传新简历
          </button>
        </div>
      </div>        {/* 简历列表 */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {getFilteredAndSortedResumes().length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {getFilteredAndSortedResumes().map((resume) => (
                <li key={resume.id} className={`${!resume.isActive ? 'bg-gray-50' : ''}`}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            resume.isActive ? 'bg-indigo-100' : 'bg-gray-200'
                          }`}>
                            <span className={`font-medium text-xs ${
                              resume.isActive ? 'text-indigo-600' : 'text-gray-500'
                            }`}>
                              {resume.name.split('.').pop()?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900">
                              {resume.name}
                            </p>
                            {resume.isActive && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                活跃
                              </span>
                            )}
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {resume.version}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(resume.size)} • 上传: {resume.uploadTime}
                          </p>
                          {resume.lastModified !== resume.uploadTime && (
                            <p className="text-xs text-gray-400">
                              修改: {resume.lastModified}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-1">
                            {resume.description}
                          </p>
                          {/* 标签 */}
                          {resume.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {resume.tags.map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(resume.status)}`}>
                          {getStatusText(resume.status)}
                        </span>
                        
                        {/* 操作按钮 */}
                        <div className="flex items-center space-x-1">
                          {resume.status === 'completed' && (
                            <>
                              <button 
                                onClick={() => {
                                  setEditingResume(resume);
                                  setShowEditModal(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium px-2 py-1"
                                title="编辑"
                              >
                                编辑
                              </button>
                              <button 
                                onClick={() => createNewVersion(resume)}
                                className="text-green-600 hover:text-green-900 text-sm font-medium px-2 py-1"
                                title="创建新版本"
                              >
                                新版本
                              </button>
                              <button 
                                onClick={() => cloneResume(resume)}
                                className="text-blue-600 hover:text-blue-900 text-sm font-medium px-2 py-1"
                                title="克隆"
                              >
                                克隆
                              </button>
                              {!resume.isActive && (
                                <button 
                                  onClick={() => setAsActiveVersion(resume)}
                                  className="text-orange-600 hover:text-orange-900 text-sm font-medium px-2 py-1"
                                  title="设为主版本"
                                >
                                  设为主版本
                                </button>
                              )}
                              <button 
                                onClick={() => {
                                  setSelectedResumeId(resume.id);
                                  setShowVersionModal(true);
                                }}
                                className="text-purple-600 hover:text-purple-900 text-sm font-medium px-2 py-1"
                                title="查看版本历史"
                              >
                                版本历史
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => deleteResume(resume.id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium px-2 py-1"
                            title="删除"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                    {resume.status === 'completed' && resume.analysisScore && (
                      <div className="mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <span>AI分析评分: </span>
                          <div className="ml-2 flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  resume.analysisScore >= 80 ? 'bg-green-600' : 
                                  resume.analysisScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                                }`}
                                style={{width: `${resume.analysisScore}%`}}
                              ></div>
                            </div>
                            <span className={`ml-2 font-medium ${
                              resume.analysisScore >= 80 ? 'text-green-600' : 
                              resume.analysisScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {resume.analysisScore}分
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    {resume.status === 'analyzing' && (
                      <div className="mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <span>AI分析进度: </span>
                          <div className="ml-2 flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div className="bg-yellow-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                            </div>
                            <span className="ml-2">分析中...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <div className="w-12 h-12 mx-auto bg-gray-400 rounded-md flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无简历</h3>
              <p className="mt-1 text-sm text-gray-500">
                开始上传您的第一份简历，让AI为您分析
              </p>
              <div className="mt-6">
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  上传简历
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 上传模态框 */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div 
                className="fixed inset-0 transition-opacity" 
                aria-hidden="true"
                onClick={() => setShowUploadModal(false)}
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        上传简历
                      </h3>
                      
                      {/* 文件上传区域 - 使用label方式确保兼容性 */}
                      <label 
                        htmlFor="resume-file-input"
                        className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="mt-4">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            拖拽文件到此处，或
                            <span className="text-indigo-600"> 点击选择文件</span>
                          </span>
                          <input
                            id="resume-file-input"
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              console.log('文件输入变化:', e.target.files);
                              if (e.target.files && e.target.files.length > 0) {
                                console.log('处理所选文件');
                                handleFileSelect(e);
                              } else {
                                console.log('未选择文件');
                              }
                              // 重置input value，允许重复选择同一文件
                              e.target.value = '';
                            }}
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            支持PDF、DOC、DOCX格式，单个文件最大10MB
                          </p>
                        </div>
                      </label>
                      
                      {/* 备用按钮，以防label方式不工作 */}
                      <div className="mt-4 flex justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            console.log('备用按钮被点击');
                            if (fileInputRef.current) {
                              console.log('触发文件选择器');
                              fileInputRef.current.click();
                            } else {
                              console.error('文件输入引用为空');
                            }
                          }}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          选择文件
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 编辑模态框 */}
        {showEditModal && editingResume && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div 
                className="fixed inset-0 transition-opacity" 
                aria-hidden="true"
                onClick={() => setShowEditModal(false)}
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      编辑简历 - {editingResume.version}
                    </h3>
                    
                    <div className="space-y-4">
                      {/* 简历名称 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">简历名称</label>
                        <input
                          type="text"
                          value={editingResume.name}
                          onChange={(e) => setEditingResume({...editingResume, name: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      {/* 描述 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">描述</label>
                        <textarea
                          rows={3}
                          value={editingResume.description}
                          onChange={(e) => setEditingResume({...editingResume, description: e.target.value})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      {/* 技能标签 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">技能标签（逗号分隔）</label>
                        <input
                          type="text"
                          value={editingResume.tags.join(', ')}
                          onChange={(e) => setEditingResume({...editingResume, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="例如: React, TypeScript, Node.js"
                        />
                      </div>
                      
                      {/* 目标职位 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">目标职位（逗号分隔）</label>
                        <input
                          type="text"
                          value={editingResume.targetJobs.join(', ')}
                          onChange={(e) => setEditingResume({...editingResume, targetJobs: e.target.value.split(',').map(j => j.trim()).filter(j => j)})}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="例如: 前端开发工程师, 全栈开发工程师"
                        />
                      </div>
                      
                      {/* 活跃状态 */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingResume.isActive}
                          onChange={(e) => setEditingResume({...editingResume, isActive: e.target.checked})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                          设为活跃版本
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => saveResumeEdit(editingResume)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    保存
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingResume(null);
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 版本历史模态框 */}
        {showVersionModal && selectedResumeId && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div 
                className="fixed inset-0 transition-opacity" 
                aria-hidden="true"
                onClick={() => setShowVersionModal(false)}
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      版本历史
                    </h3>
                    
                    {(() => {
                      const selectedResume = resumes.find(r => r.id === selectedResumeId);
                      if (!selectedResume) return null;
                      const versions = getResumeVersions(selectedResume);
                      
                      return (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {versions.map((version) => (
                            <div key={version.id} className={`border rounded-lg p-4 ${
                              version.isActive ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200'
                            }`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                                    version.isActive ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {version.version}
                                  </span>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{version.name}</p>
                                    <p className="text-xs text-gray-500">修改时间: {version.lastModified}</p>
                                  </div>
                                  {version.isActive && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      当前活跃
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  {version.analysisScore && (
                                    <span className={`text-sm font-medium ${
                                      version.analysisScore >= 80 ? 'text-green-600' : 
                                      version.analysisScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                      {version.analysisScore}分
                                    </span>
                                  )}
                                  {!version.isActive && (
                                    <button 
                                      onClick={() => {
                                        setAsActiveVersion(version);
                                        setShowVersionModal(false);
                                      }}
                                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                    >
                                      设为活跃
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => {
                                      setEditingResume(version);
                                      setShowVersionModal(false);
                                      setShowEditModal(true);
                                    }}
                                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                                  >
                                    编辑
                                  </button>
                                </div>
                              </div>
                              {version.description && (
                                <p className="text-sm text-gray-600 mt-2">{version.description}</p>
                              )}
                              {version.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {version.tags.map((tag, index) => (
                                    <span key={index} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => setShowVersionModal(false)}
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePage;