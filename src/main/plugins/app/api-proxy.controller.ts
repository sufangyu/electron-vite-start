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
        // TODO: 正式版本直接 callback({})
        const proxyConfig = globalData.requestProxyList.find((config: RequestProxyItem) =>
          details.url.startsWith(config.originalUrl)
        );
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
      { urls: ['https://*/*'] },
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
