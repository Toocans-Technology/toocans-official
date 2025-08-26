import BigNumber from 'bignumber.js'

/**
 * tokenPrecisionAutoVO 结构说明：
 *  ruleName: 规则名称 (仅标识, 当前逻辑未使用)
 *  roundMode 对齐移动端 RoundingMode 枚举，取值及语义：
 *    0 up        : 远离 0 舍入 (绝对值增大)          => BigNumber.ROUND_UP
 *    1 down      : 向 0 舍入 (截断)                 => BigNumber.ROUND_DOWN
 *    2 ceiling   : 向 +∞ 舍入 (正数进位, 负数截断)   => BigNumber.ROUND_CEIL
 *    3 floor     : 向 -∞ 舍入 (正数截断, 负数进位)   => BigNumber.ROUND_FLOOR
 *    4 halfUp    : 四舍五入, .5 远离 0              => BigNumber.ROUND_HALF_UP
 *    5 halfDown  : 五舍六入, .5 向 0                => BigNumber.ROUND_HALF_DOWN
 *  padWithZeros: 1=补 0 到指定位数; 0=不补 (会去掉末尾多余 0)
 *  displayPrecision: 目标展示小数位数
 */
export interface TokenPrecisionAutoVO {
  ruleName?: string | null
  roundMode?: number | null
  padWithZeros?: number | null
  displayPrecision?: number | null
}

const roundModeMap: Record<number, BigNumber.RoundingMode> = {
  0: BigNumber.ROUND_UP,
  1: BigNumber.ROUND_DOWN,
  2: BigNumber.ROUND_CEIL,
  3: BigNumber.ROUND_FLOOR,
  4: BigNumber.ROUND_HALF_UP,
  5: BigNumber.ROUND_HALF_DOWN,
}

/**
 * 根据 tokenPrecisionAutoVO 规则格式化数值
 * @param precisionVO 精度规则对象 (可空)
 * @param value 原始数值 (字符串/数字/BigNumber 支持)
 * @param fallbackDigits 当 precisionVO 不存在或 displayPrecision 无效时使用的默认位数 (默认 4)
 * @param useThousandSeparator 是否使用千位分隔符
 * @returns 处理后的字符串 (若 padWithZeros=0 则会去掉结尾多余 0)
 */
export function applyTokenPrecision(
  precisionVO: TokenPrecisionAutoVO | null | undefined,
  value: BigNumber.Value,
  options: {
    fallbackDigits?: number
    useThousandSeparator?: boolean
  } = {
    fallbackDigits: 4,
    useThousandSeparator: false,
  }
): string {
  if (value === null || value === undefined || value === '') value = 0

  const num = new BigNumber(value)
  if (!num.isFinite()) return '0'

  if (!precisionVO) {
    let result = num.toFixed(options.fallbackDigits ?? 4, BigNumber.ROUND_DOWN)
    if (result.includes('.')) {
      result = result.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '')
    }
    return options?.useThousandSeparator ? num.toFormat(options?.fallbackDigits ?? 4) : result
  }

  const digitsRaw = precisionVO.displayPrecision
  const digits =
    typeof digitsRaw === 'number' && digitsRaw >= 0 && digitsRaw <= 30 ? digitsRaw : (options.fallbackDigits ?? 4)

  const modeRaw = precisionVO.roundMode
  const roundingMode =
    modeRaw != null && Object.prototype.hasOwnProperty.call(roundModeMap, modeRaw)
      ? roundModeMap[modeRaw as keyof typeof roundModeMap]
      : BigNumber.ROUND_DOWN

  let result = num.toFixed(digits, roundingMode)

  if (precisionVO.padWithZeros !== 1) {
    if (result.indexOf('.') >= 0) {
      result = result.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '')
    }
  }

  return options.useThousandSeparator ? num.toFormat(digits) : result
}

export function formatByPrecision(
  value: BigNumber.Value,
  precisionVO?: TokenPrecisionAutoVO | null,
  fallbackDigits?: number
) {
  return applyTokenPrecision(precisionVO, value, { fallbackDigits })
}
