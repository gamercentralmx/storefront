export default class StringUtils {
  static truncate (str: string, length: number) {
    if (str.length < length) return str

    return `${str.substr(0, length - 3)}...`
  }
}
