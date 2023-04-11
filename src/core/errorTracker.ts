// ** 错误异常tracker
import { ErrorReport } from '../types/core'
import { ResourceElement } from '../types/dom'
import { lazyReport } from './report'

// 需要上报的数据结构
// { message: 信息, file: 文件地址, row: 行, col: 列, error: 错误信息, errorType: 错误类型 }
/**
 * 全局错误捕获【自动捕获并上报】
 */
export function errorTrackerReport() {
  // * 资源错误
  function resourceErrorTracker(e: ErrorEvent) {
    let target = e.target as ResourceElement
    const log = <ErrorReport>{
      message: `加载 ${target.tagName} 资源错误`,
      file: target.src || target.href,
      errorType: 'resourceError',
    }
    // console.log('资源错误上报数据', log)
    lazyReport('error', log)
  }

  // ----  js error --- 同步错误、资源错误
  window.addEventListener(
    'error',
    (e) => {
      // 判断是否为资源错误
      const target = e.target
      const isElementTarget =
        target instanceof HTMLScriptElement ||
        target instanceof HTMLLinkElement ||
        target instanceof HTMLImageElement
      if (isElementTarget) return resourceErrorTracker(e)

      const log = <ErrorReport>{
        errorType: 'jsError',
        message: e.message,
        file: e.filename,
        col: e.colno,
        row: e.lineno,
        error: e.error,
      }
      // console.log('JS错误上报数据', log)
      lazyReport('error', log)
    },
    true
  )

  // ---- Promise Error ---- 异步错误Promise
  window.addEventListener('unhandledrejection', (e) => {
    const log = <ErrorReport>{
      errorType: 'promiseError',
      error: e as unknown,
      message: e.reason,
    }
    // console.log('Promise错误上报数据', log)
    lazyReport('error', log)
  })
}

/**
 * 手动捕获错误
 */
export function errorCatcher(error: string, msg: string) {
  const log = <ErrorReport>{
    message: msg,
    error,
    errorType: 'catchError',
  }
  // console.log('手动捕获错误上报数据', log)
  lazyReport('error', log)
}
