import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">个人资料</h1>
        <p className="mt-1 text-sm text-gray-600">
          管理您的个人信息和账户设置
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 个人信息 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">姓名</label>
                  <input
                    type="text"
                    defaultValue="张三"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">邮箱</label>
                  <input
                    type="email"
                    defaultValue="zhangsan@example.com"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">手机号码</label>
                  <input
                    type="tel"
                    defaultValue="13800138000"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">工作年限</label>
                  <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option>3-5年</option>
                    <option>1-3年</option>
                    <option>5-10年</option>
                    <option>10年以上</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">期望职位</label>
                  <input
                    type="text"
                    defaultValue="高级前端工程师"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">个人简介</label>
                  <textarea
                    rows={4}
                    defaultValue="具有5年前端开发经验，精通React、Vue等现代前端框架，有丰富的项目管理和团队协作经验。"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  保存更改
                </button>
              </div>
            </div>
          </div>

          {/* 技能标签 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">技能标签</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">添加新技能</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="输入技能名称"
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                      添加
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">当前技能</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      React
                      <button className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      TypeScript
                      <button className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Node.js
                      <button className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Vue.js
                      <button className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Python
                      <button className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 偏好设置 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">求职偏好</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">期望薪资</label>
                    <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option>20K-30K</option>
                      <option>15K-25K</option>
                      <option>25K-35K</option>
                      <option>30K-50K</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">工作类型</label>
                    <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option>全职</option>
                      <option>兼职</option>
                      <option>合同工</option>
                      <option>远程工作</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">期望城市</label>
                  <input
                    type="text"
                    defaultValue="北京, 上海, 深圳"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="用逗号分隔多个城市"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    接受远程工作机会
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    接收职位推荐邮件
                  </label>
                </div>
              </div>
              <div className="mt-6">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  保存偏好
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧信息 */}
        <div className="space-y-6">
          {/* 头像上传 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-gray-600">👤</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">张三</h3>
              <p className="text-sm text-gray-500 mb-4">高级前端工程师</p>
              <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200">
                更换头像
              </button>
            </div>
          </div>

          {/* 账户统计 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">账户统计</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">注册时间</span>
                  <span className="text-sm font-medium text-gray-900">2024-01-01</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">简历数量</span>
                  <span className="text-sm font-medium text-gray-900">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">申请职位</span>
                  <span className="text-sm font-medium text-gray-900">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">AI分析次数</span>
                  <span className="text-sm font-medium text-gray-900">8</span>
                </div>
              </div>
            </div>
          </div>

          {/* 安全设置 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">安全设置</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  修改密码
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  双因素认证
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  登录历史
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                  删除账户
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;