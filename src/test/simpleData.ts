export const simpleData = [{
  path: 'user/detail',
  method: 'get',
  name: '获取用户详情', // 接口名称
  description: '获取用户详情', // 描述
  requestHeader: {
    'Content-Type': 'application/json'
  },
  requestPathParam: {
    name: 'zhangxin'
  },
  requestPathQuery: {
    age: 111
  },
  requestBody: {
    info: {
      parent: '父母'
    }
  },
  responseList: [{
    code: 0,
    message: '',
    data: {
      description: '我是用户详情'
    }
  }]
}]
