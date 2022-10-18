export const getBody = (params: Record<string, any>) : string => {
  // First line of message is the actual command
  return params['Admin']['message'].split('\n').slice(1).join('\n');
};
export const getCommand = (params: Record<string, any>) : string => {
  // First line of message is the actual command
  return params['Admin']['message'].split('\n')[0];
};
