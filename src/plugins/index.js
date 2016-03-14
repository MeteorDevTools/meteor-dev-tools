import React from 'react';
import { createStore, compose, combineReducers } from 'redux';
import DDPReducers from './ddp/reducers';
import _ from 'underscore';
import DDPMonitor from './ddp';

let __store = null;
const plugins = [{
  name: 'DDP Monitor',
  reducers: DDPReducers,
  component: <DDPMonitor />
}];

module.exports = {
  getStore() {
    if (!__store) {
      const finalCreateStore = compose(
        // XX: work with Redux Devtools Chrome extension
        window.devToolsExtension ? window.devToolsExtension() : f => f
      )(createStore);

      const configureStore = function(initialState){
        let rootReducer = {};
        _.each(plugins , (p) => _.extend(rootReducer, p.reducers));
        return finalCreateStore(combineReducers(rootReducer), initialState);
      }

      __store = configureStore();
    }

    return __store;
  },

  getPlugins() {
    return plugins;
  }
};
