/** Removes React hooks from function names.

  @param {(string|Function)} value - The name of the function or the function itself.

  @example
  // returns 'XmbProvider.moveLeft'
  getFunctionName('XmbProvider.useCallback[moveLeft]')
*/
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const getFunctionName = (value: string | Function) => {
  let name;
  if (typeof value === 'string') {
    name = value;
  }
  else {
    name = value.toString();
  }
  const pattern = /use[\w]+\[(.+?)\]/gi;
  const updated = name.replace(pattern, '$1');
  return updated;
};
