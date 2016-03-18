module.exports = (talkToExtension) => {
  
  // look for top level views
  // https://github.com/alexcurtis/react-treebeard
  
  var getViewFromEl = function(el) {
    // var grabKeysThatAreNotFunctions = function(obj) {
    //   var result = {};
    //   var keys = (obj && Object.getOwnPropertyNames(obj)) || [];
    //   for(var i=0; i<keys.length; i++){
    //     if(typeof obj[keys[i]] !== 'function'){
    //       result[keys[i]] = grabKeysThatAreNotFunctions(obj[keys[i]]);
    //     }
    //   }
    //   return result;
    // };

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
};
