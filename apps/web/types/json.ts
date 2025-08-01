type JSONPrimitive = string | number | boolean | null

type JSONObject = { [key: string]: JSONValue }

type JSONArray = JSONValue[]

export type JSONValue = JSONPrimitive | JSONObject | JSONArray

/*
  Json 和 JsonWithUndefined 两个 type 的区别在于:
  Json 才是真正符合 JSON 格式标准的 type,
  而 JsonWithUndefined 的物件可以接受 undefined 值 (JSON 标准中是没有 undefined 值的)
  JsonWithUndefined 可以方便处理带有 undefined 值的物件
*/
type JsonMapWithUndefined = { [key: string]: JsonWithUndefined | undefined }
type JsonArrayWithUndefined = JsonWithUndefined[]

export type JsonWithUndefined = JSONPrimitive | JsonMapWithUndefined | JsonArrayWithUndefined
