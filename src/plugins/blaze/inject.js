import Highlighter from './highlighter';

var hl = new Highlighter(window, node => {
  console.error('@@ hl selected', node);
  //agent.selectFromDOMNode(node);
});
  
module.exports = {
  setup: (talkToExtension) => {
    var idCnt = 0;

    var generateId = function(){
      idCnt++;
      return 'node-' + idCnt;
    };

    var getViewFromEl = function(el) {
      var view = Blaze.getView(el);
      var events = [];
      var _events = (view && view.template && view.template.__eventMaps) || [];

      for(var i=0; i<_events.length; i++) {
        var props = Object.getOwnPropertyNames(_events[i]);
        if (props.length !== 0) {
          events.push(props[0]);
        }
      }

      return (view && {
        name: view.name,
        data: view.templateInstance && view.templateInstance().data,
        helpers: Object.getOwnPropertyNames(
          (view.template && view.template.__helpers) || {}
        ),
        events: events
      });
    };

    var lookForViews = function($el, parent){
      console.error('looing for views', $el);
      var view = getViewFromEl($el.get(0));

      if (view && view.name !== parent.name) {
        var _id = generateId();
        var node = {
          _id: _id,
          name: view.name,
          data: view.data,
          helpers: view.helpers,
          events: view.events,
          children: []
        };
        $el.attr('data-blaze-inspector-id', _id);
        $el.children().each(function(){
          lookForViews($(this), node);
        }); 
        parent.children.push(node);
      } else {
        $el.children().each(function(){
          lookForViews($(this), parent);
        });
      }
    };

    var data = {
      _id: generateId(),
      name: 'body',
      children: []
    };
    lookForViews($('body'), data);
    console.error('data is', JSON.stringify(data));

    talkToExtension('blaze-tree', data);
  },

  onMessage: (message) => {
    if(message.source !== 'blaze-inspector'){
      return;
    }
    
    switch(message.event){
      case 'shutdown':
        alert('shutting down');
        hl.remove();
        break;
      case 'start-inspecting':
        hl.startInspecting();
        break;
      case 'hide-highlight':
        hl.hideHighlight();
        break;
      case 'highlight':
        hl.highlight(
          $('[data-blaze-inspector-id=' + message.nodeId + ']').get(0), 'element'
        );
        break;
      default:
        return;
    }
  }
}
