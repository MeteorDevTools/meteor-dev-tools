import React, { PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'underscore';
import JSONTree from 'react-json-tree';

export default React.createClass({
  render () {
    if(this.props.properties) {
      let getArrowStyle = (type, expanded) => ({ marginTop: 4 });
      console.error('selected props are', this.props.properties);

      const data = this.props.properties.data;
      const events = this.props.properties.events;
      const helpers = this.props.properties.helpers;
      
      console.error('@@@@@ data is', data);

      return <div>
        { data && data.size !== 0 ? (
          <div>
            <div className="section-separator">Data</div>
            <div className="treeview-wrapper">
              <JSONTree data={data.toJS()} hideRoot={true} getArrowStyle={getArrowStyle} />
            </div>
          </div>
        ) : ''}
        { events && events.size !== 0 ? (
          <div>
            <div className="section-separator">Events</div>
            <ul className="stats">{events.map((e) => <li>{e}</li>)}</ul>
          </div>
        ) : ''}
        { helpers && helpers.size !== 0 ? (
          <div>
            <div className="section-separator">Helpers</div>
            <ul className="stats">{helpers.map((h) => <li>{h}</li>)}</ul>
          </div>
        ) : ''}
      </div>;
    } else {
      return <div></div>;
    }
  }
});
