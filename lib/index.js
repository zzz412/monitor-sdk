(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.monitorSdk = {}));
})(this, (function (exports) { 'use strict';

  // * 版本枚举
  var TrackerConfig;
  (function (TrackerConfig) {
      TrackerConfig["version"] = "1.0.0";
  })(TrackerConfig || (TrackerConfig = {}));

  /**
   * 获取元素的dom路径
   * @param {*} element
   * @returns
   */
  function getPathTo(element) {
      if (element.id !== '')
          return '//*[@id="' + element.id + '"]';
      if (element === document.body)
          return element.tagName;
      let ix = 0;
      let siblings = element.parentElement.children;
      for (let i = 0; i < siblings.length; i++) {
          let sibling = siblings[i];
          if (sibling === element)
              return (getPathTo(element.parentElement) + '/' + element.tagName + '[' + (ix + 1) + ']');
          if ((sibling === null || sibling === void 0 ? void 0 : sibling.nodeType) === 1 && sibling.tagName === element.tagName)
              ix++;
      }
  }
  //*[@id="root"]/DIV[1]/DIV[2]/BUTTON[1]

  // 合并上报 cache法
  const cache = [];
  function getCache() {
      return cache;
  }
  function addCache(data) {
      cache.push(data);
  }
  function clearCache() {
      cache.length = 0;
  }

  /**
   * 合并上报【懒加载上报请求-处理多个上报并合并】
   * @param {string} type
   * @param {object} params
   */
  let timer;
  function lazyReport(type, params) {
      const appId = window['_monitor_app_id_'];
      const userId = window['_monitor_user_id_'];
      const delay = window['_monitor_delay_'];
      const logParams = {
          appId,
          userId,
          type,
          data: params,
          currentTime: new Date().getTime(),
          currentPage: window.location.href,
          ua: navigator.userAgent, // ua信息
      };
      const logParamsString = JSON.stringify(logParams);
      // -- 添加到缓存组中
      addCache(logParamsString);
      const data = getCache();
      if (delay === 0) {
          // 不做延迟上报【不合并】
          report(data);
      }
      if (data.length > 10) {
          // 超过10个就不合并了
          report(data);
          clearTimeout(timer);
          return;
      }
      clearTimeout(timer);
      // 延迟上报
      timer = setTimeout(() => {
          report(data);
      }, delay);
  }
  /**
   * 上报API
   */
  function report(data) {
      const url = window._monitor_request_url;
      // 上报方式:  1. ajax请求【跨域、增加请求量】  2. navigator请求【即使页面关闭了也会发送】 3. img【不会跨域、请求量少】
      // ---- navigator ---
      if (navigator.sendBeacon) {
          // 支持navigator的浏览器 【只能发送字符串格式】
          navigator.sendBeacon(url, JSON.stringify(data));
      }
      else {
          // 不支持navigator的浏览器
          const oImage = new Image();
          oImage.src = `${url}?logs=${data}`;
      }
      clearCache();
  }

  // ** DOM埋点tracker
  /**
   * 自动上报【无痕埋点】
   */
  function autoTrackerReport() {
      // 自动上报【只埋点用户点击行为】
      document.body.addEventListener('click', function (e) {
          const clickDOM = e.target;
          // 获取标签上的data-target属性的值
          let target = clickDOM.getAttribute('data-target');
          // 获取标签上data-no属性的值
          let no = clickDOM.getAttribute('data-no');
          // 避免重复上报
          if (no !== null)
              return;
          if (target) {
              // 取出target的值作为上报内容
              const log = { actionType: 'click', data: target };
              // console.log('自动埋点上报内容(data值)---', log)
              lazyReport('action', log);
          }
          else {
              // 使用通用值作为上报内容
              const path = getPathTo(clickDOM);
              const log = { actionType: 'click', data: path };
              // console.log('自动埋点上报内容(默认值)---', log)
              lazyReport('action', log);
          }
      }, false);
  }
  /**
   * 手动上报【手动埋点】
   */
  function actionCatcher(actionType, data) {
      const log = {
          actionType,
          data,
      };
      // console.log('手动埋点上报---', log)
      lazyReport('action', log);
  }

  // 需要上报的数据结构
  // { message: 信息, file: 文件地址, row: 行, col: 列, error: 错误信息, errorType: 错误类型 }
  /**
   * 全局错误捕获【自动捕获并上报】
   */
  function errorTrackerReport() {
      // * 资源错误
      function resourceErrorTracker(e) {
          let target = e.target;
          const log = {
              message: `加载 ${target.tagName} 资源错误`,
              file: target.src || target.href,
              errorType: 'resourceError',
          };
          // console.log('资源错误上报数据', log)
          lazyReport('error', log);
      }
      // ----  js error --- 同步错误、资源错误
      window.addEventListener('error', (e) => {
          // 判断是否为资源错误
          const target = e.target;
          const isElementTarget = target instanceof HTMLScriptElement ||
              target instanceof HTMLLinkElement ||
              target instanceof HTMLImageElement;
          if (isElementTarget)
              return resourceErrorTracker(e);
          const log = {
              errorType: 'jsError',
              message: e.message,
              file: e.filename,
              col: e.colno,
              row: e.lineno,
              error: e.error,
          };
          // console.log('JS错误上报数据', log)
          lazyReport('error', log);
      }, true);
      // ---- Promise Error ---- 异步错误Promise
      window.addEventListener('unhandledrejection', (e) => {
          const log = {
              errorType: 'promiseError',
              error: e,
              message: e.reason,
          };
          // console.log('Promise错误上报数据', log)
          lazyReport('error', log);
      });
  }
  /**
   * 手动捕获错误
   */
  function errorCatcher(error, msg) {
      const log = {
          message: msg,
          error,
          errorType: 'catchError',
      };
      // console.log('手动捕获错误上报数据', log)
      lazyReport('error', log);
  }

  class Tracker {
      constructor(options) {
          this.data = Object.assign(this.defaultOptions(), options);
          this.installInnerTrack();
      }
      // * 默认配置
      defaultOptions() {
          this.version = TrackerConfig.version;
          return {
              delay: 0,
              skdVersion: this.version,
              historyTracker: false,
              hashTracker: false,
              domTracker: false,
              jsError: false,
          };
      }
      // * 加载配置
      installInnerTrack() {
          const { requestUrl, userId, appId, delay } = this.data;
          // -----系统ID-----
          if (appId) {
              window['_monitor_app_id_'] = appId;
          }
          // --- userId --
          if (userId) {
              window['_monitor_user_id_'] = userId;
          }
          // --- 合并上报的间隔 --
          if (delay) {
              window['_monitor_delay_'] = delay;
          }
          // -----服务端地址------
          if (requestUrl) {
              window['_monitor_request_url'] = requestUrl;
          }
          // 1. 开启history模式
          // 2. 开启hash模式
          // 3. 开启无痕埋点
          if (this.data.domTracker) {
              autoTrackerReport();
          }
          // 4. 开启错误监控
          if (this.data.jsError) {
              errorTrackerReport();
          }
      }
  }

  //  初始化配置
  function init(options) {
      // 需要的配置: appid系统ID userId用户ID deary合并延迟时间
      new Tracker(options);
  }

  exports.actionCatcher = actionCatcher;
  exports.errorCatcher = errorCatcher;
  exports.init = init;

}));
