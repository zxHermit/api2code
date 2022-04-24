import {
  ApiInfoTS,
  OptionsTS,
  JsonTypeEnum,
  ApiItemTS,
  ObjectValueTS,
  SchemaObjectTS,
} from "./types";
import { jsonSchema2Interface } from "./utils/transform";

export const genTS = (apiInfo: ApiInfoTS, options: OptionsTS): string => {
  const jsonSchemaList: ObjectValueTS = {};

  apiInfo.apiList.forEach(async (item: ApiItemTS) => {
    const filePath = item.path;

    if (!jsonSchemaList[filePath]) {
      jsonSchemaList[filePath] = {
        type: "object",
        properties: {},
      };
    }

    const targetSchema = jsonSchemaList[filePath][
      "properties"
    ] as SchemaObjectTS;

    jsonSchemaList[filePath].description = `请求description`;
    // quickJs转化时title的优先级会更高
    jsonSchemaList[filePath].title = "title";
    jsonSchemaList[filePath].required = true;

    targetSchema.requestPathParam = item.requestPathParam;
    targetSchema.requestPathQuery = item.requestPathQuery;
    // targetSchema.requestBody = item.requestBody;

    console.log("---jsonSchemaList", Object.values(jsonSchemaList)[0]);

    const interfaceStr = await jsonSchema2Interface(Object.values(jsonSchemaList)[0])

    // const interfaceStr = await jsonSchema2Interface({
    //   type: "object",
    //   properties: {
    //     name: { type: "string" },
    //     email: { type: "string" },
    //     address: { type: "string" },
    //     telephone: { type: "string" },
    //   },
    //   required: ["name", "email"],
    // });

    console.log("---interfaceStr", interfaceStr);
  });

  return "1111";
};
