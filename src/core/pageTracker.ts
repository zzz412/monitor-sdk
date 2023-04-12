// ** 页面tracker

import {captureEvents, createHistoryEvent} from "../utils/utils";
import {lazyReport} from "./report";

/**
 * history路由监听 【路由原pushState replaceState 部分浏览器监听不到】
 */
export function historyPageTrackerReport() {
    // 1. 替换pushState replaceState
    window.history.pushState = createHistoryEvent('pushState')
    window.history.replaceState = createHistoryEvent('replaceState')

    // 2. 监听事件 页面跳转、页面替换、页面前进后退、页面加载、页面卸载
    const eventList = ['pushState', 'replaceState', 'popstate', 'load', 'unload']

    pageTrackerReport(eventList)
}

/**
 * hash路由监听
 */
export function hashPageTrackerReport() {
    // 【vue、react的routerHash模式还是触发pushState】
    window.history.pushState = createHistoryEvent('pushState')

    // 1. 监听事件 pushState、hash变化、页面加载、页面卸载、前进后退
    const eventList = ['pushState', 'hashchange', 'load', 'popstate', 'unload' ]
    pageTrackerReport(eventList)
}

function pageTrackerReport(eventList: string[]) {
    // 记录初始记录
    let beforePage = '' // 上一个页面
    let beforeTime = Date.now() // 进入页面时间

    // 计算页面停留时间
    function getStayTime() {
        const currentTime = Date.now()
        const stayTime = currentTime - beforeTime
        beforeTime = currentTime
        return stayTime
    }

    function listener() {
        const stayTime = getStayTime() // 停留时间
        const currentPage = window.location.href // 当前页面路径
        lazyReport('visit', {page: beforePage, stayTime})
        beforePage = currentPage
    }

    captureEvents(eventList, listener)
}



