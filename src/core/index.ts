import { Options } from '../types/core'
import Tracker from './Tracker'
import { actionCatcher } from './actionTracker'
import { errorCatcher } from './errorTracker'
import {getCache} from "./cache";
import {lazyReport, report} from "./report";

//  初始化配置
 function init(options: Options) {
  // 需要的配置: appid系统ID userId用户ID deary合并延迟时间
  new Tracker(options)

  // ------UV统计------  页面初始化时就发送UV
  lazyReport('user', { message: '加载应用' })

  // ----- 防止卸载时还有剩余的埋点数据没发送 ----
  window.addEventListener('unload', () => {
    const data = getCache()
    if (data.length > 0) report(data)
  })
}

export { init, errorCatcher, actionCatcher }
