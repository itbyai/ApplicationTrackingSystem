import React from 'react';

const AiAnalysisPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">AI 智能分析</h1>
        <p className="mt-1 text-sm text-gray-600">
          利用AI技术分析您的简历和职位匹配度，提供个性化建议
        </p>
      </div>

      {/* AI功能卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">📄</span>
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">简历分析</h3>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            AI深度分析您的简历结构、技能匹配度和改进建议
          </p>
          <button className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            开始分析
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🎯</span>
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">职位匹配</h3>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            基于您的技能和经验，智能推荐最适合的职位机会
          </p>
          <button className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
            匹配职位
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">💡</span>
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">技能提升</h3>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            识别技能差距，提供个性化的学习建议和发展路径
          </p>
          <button className="mt-4 w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            查看建议
          </button>
        </div>
      </div>

      {/* 最近分析结果 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">最近分析结果</h3>
        </div>
        <div className="p-6 space-y-6">
          {/* 分析结果 1 */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900">简历优化建议</h4>
                <p className="text-sm text-gray-500">2024-01-15 14:30</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500">整体评分: </span>
                <span className="ml-1 text-lg font-bold text-green-600">85分</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"></span>
                <div>
                  <p className="text-sm font-medium text-gray-900">技能关键词优化</p>
                  <p className="text-sm text-gray-600">建议增加 "React Hooks", "TypeScript", "微服务架构" 等关键词，提高简历搜索匹配度</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-2"></span>
                <div>
                  <p className="text-sm font-medium text-gray-900">工作经验描述</p>
                  <p className="text-sm text-gray-600">可以更具体地量化工作成果，如"提升页面加载速度40%"、"负责团队5人管理"</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></span>
                <div>
                  <p className="text-sm font-medium text-gray-900">教育背景</p>
                  <p className="text-sm text-gray-600">建议添加相关认证和持续学习经历，展现持续学习能力</p>
                </div>
              </div>
            </div>
          </div>

          {/* 分析结果 2 */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900">职位匹配分析</h4>
                <p className="text-sm text-gray-500">2024-01-12 09:15</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500">匹配度: </span>
                <span className="ml-1 text-lg font-bold text-blue-600">92%</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">技能匹配</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '95%'}}></div>
                  </div>
                  <span className="ml-2 text-sm text-green-600">95%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">经验匹配</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '88%'}}></div>
                  </div>
                  <span className="ml-2 text-sm text-green-600">88%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">学历要求</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                  <span className="ml-2 text-sm text-yellow-600">78%</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mt-3">
                您的技能与"高级前端工程师"职位高度匹配，建议重点关注React生态系统和工程化实践经验的展示。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 技能发展建议 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">技能发展建议</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">推荐学习技能</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-900">Next.js</span>
                  <span className="text-xs text-blue-600 bg-blue-200 px-2 py-1 rounded">高优先级</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-green-900">GraphQL</span>
                  <span className="text-xs text-green-600 bg-green-200 px-2 py-1 rounded">中优先级</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-purple-900">Kubernetes</span>
                  <span className="text-xs text-purple-600 bg-purple-200 px-2 py-1 rounded">低优先级</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">热门职位要求</h4>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">• 微前端架构经验 (85%的高级职位)</div>
                <div className="text-sm text-gray-600">• 性能优化实践 (78%的高级职位)</div>
                <div className="text-sm text-gray-600">• 团队协作与Code Review (72%的高级职位)</div>
                <div className="text-sm text-gray-600">• 跨端开发经验 (65%的高级职位)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAnalysisPage;