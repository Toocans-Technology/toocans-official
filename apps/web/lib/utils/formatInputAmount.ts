export const formatInputAmount = (value: string, precision = 18) => {
  const precisionReg = new RegExp(`^\\d+(?:\\.\\d{0,${precision}})?`)

  const v = value
    .replace(/-/g, '')
    .replace(/[^\d.]/g, '')
    .replace(/^\./g, '')
    .replace(/\.{2,}/g, '.')
    .replace('.', '$#$')
    .replace(/\./g, '')
    .replace('$#$', '.')
    .replace(/^0+(\d)/, '$1')
    .replace(/^\./, '0.')
    .match(precisionReg)

  return v ? v[0] : ''
}
