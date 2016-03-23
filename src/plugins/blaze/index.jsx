import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import Bridge from '../../common/bridge'
import {
  setBlazeTreeData, 
  toggleNodeCollapse,
  changeBlazeNodeSelection,
  changeNodeHover
} from './actions'
import BlazeTreeView from './components/tree'
import _ from 'underscore';

class App extends Component {
  componentDidMount() {
    const dispatch = this.props.dispatch;
    if(chrome && chrome.devtools) {
      Bridge.setup((error, message) => {
        if(message && message.eventType === 'blaze-tree') {
          dispatch(setBlazeTreeData(message.data));
        }
      }, () => {
        dispatch(setBlazeTreeData(null));
      });
    } else {
      var fakeBlazeTree = require('./fake');
      console.error('fake data is', fakeBlazeTree);
      dispatch(setBlazeTreeData(fakeBlazeTree));
    }
  }

  render() {
    const { dispatch, filters, traces, stats } = this.props
    const changeNodeSelection = (nodeId) => {
      dispatch(changeBlazeNodeSelection(nodeId));
    }

    return (
      <div className="blaze-inspector">
        <BlazeTreeView rootNode={this.props.getRootNode()}
          getChildNodes={this.props.getChildNodes}
          changeBlazeNodeSelection={changeNodeSelection}
          onToggleCollapse={(nodeId) => dispatch(toggleNodeCollapse(nodeId))} 
          onHover={(nodeId, isHovered) => dispatch(changeNodeHover(nodeId, isHovered)) }/>
      </div>
    )
  }
}

// App.propTypes = {
//   traces : PropTypes.array.isRequired
// }

export default connect((state) => {
  return {
    blazeTree: state.blazeTree,
    getRootNode : () => {
      // console.error('getting root node', state.blazeTree);
      let rootNodeId = null;
      state.blazeTree.forEach((value, key) => {
        if (!value.get('parentId')) {
          rootNodeId = key;
        }
      });
      return rootNodeId && state.blazeTree.get(rootNodeId);
    },
    getChildNodes : (nodeId) => {
      let children = [];
      const theNode = state.blazeTree.get(nodeId);
      theNode.get('children').forEach((childId) => {
        children.push(state.blazeTree.get(childId));
      });
      return children;
    }
  };
})(App)