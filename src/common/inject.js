import DDPInject from '../plugins/ddp/inject';

(() => {
  const talkToExtension = (eventType, data, plugin) => {
    window.postMessage({
      eventType : eventType, 
      data: data,
      source: 'ddp-monitor-extension'
    }, '*'); 
  };

  const readyStateCheckInterval = setInterval(function() {
    const isMeteorDefined = typeof Meteor !== 'undefined';
    if (document.readyState === 'complete' || isMeteorDefined) {
      clearInterval(readyStateCheckInterval);
      if(isMeteorDefined){
        const plugins = [DDPInject];
        for(var i=0; i<plugins.length; i++){
          plugins[i].call(this, talkToExtension);
        }
      }
    } 
  }, 10);
})();