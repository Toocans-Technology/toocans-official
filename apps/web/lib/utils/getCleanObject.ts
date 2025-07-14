// 清除对象中的 undefined 和 ''
// 用于请求参数
export function getCleanObject(obj: Record<string, string>) {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== '') {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, string>
  )
}
