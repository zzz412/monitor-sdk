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
