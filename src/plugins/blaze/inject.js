module.exports = (talkToExtension) => {
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
      var node = {
        name: view.name,
        data: view.data,
        children: []
      };
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
    name: 'body',
    children: []
  };
  lookForViews($('body'), data);
  console.error('data is', JSON.stringify(data));

  talkToExtension('blaze-tree', data);
};
