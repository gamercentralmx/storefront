const formatString = (value: number, configuration: Intl.NumberFormatOptions) => new Intl.NumberFormat('en', configuration).format(value)

export class NumberUtils {
  static toMoney (value: number | string = 0, precision: number = 2) {
    try {
      let input = typeof value === 'number' ? value : Number(value)
      return formatString(input, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: precision,
        maximumFractionDigits: precision
      })
    } catch (error) {
      console.log('Formatter#toMoney error: ', error)
      return '$0.00'
    }
  }
}
