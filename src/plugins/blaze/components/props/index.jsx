import React, { PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'underscore';

export default React.createClass({
  render () {
    if(this.props.properties) {
      console.error('selected props are', this.props.properties);

      const data = this.props.properties.data;
      const dataSection = data ? (
          <table>
            <thead></thead>
              <th>Data</th>
            <tbody>
              { 
                data.map((v, k) => {
                  return <tr>
                    <td>{k}</td>
                    <td>{JSON.stringify(v)}</td>
                  </tr>;
                })
              }
            </tbody>
          </table>
      ) : <div>no data</div>;

      const events = this.props.properties.events;
      const eventsSection = events ? (
        <table>
          <thead></thead>
            <th>Events</th>
          <tbody>
            { 
              events.map((e) => {
                return <tr>
                  <td>{e}</td>
                </tr>;
              })
            }
          </tbody>
        </table>
      ) : <div>no events</div>;

      const helpers = this.props.properties.helpers;
      const helpersSection = helpers ? (
        <table>
          <thead></thead>
            <th>Helpers</th>
          <tbody>
            { 
              helpers.map((h) => {
                return <tr>
                  <td>{h}</td>
                </tr>;
              })
            }
          </tbody>
        </table>
      ) : <div>no helpers</div>;

      return <div>
        {dataSection}
        {eventsSection}
        {helpersSection}
      </div>;
    } else {
      return <div>Select a node to see its properties</div>;
    }
  }
});
