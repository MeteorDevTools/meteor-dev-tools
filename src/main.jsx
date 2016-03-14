import 'babel-polyfill'
import { getStore, getPlugins } from './plugins'
import { render } from 'react-dom'
import { Provider, connect } from 'react-redux'
import React, { Component } from 'react';
import NotificationSystem from 'react-notification-system'
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs'
import _ from 'underscore';
import Analytics from './common/analytics';

class App extends Component {
  showGlobalError(msg) {
    this._notificationSystem.addNotification({
      message: msg,
      level: 'error',
      position: 'br'
    });
  }

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem;
    window.onerror = (message) => {
      this.showGlobalError(message);
    };
  }

  render() {
    const plugins = getPlugins();
    const tabs = _.map(plugins, (p) => {
      return <Tab key="tab-{p.name}">{p.name}</Tab>;
    });
    const tabPanels = _.map(plugins, (p) => {
      return <TabPanel className="app-tab-panel" key="tab-panel-{p.name}">{p.component}</TabPanel>;
    });

    const notificaitonStyle = {
      NotificationItem: {
        DefaultStyle: {
          margin: '10px 5px 40px 1px'
        }
      }
    };
    return (
      <div className="tab-wrapper">
        <Tabs className="app-tabs">
          <TabList>
            {tabs}
          </TabList>
          {tabPanels}
        </Tabs>  
        <NotificationSystem ref="notificationSystem" style={notificaitonStyle} />
      </div>
    )
  }
}

((rootElement, AppContainer, store) => {
  Analytics.setup()
  rootElement.innerHTML = ''
  render(<Provider store={store}><AppContainer /></Provider>, rootElement)
})(document.querySelector('.app-container'), connect()(App), getStore())
