export default {
  openResource(url, lineNumber, callback){
    if(chrome && chrome.devtools){
      chrome.devtools.panels.openResource(url, lineNumber, callback);
    }
  },

  setup(callback, onReload){
    if(chrome && chrome.devtools){
      let chromeSetup = function(){
        // Create a connection to the background page
        const backgroundPageConnection = chrome.runtime.connect({
          name: 'panel'
        });

        backgroundPageConnection.postMessage({
          name: 'init',
          tabId: chrome.devtools.inspectedWindow.tabId
        });

        backgroundPageConnection.onMessage.addListener(function(msg) {
          callback && callback.call(this, null, msg);
        });
      };

      let injectScript = (scriptUrl) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', chrome.extension.getURL(scriptUrl), false);
        xhr.send();
        chrome.devtools.inspectedWindow.eval(xhr.responseText);
      };

      let pageSetup = () => injectScript('/build/inject.js');
    
      chromeSetup.call(this);
      pageSetup.call(this);

      chrome.devtools.network.onNavigated.addListener(function(){
        pageSetup.call(this);
        onReload && onReload.call(this);
      });
    }
  }
};