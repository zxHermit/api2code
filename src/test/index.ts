// import swaggerJson from './swagger-large.json';
import swaggerSimple from "./swagger-simple.json";
import { getApiBySwagger, genTSByApi } from "../open";
import { simpleData } from './simpleData';
import fs from "fs-extra";

// 验证 swagger
// (async () => {
//   // @ts-expect-error
//   const apiData = await getApiBySwagger(swaggerSimple);
//   const apiList = apiData.apiList;


//   const TSCodes = await genTSByApi(apiList, 'jsonSchema', "./exports");

//   // 文件输出
//   for (const [path, schema] of Object.entries(TSCodes)) {
//     fs.outputFileSync(path, schema);
//   }
// })();


// 验证 json
(async () => {
  const TSCodes = await genTSByApi(simpleData, 'json', "./exports");

  // 文件输出
  for (const [path, schema] of Object.entries(TSCodes)) {
    fs.outputFileSync(path, schema);
  }
})();
