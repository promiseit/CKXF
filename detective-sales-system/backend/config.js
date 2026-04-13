// 配置文件
module.exports = {
  port: 3001,
  // 大模型API配置
  models: {
    wenxin: {
      defaultUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions'
    },
    tongyi: {
      defaultUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
    },
    deepseek: {
      defaultUrl: 'https://api.deepseek.com/chat/completions'
    },
    doubao: {
      defaultUrl: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
    }
  }
};