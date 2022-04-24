import swagger from 'swagger-client';
import { ApiInfoTS, SwaggerJsonTS, CommonParamTS, SwaggerApiTS, SchemaObjectTS, SwaggerParameterTS } from '../types'


// 响应列表
const getResponseList = (api: SwaggerApiTS) => {
  const responseList = [];
  for (const [statusCode, val] of Object.entries(api.responses)) {
    responseList.push({
      statusCode,
      type: val.type,
      description: val.description,
      ...(val.schema ? val.schema : {})
    })
  }

  return responseList;
}

// 获取请求信息

const getRequestInfo = (api: SwaggerApiTS) => {
  const requestHeader: CommonParamTS[] = [];
  const requestPathParam: CommonParamTS[] = []; // 请求路径参数
  const requestPathQuery: CommonParamTS[] = []; // 请求路径query
  // @ts-ignore
  let requestBody: SchemaObjectTS = {}; // 请求体
  let requestBodyType = 'json';


  if (Array.isArray(api.consumes)) {
    requestHeader.push({
      name: "Content-Type",
      required: true,
      value: api.consumes[0]
    })

    if (
      api.consumes.includes("application/x-www-form-urlencoded") ||
      api.consumes.includes("multipart/form-data")
    ) {
      requestBodyType = "form";
    } else if (api.consumes.includes("application/json")) {
      requestBodyType = "json";
    }
  }

  if (Array.isArray(api.parameters)) {
    api.parameters.forEach(item => {
      if (item === "object" && item.$ref) {
        item = simpleJsonPathParse(item.$ref, {
          parameters: api.parameters
        });
      }

      // 必填 非必填
      const defaultParam: CommonParamTS = {
        name: item.name,
        required: item.required || false,
        description: item.description
      };

      switch (item.in) {
        case "path":
          requestPathParam.push({...defaultParam, type: item.type || 'string'});
          break;
        case "query":
          requestPathQuery.push({...defaultParam, type: item.type || 'string'});
          break;
        case "body":
          requestBody = {
            name: item.name,
            required: item.required,
            description: item.description,
            ...(item.schema ? item.schema : {})
          }
          break;
        // TODO: 暂不考虑 formData 情况
        // case "formData":
        //   defaultParam.type = item.type || "text";
        //   if (!Array.isArray(requestBody)) {
        //     requestBody = [];
        //   }
        //   requestBody.push({...defaultParam, type: item.type || "text"});
        //   break;
        case "header":
          requestHeader.push(defaultParam);
          break;
      }
    });
  }

  //处理参数
  function simpleJsonPathParse(key: string, json: {parameters: SwaggerParameterTS}) {
    if (
      !key ||
      typeof key !== "string" ||
      key.indexOf("#/") !== 0 ||
      key.length <= 2
    ) {
      return null;
    }
    let keys: string[] = key.substr(2).split("/");
    keys = keys.filter(item => {
      return item;
    });
    for (let i = 0, l = keys.length; i < l; i++) {
      try {
        // @ts-expect-error
        json = json[keys[i]];
      } catch (e) {
        // @ts-expect-error
        json = "";
        break;
      }
    }
    return json;
  }

  const requestPathParamHandle = requestPathParam.reduce((total, item) => {
    // @ts-ignore
    total[item.name] = {
      type: item.type,
      required: item.required,
      description: item.description
    }
    return total;
  }, {});

  const requestPathQueryHandle = requestPathQuery.reduce((total, item) => {
    // @ts-ignore
    total[item.name] = {
      type: item.type,
      required: item.required,
      description: item.description
    }
    return total;
  }, {});

  return { requestHeader, requestPathParam: {
    name: 'requestPathParam',
    required: true,
    description: '请求Param参数',
    type: 'object',
    properties: requestPathParamHandle,
  }, requestPathQuery: {
    name: 'requestPathQuery',
    required: true,
    description: '请求Query参数',
    type: 'object',
    properties: requestPathQueryHandle,

    // @ts-ignore
  }, requestBody: {
    name: 'requestBody',
    ...(requestBody || {})
  }, requestBodyType };
}




/**
 * 解析 swagger，生成 语义化json
 * @param {object | string} data
 * @return {}
 */
 export const parseSwagger = async (data: SwaggerJsonTS): Promise<ApiInfoTS>  => {
  try {
    if (typeof data === 'string') {
      // data = data.trim();
      // // 嗅探, json
      // if (data[0] === '{' && data.substr(-1, 1) === '}') {
      //   data = json_parse(data);
      // // guess yaml
      // } else {
      //   data = jsYaml.safeLoad(data);
      // }
    }

    // 转换成 swagger 2.0
    // if (data.openapi === "3.0.0") {
    //   data = openapi2swagger(data);
    // }

    // 解析swagger: 给schema赋值
    const dataHandle = await swagger({
      spec: data
    });

    data = dataHandle.spec;

    // 拼装 apiList
    const apiList = [];

    for (const [path, apis] of Object.entries(data.paths)) {
      for (const [method, item] of Object.entries(apis)) {
        const { requestHeader, requestPathParam, requestPathQuery, requestBody, requestBodyType } = getRequestInfo(item);

        apiList.push({
          path,
          method,
          tags: item.tags,
          name: item.summary || item.description,
          summary: item.summary, // 摘要
          description: item.description, // 描述
          requestHeader, // 请求头
          requestBodyType, // 请求体类型
          requestPathParam, // 请求路径param
          requestPathQuery,  // 请求路径query
          requestBody,  // 请求体
          responseList: getResponseList(item)
        })
      }
    }
    return {
      swagger: data.swagger,
      info: data.info || {},
      basePath: data.basePath || '',
      tags: data.tags || [],
      // @ts-expect-error
      apiList,
      paths: data.paths,
      definitions: data.definitions
    };
  } catch (e) {
    console.error(e);
    return {
      swagger: data.swagger,
      info: data.info,
      basePath: data.basePath,
      tags: data.tags,
      apiList: [],
      paths: data.paths,
      definitions: data.definitions
    };
  }
}
