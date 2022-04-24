// import jsonToJsonSchema from "to-json-schema";

export interface SwaggerJsonTS {
  swagger: string
  info: SwaggerInfoTS
  basePath: string
  tags: ApiTagItemTS[]
  paths: {
    [key: string]: {
      [key: string]: SwaggerApiTS
    }
  }
  definitions: {
    [key: string]: SchemaObjectTS
  }
  openapi?: string
}

interface SwaggerInfoTS {
  title: string
  version: string
  description: string
  contact?: {  // 联系人
    name: string
    url: string
    email: string
  },
  license?: {  // 许可证
    name: string
    url: string
  }
  termsOfService?: string  // 服务期限
}

enum SwaggerParameterInEnum {
  path,
  query,
  body,
  formData,
  header
}

export enum SchemaTypeEnum {
  string,
  number,
  integer,
  boolean,
  object,
  array,
  null,
  any,
}

export interface SchemaObjectTS {
  type: SchemaTypeEnum
  required?: string[]
  properties?: {
    [key: string]: SchemaObjectTS
  }
  items?: SchemaObjectTS
}

export interface SwaggerParameterTS {
  name: string
  type: SchemaTypeEnum
  description: string,
  required: boolean,
  in: SwaggerParameterInEnum,
  schema: {
    type: SchemaTypeEnum
    $ref: string
  }
}

interface SwaggerResponsesTS {
  type: string
  description: string,
  schema: {
    $ref: string
  }
}

export interface CommonParamTS {
  name: string
  type?: string
  description?: string
  required?: boolean
  schema?: SchemaObjectTS
  value?: string
}


export interface SwaggerApiTS {
  summary: string  // 摘要
  description: string
  tags: string[]
  parameters: SwaggerParameterTS // 请求数据
  responses: { // 响应数据
    [key: string]: SwaggerResponsesTS
  }
  operationId?: string
  deprecated?: boolean
  consumes?: string[]
}

interface ApiTagItemTS {
  name: string
  description: string
}

// 响应项
interface ResponseItemTS {
  statusCode: number
  description: string
  data: SchemaObjectTS
}

export interface ApiItemTS {
  path: string
  method: string
  tags: string[]
  name: string // 接口名称
  summary: string // 摘要
  description: string // 描述
  requestPathParam: CommonParamTS[] // 请求路径参数
  requestPathQuery: CommonParamTS[]  // 请求路径query
  requestHeader: CommonParamTS[] // 请求头
  requestBodyType: string // jdon form row
  requestBody: CommonParamTS[] | string | SchemaObjectTS
  responseList: ResponseItemTS[]
}



// jsonSchema格式的 api列表
export interface ApiJsonSchemaItemTS {
  path: string
  method: string
  name: string // 接口名称
  description: string // 描述
  requestPathParam: SchemaObjectTS // 请求路径参数
  requestPathQuery:SchemaObjectTS  // 请求路径query
  requestHeader: SchemaObjectTS // 请求头
  requestBody: SchemaObjectTS
  responseList: SchemaObjectTS
}

// json 格式的 api列表
export interface ApiJsonItemTS {
  path: string
  method: string
  name: string // 接口名称
  description: string // 描述
  requestPathParam: ObjectValueTS // 请求路径参数
  requestPathQuery:ObjectValueTS  // 请求路径query
  requestHeader: ObjectValueTS // 请求头
  requestBody: ObjectValueTS
  responseList: ObjectValueTS[] | [][]
}



export interface ApiInfoTS {
  swagger: string
  info: SwaggerInfoTS
  basePath: string
  tags: ApiTagItemTS[]
  apiList: ApiItemTS[],
  definitions: {
    [key: string]: SchemaObjectTS
  }
  paths: {
    [key: string]: {
      [key: string]: SwaggerApiTS
    }
  }
}

export interface GenCodeResultTS {
  apiInfo: ApiInfoTS
  ts?: string
  service?: string
}

export const enum genListEnum {
  ts = 'ts',
  service = 'service'
}

export const enum dataTypeEnum {
  json = 'json',
  jsonSchema = 'jsonSchema'
}

export interface TSOptionTS {
  // 自定义 ts interface 名称
  setTSInterfaceName?: () => string
}

export interface OptionsTS {
  // 源数据路径
  originDataPath?: string

  // 自定义 ts interface 名称
  setTSInterfaceName?: () => string

  // 自定义 service 模板
  serviceTemplate?: string

  // 自定义 service 模板变量
  setServiceTemplateVariable?: () => ({ [key: string]: any })
}


export enum JsonTypeEnum {
  json = 'json',
  jsonSchema = 'jsonSchema'
}


export interface ObjectValueTS {
  [key: string]: any
}


export interface GenTSOptionsTS {
  // responseDataKey?: string
  setInterfaceName?: Function
}

export interface GenHTTPOptionsTS {
  template?: string
  setTemplateVariable?: Function
}
