import path from "path";
import jsonToJsonSchema from 'to-json-schema';
import { dataTypeEnum, ObjectValueTS, SwaggerJsonTS, ApiJsonItemTS, ApiJsonSchemaItemTS,
  ApiInfoTS, GenTSOptionsTS, GenHTTPOptionsTS } from './types/index';
import { parseSwagger } from './utils/parseSwagger';
import { genTSByJsonSchema } from './utils/transform';
import { pascalCase } from 'change-case';



/**
 * 获取API数据，通过 swagger
 *
 * @param {SwaggerJsonTS} swagger
 * @return {*}  {Promise<ApiInfoTS>}
 */
export const getApiBySwagger = async (swagger: SwaggerJsonTS): Promise<ApiInfoTS> => {
  const result = await parseSwagger(swagger);

  return result;
}

/**
 * 获取TS类型代码，通过API数据
 */
export const genTSByApi = async (apiList: ApiJsonSchemaItemTS[] | ApiJsonItemTS[], dataType:
  dataTypeEnum, exportPath: string, options: GenTSOptionsTS = {}): Promise<{[key: string]: string}> => {

  const fileTSNameCount: ObjectValueTS = {};
  const pathInterfaceNum: ObjectValueTS = {};

  // @ts-ignore
  const apiListSchema = apiList.reduce((total: ObjectValueTS, item: ApiItemSimpleTS) => {

    const { name, path, method, requestPathParam, requestPathQuery, requestBody, responseList } = item;

    if (!total[path]) {
      total[path] = {
        type: 'object',
        description: `TS类型代码：请求url为 ${path}`,
        properties: {},
        required: true
      }

      pathInterfaceNum[path] = 0;
    }

    pathInterfaceNum[path] += 1;

    let pathSplit = path.split('/');
    pathSplit = pathSplit.filter((item: string) => item);
    const preName = pascalCase(`${pathSplit[pathSplit.length - 1]} ${method.toLowerCase()}`);
    const properties: ObjectValueTS = total[path].properties;

    const getJsonSchema = (data: ObjectValueTS, type: dataTypeEnum) => {
      return type === dataTypeEnum.json ? jsonToJsonSchema(data, {required: true}) : data;
    }

    // 请求 url param
    const requestPathParamHandled = {
      ...getJsonSchema(requestPathParam, dataType),
      description: `接口名称：${name} \n 接口请求方法：${method.toUpperCase()} \n 接口请求路径：${path} \n  \n TS类型代码：请求url param`
    };
    if (properties[`${preName}RequestPathParam`]) {
      const num = fileTSNameCount[`${path}-${preName}RequestPathParam`] += 1;
      properties[`${preName}RequestPathParam${num}`] = requestPathParamHandled;
    } else {
      properties[`${preName}RequestPathParam`] = requestPathParamHandled;
      fileTSNameCount[`${path}-${preName}RequestPathParam`] = 0;
    }

    // 请求 url query
    const requestPathQueryHandled = {
      ...getJsonSchema(requestPathQuery, dataType),
      description: `接口名称：${name} \n 接口请求方法：${method.toUpperCase()} \n 接口请求路径：${path} \n  \n TS类型代码：请求url query`
    }
    if (properties[`${preName}RequestPathQuery`]) {
      const num = fileTSNameCount[`${path}-${preName}RequestPathQuery`] += 1;
      properties[`${preName}RequestPathQuery${num}`] = requestPathQueryHandled;
    } else {
      properties[`${preName}RequestPathQuery`] = requestPathQueryHandled;
      fileTSNameCount[`${path}-${preName}RequestPathQuery`] = 0;
    }

    // 请求 body TODO: 具体类型
    const requestBodyHandled = {
      ...getJsonSchema(requestBody, dataType),
      description: `接口名称：${name} \n 接口请求方法：${method.toUpperCase()} \n 接口请求路径：${path} \n  \n TS类型代码：请求body`
    }

    console.log('---requestBodyHandled', requestBodyHandled);

    if (properties[`${preName}RequestBody`]) {
      const num = fileTSNameCount[`${path}-${preName}RequestBody`] += 1;
      properties[`${preName}RequestBody${num}`] = requestBodyHandled;
    } else {
      properties[`${preName}RequestBody`] = requestBodyHandled;
      fileTSNameCount[`${path}-${preName}RequestBody`] = 0;
    }

    if (responseList.length === 1) {
      const statusCode = responseList[0].statusCode;
      const lastLineDescription = statusCode === undefined ? `响应body` : `状态码为${statusCode}的响应body`;
      const responseBodyHandled = {
        ...getJsonSchema(responseList[0], dataType),
        description: `接口名称：${name} \n 接口请求方法：${method.toUpperCase()} \n 接口请求路径：${path} \n  \n TS类型代码：${lastLineDescription}`
      };
      if (properties[`${preName}ResponseBody`]) {
        const num = fileTSNameCount[`${path}-${preName}ResponseBody`] += 1;
        properties[`${preName}ResponseBody${num}`] = responseBodyHandled;
      } else {
        properties[`${preName}ResponseBody`] = responseBodyHandled;
        fileTSNameCount[`${path}-${preName}ResponseBody`] = 0;
      }
    } else {
      // 非 swagger 数据，注意状态码取值判空
      responseList.forEach((listItem: ObjectValueTS, index: number) => {
        const statusCode = listItem.statusCode;
        const lastLineDescription = statusCode === undefined ? `第${index+1}个响应body` : `状态码为${statusCode}的响应body`;
        const responseBodyHandled = {
          ...getJsonSchema(listItem, dataType),
          description: `接口名称：${name} \n 接口请求方法：${method.toUpperCase()} \n 接口请求路径：${path} \n  \n TS类型代码：${lastLineDescription}`
        };

        if (properties[`${preName}ResponseBody${statusCode}`]) {
          const num = fileTSNameCount[`${path}-${preName}ResponseBody${statusCode}`] += 1;
          properties[`${preName}${statusCode}ResponseBody${num}`] = responseBodyHandled;
        } else {
          properties[`${preName}ResponseBody${statusCode}`] = responseBodyHandled;
          fileTSNameCount[`${path}-${preName}ResponseBody${statusCode}`] = 0;
        }
      });
    }
    return total;
  }, {});


  const result:ObjectValueTS = {};

  for (const [key, value] of Object.entries(apiListSchema)) {
    const filePath = path.resolve(process.cwd(), `${exportPath}${key.startsWith('/') ? key : '/'+key}.ts`);

    // @ts-ignore
    value.description = `${value.description}，共涵盖${pathInterfaceNum[key]}个接口`;

    // @ts-ignore
    result[filePath] = await genTSByJsonSchema(value);
  }

  return result;
}

/**
 * 获取HTTP请求代码，通过API数据
 *
 * @param {ApiItemSimpleTS[]} apiList
 * @param {string} exportPath
 * @param {GenHTTPOptionsTS} [options={}]
 * @return {*}  {Promise<string>}
 */
export const getHTTPByApi = async (apiList: ApiItemSimpleTS[], exportPath: string, options: GenHTTPOptionsTS = {}): Promise<string> => {

  console.log('---apiList', apiList);

  return ''
}
