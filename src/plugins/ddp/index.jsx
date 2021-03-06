import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import TraceList from './components/trace-list'
import ClearLogsButton from './components/clear-logs-button'
import Filter from './components/filter' 
import TraceFilter from './lib/trace-filter'
import TraceProcessor from './lib/trace-processor'
import Warnings from './lib/warnings'
import {computeStats} from './lib/stats'
import Stats from './components/stats'
import Bridge from '../../common/bridge'
import { addTrace, clearLogs } from './actions/traces'
import { toggleFilter } from './actions/filters'
import _ from 'underscore';
import DDPMessageGenerator from './lib/ddp-generator';

let autoscrollToTheBottom = true;
const _getScrollableSectionEl  = () => {
  return document.querySelector('.ddp-monitor > section');
};

class App extends Component {
  componentDidMount() {
    const dispatch = this.props.dispatch;
    
    if(chrome && chrome.devtools) {
      Bridge.setup((error, message) => {
        if(message && message.eventType === 'ddp-trace'){
          let data = message.data;
          let isValid = data && data.messageJSON && 
            typeof data.isOutbound !== 'undefined';
          
          if(!isValid){
            return;
          }

          let d = JSON.parse(data.messageJSON);  
          d = _.isArray(d) ? d : [d];

          _.each(d, function(m){
            m = _.isString(m) ? JSON.parse(m) : m;

            dispatch(addTrace({
              message: m,
              isOutbound: data.isOutbound,
              stackTrace: data.stackTrace
            }));
          });
        }
      }, () => dispatch(clearLogs()));
    } else {
      // inside standalone web app
      setInterval(function(){
        dispatch(addTrace({
          message: DDPMessageGenerator.generate(),
          isOutbound: true
        }));
      },1000);
    }
  }

  onScroll () {
    const section = _getScrollableSectionEl();    
    autoscrollToTheBottom = (section.scrollTop + section.clientHeight) === section.scrollHeight;
  }

  componentDidUpdate () {
    if (autoscrollToTheBottom) {
      const section = _getScrollableSectionEl();
      section.scrollTop = section.scrollHeight - section.clientHeight;
    }
  }

  render() {
    const { dispatch, filters, traces, stats } = this.props
    return (
      <div className="ddp-monitor">
        <header>
          <ClearLogsButton onClearClick={ () => dispatch(clearLogs())} />
          <Filter enabled={ filters.Subscriptions.enabled } name='Subscriptions' onToggle={ (filter) => dispatch(toggleFilter(filter)) } />
          <Filter enabled={ filters.Collections.enabled } name='Collections' onToggle={ (filter) => dispatch(toggleFilter(filter)) } />
          <Filter enabled={ filters.Methods.enabled } name='Methods' onToggle={ (filter) => dispatch(toggleFilter(filter)) } />
          <Filter enabled={ filters.Connect.enabled } name='Connect' onToggle={ (filter) => dispatch(toggleFilter(filter)) } />
          <Filter enabled={ filters.PingPong.enabled } name='PingPong' onToggle={ (filter) => dispatch(toggleFilter(filter)) } />
          <a href="https://github.com/thebakeryio/meteor-ddp-monitor" target="_blank">
            <i className="fa fa-bug"></i> Bugs, Features, PRs
          </a>          
        </header>
        <section onScroll={this.onScroll}>
          <TraceList traces={traces} />
        </section>
        <footer>
          <Stats stats={stats} />
        </footer>
      </div>
    )
  }
}

App.propTypes = {
  traces : PropTypes.array.isRequired
}

export default connect((state) => {
  const traces = TraceProcessor.processTraces(state.traces);
  const filteredTraces = TraceFilter.filterTraces(
    Warnings.checkForWarnings(traces),
    state.filters
  );
  return {
    traces : filteredTraces,
    filters : state.filters,
    stats: computeStats(traces)
  };
})(App)