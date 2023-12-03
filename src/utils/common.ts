export function format(str: string, params: any) {
  for (const key in params) {
    str = str.replace(new RegExp('\\{' + key + '\\}', 'g'), params[key]);
  }

  return str;
}
