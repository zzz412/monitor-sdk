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
interface DefaultOptions {
    appId: string;
    userId: string;
    requestUrl: string | undefined;
    delay: number;
    historyTracker: boolean;
    hashTracker: boolean;
    domTracker: boolean;
    jsError: boolean;
    skdVersion: string | number;
    extra: Record<string, any> | undefined;
}
interface Options extends Partial<DefaultOptions> {
    appId: string;
    userId: string;
    requestUrl: string;
}

/**
 * 手动上报【手动埋点】
 */
declare function actionCatcher(actionType: string, data: unknown): void;

/**
 * 手动捕获错误
 */
declare function errorCatcher(error: string, msg: string): void;

declare function init(options: Options): void;

export { actionCatcher, errorCatcher, init };
