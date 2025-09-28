import React from 'react';

const ApplicationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">申请管理</h1>
        <p className="mt-1 text-sm text-gray-600">
          跟踪和管理您的求职申请状态
        </p>
      </div>

      {/* 状态统计 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-gray-900">12</div>
          <div className="text-sm text-gray-500">总申请</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-blue-600">5</div>
          <div className="text-sm text-gray-500">待回复</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-yellow-600">3</div>
          <div className="text-sm text-gray-500">面试邀请</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-green-600">2</div>
          <div className="text-sm text-gray-500">已通过</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-red-600">2</div>
          <div className="text-sm text-gray-500">已拒绝</div>
        </div>
      </div>

      {/* 筛选和排序 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="搜索公司或职位..."
            />
          </div>
          <div>
            <select className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option>全部状态</option>
              <option>已提交</option>
              <option>简历筛选</option>
              <option>电话面试</option>
              <option>现场面试</option>
              <option>待决定</option>
              <option>已通过</option>
              <option>已拒绝</option>
            </select>
          </div>
          <div>
            <select className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option>最新提交</option>
              <option>最早提交</option>
              <option>公司名称</option>
              <option>职位名称</option>
            </select>
          </div>
        </div>
      </div>

      {/* 申请列表 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            求职申请列表
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <div className="divide-y divide-gray-200">
            {/* 申请项目 1 */}
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">腾讯</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">高级前端工程师</h4>
                    <p className="text-sm text-gray-500">腾讯科技 • 深圳</p>
                    <p className="text-xs text-gray-400">申请时间: 2024-01-15 14:30</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    面试邀请
                  </span>
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                    查看详情
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span>💰 25K-40K</span>
                  <span>📅 面试时间: 2024-01-20 10:00</span>
                  <span>📞 联系人: 张经理</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">进度: 面试安排阶段</p>
                </div>
              </div>
            </div>

            {/* 申请项目 2 */}
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-red-600 font-medium text-sm">字节</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">全栈开发工程师</h4>
                    <p className="text-sm text-gray-500">字节跳动 • 北京</p>
                    <p className="text-xs text-gray-400">申请时间: 2024-01-12 09:15</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    已通过
                  </span>
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                    查看详情
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span>💰 30K-50K</span>
                  <span>✅ 已发放Offer</span>
                  <span>📞 HR: 李女士</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '100%'}}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">进度: 已通过所有面试</p>
                </div>
              </div>
            </div>

            {/* 申请项目 3 */}
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 font-medium text-sm">阿里</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">前端架构师</h4>
                    <p className="text-sm text-gray-500">阿里巴巴 • 杭州</p>
                    <p className="text-xs text-gray-400">申请时间: 2024-01-08 16:20</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    简历筛选
                  </span>
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                    查看详情
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span>💰 35K-60K</span>
                  <span>⏰ 等待HR回复</span>
                  <span>📞 招聘专员: 王先生</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '25%'}}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">进度: 简历审核阶段</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;