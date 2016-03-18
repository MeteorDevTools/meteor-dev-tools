import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import Bridge from '../../common/bridge'
import { setBlazeTreeData } from './actions'
import BlazeTreeView from './components/tree'

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
      dispatch(setBlazeTreeData(fakeBlazeTree));
    }
  }

  render() {
    const { dispatch, filters, traces, stats } = this.props
    return (
      <div className="blaze-inspector">
        <BlazeTreeView blazeTreeData={this.props.blazeTree} />
      </div>
    )
  }
}

// App.propTypes = {
//   traces : PropTypes.array.isRequired
// }

export default connect((state) => {
  return {
    blazeTree: state.blazeTree
  };
})(App)