import { session } from 'electron';
import { RequestProxyItem } from '@share/modules';
import { globalData } from '@main/global';

class ApiProxyController {
  proxy() {
    const currentSession = session.defaultSession;
    // 请求拦截
    currentSession.webRequest.onBeforeRequest(
      { urls: ['http://*/*', 'https://*/*'] },
      (details, callback) => {
        const proxyConfig =
          globalData.isDev || globalData.isDebug
            ? globalData.requestProxyList.find((config: RequestProxyItem) =>
                details.url.startsWith(config.originalUrl)
              )
            : undefined;
        if (proxyConfig) {
          const { originalUrl, redirectUrl } = proxyConfig;
          const newRedirectURL = details.url.replace(originalUrl, redirectUrl);
          callback({ redirectURL: newRedirectURL });
        } else {
          callback({});
        }
      }
    );

    //
    currentSession.webRequest.onBeforeSendHeaders(
      { urls: ['http://*/*', 'https://*/*'] },
      (details, callback) => {
        // 直接删掉这个请求头，也可以修改成其他内容
        if (details.resourceType == 'image' && details.method == 'GET') {
          delete details.requestHeaders['Referer'];
        }

        const data = { requestHeaders: details.requestHeaders };
        callback(data);
      }
    );
  }
}

export default new ApiProxyController();
