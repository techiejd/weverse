export const prettifyJSON = (json: Record<string, any>) => JSON.stringify(
  json, null, 2).replace('{', '').replace('}', '');
