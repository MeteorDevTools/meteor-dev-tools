import React, { PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'underscore';

export default React.createClass({
  render () {
    if(this.props.properties && this.props.properties.data) {
      console.error('selected props are', this.props.properties);

      const data = this.props.properties.data;
      const dataSection = (
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
      );


      return dataSection;
    } else {
      return <div>Select a node to see its properties</div>;
    }
  }
});
