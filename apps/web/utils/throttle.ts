// 通用节流函数 throttle
function throttle<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let lastTime = 0
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastTime >= wait) {
      lastTime = now
      func.apply(this, args)
    } else if (!timer) {
      timer = setTimeout(
        () => {
          lastTime = Date.now()
          timer = null
          func.apply(this, args)
        },
        wait - (now - lastTime)
      )
    }
  }
}

export default throttle
