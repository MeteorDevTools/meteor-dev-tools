import React, { PropTypes } from 'react';
import classNames from 'classnames';
import JSONTree from 'react-json-tree';
import _ from 'underscore';

export default React.createClass({
  propTypes : {
    blazeTreeData : PropTypes.object.isRequired,
  },
  render (){
    const getStyle = (type, expanded) => ({ marginTop: 4 });
    const getItemString = (type, data, itemType, itemString) => null;
    const renderLabel = (raw) => {
      console.error('rendering raw', raw);
      const m = (/^(--[0-9])*(.*)$/ig).exec(raw);
      if(m) {
        return m[2];
      } else {
        return <strong>{raw}</strong>;
      }
    };
    const renderValue = raw => <em>{raw}</em>;

    const transformTree = (tree) => {
      // - build a new label based on name move 
      // - kill name
      // - move children under the new name label
      // - kill children
        
      const name = `<${tree.name}${tree.data ? ' data={} ' : ''}>`;
      delete tree.name;
      delete tree.data;

      let currentNode = {};

      _.each(tree.children, (child, index) => {
        const r = transformTree(child);
        currentNode[`--${index}${r.name}`] = r.tree;
      });

      //tree[name] = currentNode;
      
      delete tree.children;

      return { name, tree: currentNode };
    };

    const newTreeData = transformTree(this.props.blazeTreeData);
    let tree = {};
    tree[newTreeData.name] = newTreeData.tree;

    return <JSONTree data={tree} expandAll={false} hideRoot={true}
      labelRenderer={renderLabel}
      valueRenderer={renderValue}
      getItemString={ getItemString } 
      getArrowStyle={getStyle} />;
  }
});
