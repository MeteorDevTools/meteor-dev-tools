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
        // if(message && message.eventType === 'ddp-trace'){
        //   let data = message.data;
        //   let isValid = data && data.messageJSON && 
        //     typeof data.isOutbound !== 'undefined';
          
        //   if(!isValid){
        //     return;
        //   }

        //   let d = JSON.parse(data.messageJSON);  
        //   d = _.isArray(d) ? d : [d];

        //   _.each(d, function(m){
        //     m = _.isString(m) ? JSON.parse(m) : m;

        //     dispatch(addTrace({
        //       message: m,
        //       isOutbound: data.isOutbound,
        //       stackTrace: data.stackTrace
        //     }));
        //   });
        // }
      }, () => {
        // dispatch(clearLogs()) 
      });
    } else {
      var fakeBlazeTree = require('./fake');
      console.error('data is', fakeBlazeTree);
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