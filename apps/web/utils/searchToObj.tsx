export function searchToObj(search: string): Record<string, string> {
  const params = new URLSearchParams(search)
  const obj: Record<string, string> = {}
  params.forEach((value, key) => {
    obj[key] = value
  })
  return obj
}
