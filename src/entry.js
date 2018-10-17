const ServiceWorker = require(
    'file-loader?name=sw.[hash:hex:3].[ext]!./serviceworker.js');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(ServiceWorker).
      then(() => navigator.serviceWorker.ready).
      then(reg => reg.active.postMessage({type: 'ping'})).
      catch(console.error).
      then(() =>
          import('./index'),
      ).
      catch((error) => {
        console.warn('↓ While loading script, expecting [Module], received [Error]');
        console.error(error);
        alert('脚本下载失败了T^T 刷新试试？')
      }).
      then(() => {
        navigator.serviceWorker.addEventListener('message', event => {
          if(event.data.updated !== undefined) {
            window.postMessage({type: 'notice', source:'Service Worker', content: event.data.updated ? '在后台准备好了页面的更新喵~' : '页面下载完成，没有新任务~'}, '*');
          } else if(event.data.error !== undefined){
            window.postMessage({type: 'notice', source:'Service Worker', content: '网络连接失败，错误：' + event.data.error, error: true}, '*');
          }
        });
        document.querySelector('#loading').remove();
        navigator.serviceWorker.controller.postMessage({type: 'ready'});
      });
} else {
  import('./index');
}
