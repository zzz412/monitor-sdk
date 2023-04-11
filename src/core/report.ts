import { ReportType, RqType } from '../types/core'
import { addCache, clearCache, getCache } from './cache'
/**
 * 合并上报【懒加载上报请求-处理多个上报并合并】
 * @param {string} type
 * @param {object} params
 */
let timer: number

export function lazyReport(type: RqType, params: object) {
  const appId = window['_monitor_app_id_']
  const userId = window['_monitor_user_id_']
  const delay = window['_monitor_delay_']
  const logParams: ReportType = {
    appId,
    userId,
    type,
    data: params, // 上报的数据
    currentTime: new Date().getTime(), // 时间戳
    currentPage: window.location.href, // 当前页面
    ua: navigator.userAgent, // ua信息
  }
  const logParamsString = JSON.stringify(logParams)
  // -- 添加到缓存组中
  addCache(logParamsString)
  const data = getCache()
  if (delay === 0) {
    // 不做延迟上报【不合并】
    report(data)
  }

  if (data.length > 10) {
    // 超过10个就不合并了
    report(data)
    clearTimeout(timer)
    return
  }

  clearTimeout(timer)
  // 延迟上报
  timer = setTimeout(() => {
    report(data)
  }, delay)
}

/**
 * 上报API
 */
export function report(data: string[]) {
  const url = window._monitor_request_url
  // 上报方式:  1. ajax请求【跨域、增加请求量】  2. navigator请求【即使页面关闭了也会发送】 3. img【不会跨域、请求量少】
  // ---- navigator ---
  if (navigator.sendBeacon) {
    // 支持navigator的浏览器 【只能发送字符串格式】
    navigator.sendBeacon(url, JSON.stringify(data))
  } else {
    // 不支持navigator的浏览器
    const oImage = new Image()
    oImage.src = `${url}?logs=${data}`
  }
  clearCache()
}
