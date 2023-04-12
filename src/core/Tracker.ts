import { DefaultOptions, Options, TrackerConfig } from '../types/core'
import { autoTrackerReport } from './actionTracker'
import { errorTrackerReport } from './errorTracker'
import {hashPageTrackerReport, historyPageTrackerReport} from "./pageTracker";

export default class Tracker {
  public data: Options
  private version: string | undefined

  public constructor(options: Options) {
    this.data = Object.assign(this.defaultOptions(), options)
    this.installInnerTrack()
  }

  // * 默认配置
  private defaultOptions(): DefaultOptions {
    this.version = TrackerConfig.version
    return <DefaultOptions>{
      delay: 0,
      skdVersion: this.version,
      historyTracker: false,
      hashTracker: false,
      domTracker: false,
      jsError: false,
    }
  }

  // * 加载配置
  private installInnerTrack() {
    const { requestUrl, userId, appId, delay } = this.data
    // -----系统ID-----
    if (appId) {
      window['_monitor_app_id_'] = appId
    }
    // --- userId --
    if (userId) {
      window['_monitor_user_id_'] = userId
    }
    // --- 合并上报的间隔 --
    if (delay) {
      window['_monitor_delay_'] = delay
    }
    // -----服务端地址------
    if (requestUrl) {
      window['_monitor_request_url'] = requestUrl
    }
    // 1. 开启history模式
    if (this.data.hashTracker) {
      hashPageTrackerReport()
    }
    // 2. 开启hash模式
    if (this.data.historyTracker) {
      historyPageTrackerReport()
    }
    // 3. 开启无痕埋点
    if (this.data.domTracker) {
      autoTrackerReport()
    }
    // 4. 开启错误监控
    if (this.data.jsError) {
      errorTrackerReport()
    }
  }
}
