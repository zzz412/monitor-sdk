// ** DOM埋点tracker

import { getPathTo } from '../utils/utils'
import { lazyReport } from './report'

/**
 * 自动上报【无痕埋点】
 */
export function autoTrackerReport() {
  // 自动上报【只埋点用户点击行为】
  document.body.addEventListener(
    'click',
    function (e) {
      const clickDOM = e.target as HTMLElement

      // 获取标签上的data-target属性的值
      let target = clickDOM.getAttribute('data-target')

      // 获取标签上data-no属性的值
      let no = clickDOM.getAttribute('data-no')

      // 避免重复上报
      if (no !== null) return

      if (target) {
        // 取出target的值作为上报内容
        const log = { actionType: 'click', data: target }
        // console.log('自动埋点上报内容(data值)---', log)
        lazyReport('action', log)
      } else {
        // 使用通用值作为上报内容
        const path = getPathTo(clickDOM)
        const log = { actionType: 'click', data: path }
        // console.log('自动埋点上报内容(默认值)---', log)
        lazyReport('action', log)
      }
    },
    false
  )
}

/**
 * 手动上报【手动埋点】
 */
export function actionCatcher(actionType: string, data: unknown) {
  const log = {
    actionType,
    data,
  }
  // console.log('手动埋点上报---', log)
  lazyReport('action', log)
}
