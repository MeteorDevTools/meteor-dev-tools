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
import PropertiesView from './components/props'
import _ from 'underscore';
import Analytics from '../../common/analytics';

class App extends Component {
  componentDidMount() {
    const dispatch = this.props.dispatch;
    if(chrome && chrome.devtools) {
      Bridge.setup((error, message) => {
        if(message && message.eventType === 'blaze-tree') {
          dispatch(setBlazeTreeData(JSON.parse(message.data)));
        }
      }, () => {
        dispatch(setBlazeTreeData(null));
      });
    } else {
      var fakeBlazeTree = require('./fake');
      console.error('fake data is', fakeBlazeTree);
      dispatch(setBlazeTreeData(fakeBlazeTree));
    }

    Analytics.trackPageView('blaze inspector');
  }

  componentWillUnmount() {
    Bridge.sendMessageToThePage({
      source: 'blaze-inspector',
      event: 'shutdown'
    });
  }

  render() {
    const { dispatch, filters, traces, stats } = this.props
    const changeNodeSelection = (nodeId) => {
      dispatch(changeBlazeNodeSelection(nodeId));
    }
    const rootNode = this.props.getRootNode();

    return (
      <div className="blaze-inspector">
        <section>
          <div style={{borderBottom:'solid 1px #ccc', marginBottom: '11px'}}>👷 Yo! This stuff here is pretty experimental. Let us know what you think and if it works ->
          &nbsp;<a href="https://twitter.com/bakeryhq" target="_blank">Talk to us</a></div>
          { rootNode ? 
            <BlazeTreeView rootNode={rootNode}
            getChildNodes={this.props.getChildNodes}
            changeBlazeNodeSelection={changeNodeSelection}
            onToggleCollapse={(nodeId) => dispatch(toggleNodeCollapse(nodeId))} 
            onHover={(nodeId, isHovered) => dispatch(changeNodeHover(nodeId, isHovered)) }/>
            : <div>Looking for signs of Blaze...</div> 
          }
        </section>
        <aside>
          <PropertiesView properties={this.props.getSelectedNodeProps()}/>
        </aside>
      </div>
    )
  }
}

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
    },
    getSelectedNodeProps : () => {
      let selectedNode = null;
      state.blazeTree.forEach((value, key) => {
        if (value.get('isSelected')) {
          selectedNode = value;
        }
      });
      return selectedNode && {
        data: selectedNode.get('data'),
        events: selectedNode.get('events'),
        helpers: selectedNode.get('helpers')
      };
    }
  };
})(App)