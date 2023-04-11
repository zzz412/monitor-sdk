/**
 * 配置类型
 * @appId 系统ID
 * @userId 用户ID
 * @delay 合并间隔时长
 * @requestUrl 接口地址
 * @historyTracker history上报
 * @hashTracker hash上报
 * @domTracker 携带Tracker-key 点击事件上报
 * @historyTracker sdkVersion sdk版本
 * @jsError js 和 promise 报错异常上报
 * @sdkVersion SDK版本
 * @historyTracker extra 透传字段
 */
export interface DefaultOptions {
  appId: string
  userId: string
  requestUrl: string | undefined
  delay: number
  historyTracker: boolean
  hashTracker: boolean
  domTracker: boolean
  jsError: boolean
  skdVersion: string | number
  extra: Record<string, any> | undefined
}

export interface Options extends Partial<DefaultOptions> {
  appId: string
  userId: string
  requestUrl: string
}

// * 版本枚举
export enum TrackerConfig {
  version = '1.0.0',
}

// * 错误上报数据格式
export interface DefaultErrorReport {
  message: string
  file: string
  row: string | number
  col: string | number
  error: string
  errorType: string
}

export interface ErrorReport extends Partial<DefaultErrorReport> {
  errorType: string
  message: string
  fill: string
}

// * report上报数据格式
export type RqType = 'error' | 'action' | 'visit' | 'user'

export interface ReportType {
  appId: string // 项目AppID
  userId: string // 用户uuID
  type: RqType // 上报类型
  data: object, // 上报数据
  currentTime: number // 时间戳
  currentPage: string // 当前页面
  ua: string // ua信息
}
