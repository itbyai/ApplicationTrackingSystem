import React from 'react';

const JobsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">职位管理</h1>
          <p className="mt-1 text-sm text-gray-600">
            浏览和管理所有职位信息
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
          添加职位
        </button>
      </div>

      {/* 筛选器 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">搜索职位</label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="输入职位名称或公司名"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">职位类型</label>
            <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option>全部类型</option>
              <option>全职</option>
              <option>兼职</option>
              <option>合同工</option>
              <option>实习</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">薪资范围</label>
            <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option>不限</option>
              <option>5K-10K</option>
              <option>10K-20K</option>
              <option>20K-30K</option>
              <option>30K以上</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">工作地点</label>
            <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option>不限</option>
              <option>北京</option>
              <option>上海</option>
              <option>深圳</option>
              <option>杭州</option>
            </select>
          </div>
        </div>
      </div>

      {/* 职位列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">高级前端工程师</h3>
              <p className="text-sm text-gray-500">腾讯科技</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              活跃招聘
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">📍 深圳 • 南山区</p>
            <p className="text-sm text-gray-600">💰 25K-40K</p>
            <p className="text-sm text-gray-600">⏰ 3-5年经验</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
              React
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
              TypeScript
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
              Node.js
            </span>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm text-gray-500">匹配度: </span>
              <div className="ml-2 flex items-center">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
                <span className="ml-2 text-sm font-medium text-green-600">92%</span>
              </div>
            </div>
            <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
              申请职位
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">全栈开发工程师</h3>
              <p className="text-sm text-gray-500">字节跳动</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              推荐
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">📍 北京 • 朝阳区</p>
            <p className="text-sm text-gray-600">💰 30K-50K</p>
            <p className="text-sm text-gray-600">⏰ 3-5年经验</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
              Vue.js
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
              Python
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
              Docker
            </span>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm text-gray-500">匹配度: </span>
              <div className="ml-2 flex items-center">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
                <span className="ml-2 text-sm font-medium text-yellow-600">78%</span>
              </div>
            </div>
            <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
              申请职位
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">资深前端架构师</h3>
              <p className="text-sm text-gray-500">阿里巴巴</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              紧急招聘
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">📍 杭州 • 西湖区</p>
            <p className="text-sm text-gray-600">💰 35K-60K</p>
            <p className="text-sm text-gray-600">⏰ 5-10年经验</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
              React
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
              微前端
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
              工程化
            </span>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm text-gray-500">匹配度: </span>
              <div className="ml-2 flex items-center">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
                <span className="ml-2 text-sm font-medium text-red-600">65%</span>
              </div>
            </div>
            <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
              申请职位
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;