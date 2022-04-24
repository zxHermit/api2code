import { quicktype, InputData, JSONSchemaInput, JSONSchemaStore, jsonInputForTargetLanguage } from 'quicktype-core';
import { SchemaObjectTS } from '../types';


/**
 * 生成代码，通过JsonSchema
 * https://github.com/quicktype/quicktype
 *
 * @param {string} targetLanguage
 * @param {string} typeName
 * @param {string} jsonSchema
 * @return {*}
 */
export const genCodeByJsonSchema = async (targetLanguage: string, typeName: string, jsonSchema: string): Promise<{lines: string[]}> => {
  const schemaInput = new JSONSchemaInput(new JSONSchemaStore());
  const inputData = new InputData();

  await schemaInput.addSource({ name: typeName, schema: jsonSchema });

  inputData.addInput(schemaInput);

  return await quicktype({
    inputData,
    lang: targetLanguage,
    "rendererOptions": {
      "just-types": 'true',
    }
  });
}


/**
 * 生成代码，通过Json
 * https://github.com/quicktype/quicktype
 *
 * @param {string} targetLanguage
 * @param {string} typeName
 * @param {string} jsonString
 * @return {*}  {Promise<{lines: string[]}}
 */
 export const genCodeByJson = async (targetLanguage: string, typeName: string, jsonString: string): Promise<{lines: string[]}> => {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage);
  const inputData = new InputData();

  await jsonInput.addSource({ name: typeName, samples: [jsonString] });

  inputData.addInput(jsonInput);

  return await quicktype({
    inputData,
    lang: targetLanguage,
    "rendererOptions": {
      "just-types": 'true',
    }
  });
}


/**
 * 生成TS代码，通过jsonSchema
 *
 * @param {string} targetLanguage
 * @param {string} typeName
 * @param {string} jsonSchema
 * @return {*}
 */
export const genTSByJsonSchema = async (jsonSchema: SchemaObjectTS, name = 'Root'): Promise<string> => {
  const { lines: ts } = await genCodeByJsonSchema(
    "ts",
    name,
    JSON.stringify(jsonSchema)
  );

  const removeLangIndent = (target: string, length = 1): string => {
    return target.replace(/:\s*/, `:${' '.repeat(length)}`)
  }

  // let rootStartIndex = 0;
  // let rootEndIndex = 0;

  // ts.some((item: string, index: number) => {
  //   if (item === 'export interface Root {') {
  //     rootStartIndex = index;
  //   }

  //   if (item === '}') {
  //     rootEndIndex = index;
  //     return true;
  //   }
  // });

  // ts.splice(rootStartIndex, rootEndIndex - 1, '', '')

  return ts.map((item: string) => removeLangIndent(item)).join("\n");
}
