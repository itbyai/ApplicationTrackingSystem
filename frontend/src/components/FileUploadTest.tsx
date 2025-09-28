import React, { useRef } from 'react';

const FileUploadTest: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log('文件选择事件触发:', files);
    if (files && files.length > 0) {
      console.log('选择了文件:');
      Array.from(files).forEach((file, index) => {
        console.log(`文件 ${index + 1}: ${file.name}, 大小: ${file.size} bytes, 类型: ${file.type}`);
      });
      alert(`成功选择了 ${files.length} 个文件!`);
    } else {
      console.log('没有选择文件');
      alert('没有选择文件');
    }
  };

  const triggerFileInput = () => {
    console.log('触发文件输入:', fileInputRef.current);
    if (fileInputRef.current) {
      console.log('调用 click() 方法');
      fileInputRef.current.click();
    } else {
      console.error('文件输入引用为空!');
      alert('文件输入引用为空!');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">文件上传调试</h2>
      
      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      
      {/* 触发按钮 */}
      <div className="space-y-4">
        <button
          onClick={triggerFileInput}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600"
        >
          点击选择文件
        </button>
        
        {/* 上传区域 */}
        <div 
          onClick={triggerFileInput}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400"
        >
          <p className="text-gray-600">点击这个区域选择文件</p>
          <p className="text-sm text-gray-400 mt-2">支持 PDF, DOC, DOCX 格式</p>
        </div>
        
        {/* 原生文件输入（对照组） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            原生文件输入（对照）:
          </label>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              console.log('原生输入选择:', e.target.files);
              if (e.target.files && e.target.files.length > 0) {
                alert(`原生输入选择了 ${e.target.files.length} 个文件!`);
              }
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <p className="text-sm text-gray-600">
          打开浏览器开发者工具查看控制台日志
        </p>
      </div>
    </div>
  );
};

export default FileUploadTest;