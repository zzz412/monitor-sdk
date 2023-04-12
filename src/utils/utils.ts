/**
 * 获取元素的dom路径
 * @param {*} element
 * @returns
 */
export function getPathTo(element: HTMLElement): string | undefined {
  if (element.id !== '') return '//*[@id="' + element.id + '"]'
  if (element === document.body) return element.tagName
  let ix = 0
  let siblings = element.parentElement!.children
  for (let i = 0; i < siblings.length; i++) {
    let sibling = siblings[i]
    if (sibling === element)
      return (
        getPathTo(element.parentElement as HTMLElement) + '/' + element.tagName + '[' + (ix + 1) + ']'
      )
    if (sibling?.nodeType === 1 && sibling.tagName === element.tagName) ix++
  }
}

//*[@id="root"]/DIV[1]/DIV[2]/BUTTON[1]

/**
 * 重写pushState方法和replaceState方法
 */
export  function createHistoryEvent<T extends keyof History>(type: T) {
  const origin = window.history[type]
  return function (this: any) {
    const res = origin.apply(this, arguments)
    const e = new Event(type)
    window.dispatchEvent(e)
    return res
  }
}

/**
 * 连续绑定事件
 */
export function captureEvents(eventList: string[], handler: () => void) {
  eventList.forEach(event => {
    window.addEventListener(event, () => {
      handler && handler()
    })
  })
}