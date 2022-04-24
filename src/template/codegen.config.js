module.exports = {
  // ts interface 配置
  tsConfig: {
    /* swagger 文件地址 */
    swaggerPath: '',

    // 导出路径
    exportPath: './exports',

    /*
      若接口返回的是类似 { code: number, message: string, data: any } 这种数据
      往往我们只需要 data，这时我们可设置 dataKey 为 data，返回的就是 data 的值
    */
    dataKey: 'data',

    /*
      必填：设置interface名称
      changeCase 的相关API 参考: change-case
    */
    setInterfaceName({ changeCase, parsedPath, method }, interfaceType) {
      const pascalName = changeCase.pascalCase(parsedPath.name);  // 路径最后一个变量
      const methodName = changeCase.pascalCase(method);           // 请求方式

      return `${pascalName}${methodName}${interfaceType}`;
    }
  },

  // service 配置
  serviceConfig: {
    /* 导出路径 */
    exportPath: './services',

    /* 导出文件名 */
    exportFileName: 'index',

    /**
     * 设置模板变量
     * interfaceList: 接口描述 列表，如下
     * [{
          title,
          method,
          path,
          res_body_type,
          req_body_type,
          req_headers: [{
            name,
            value
          }]
     * }]
     *
     * changeCase 的相关API 参考: change-case
     * */
    setTemplateVariable(interfaceList, changeCase) {
      return {
        interfaceList: interfaceList.map((item) => {
          const name = `${item.method.toLocaleLowerCase()} ${item.path.split('/').slice(-2).join(' ')}`;
          return {
            name: changeCase.camelCase(name),
            ...item,
          }
        })
      }
    },

    /**
     * service 模板路径
     */
    templatePath: './kapi-cli.service.template.js'
  },
}
