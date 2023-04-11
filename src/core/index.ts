import { Options } from '../types/core'
import Tracker from './Tracker'
import { actionCatcher } from './actionTracker'
import { errorCatcher } from './errorTracker'

//  初始化配置
function init(options: Options) {
  // 需要的配置: appid系统ID userId用户ID deary合并延迟时间
  new Tracker(options)
}

export { init, errorCatcher, actionCatcher }
