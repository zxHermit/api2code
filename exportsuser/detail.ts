/**
 * TS类型代码：请求url为 user/detail，共涵盖1个接口
 */


/**
 * 接口名称：获取用户详情
 * 接口请求方法：GET
 * 接口请求路径：user/detail
 *
 * TS类型代码：请求body
 */
export interface DetailGetRequestBody {
    info: Info;
}

export interface Info {
    parent: string;
    required?: any;
}

/**
 * 接口名称：获取用户详情
 * 接口请求方法：GET
 * 接口请求路径：user/detail
 *
 * TS类型代码：请求url param
 */
export interface DetailGetRequestPathParam {
    name: string;
}

/**
 * 接口名称：获取用户详情
 * 接口请求方法：GET
 * 接口请求路径：user/detail
 *
 * TS类型代码：请求url query
 */
export interface DetailGetRequestPathQuery {
    age: number;
}

/**
 * 接口名称：获取用户详情
 * 接口请求方法：GET
 * 接口请求路径：user/detail
 *
 * TS类型代码：响应body
 */
export interface DetailGetResponseBody {
    code: number;
    data: Data;
    message: string;
}

export interface Data {
    description: string;
    required?: any;
}
