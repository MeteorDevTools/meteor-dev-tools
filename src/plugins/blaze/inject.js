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
      return (view && {
        name: view.name,
        data: view.templateInstance && view.templateInstance().data
      });
    };

    var lookForViews = function($el, parent){
      var view = getViewFromEl($el.get(0));

      if (view && view.name !== parent.name) {
        var _id = generateId();
        var node = {
          _id: _id,
          name: view.name,
          data: view.data,
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
