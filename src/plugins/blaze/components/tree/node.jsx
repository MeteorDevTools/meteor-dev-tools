import React, { PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'underscore';
import NodeType from './node-prop-type';

const Node = React.createClass({
  propTypes : {
    node: NodeType,
    depth: React.PropTypes.number.isRequired,
    onToggleCollapse: React.PropTypes.func.isRequired
  },

  selectedNodeStyle : {
    backgroundColor: 'red'
  },

  hoveredNodeStyle : {
    backgroundColor: 'rgba(255,0,0,0.5)'
  },

  getPaddingStyle () {
    return {paddingLeft: `${5*this.props.depth}px`};
  },

  getStyles (openingTag) {
    return {
      display: this.props.node.get('isExpanded') ? 'block' : 'inline-block' 
    };
  },

  render () {
    const toggleCollapse = (e) => {
      e.stopPropagation();
      this.props.onToggleCollapse(this.props.node.get('_id'));

      // XX: unhover all the children because they seem to have hover
      // stuck to them
      const kids = this.props.getChildNodes(this.props.node.get('_id'));
      kids.forEach((child) => {
        this.props.onHover(child.get('_id'), false);
      });
    }
    const changeSelection = () => this.props.changeBlazeNodeSelection(this.props.node.get('_id'));
    const childNodes = this.props.getChildNodes(this.props.node.get('_id'));
    const hasChildren = childNodes.length !== 0; 
    const nodeOpeningTagContent = `<${this.props.node.get('name')}>`;
    const nodeClosingTagContent = `</${this.props.node.get('name')}>`;
    const expansionToggler = (
      <span onClick={toggleCollapse}>
        {this.props.node.get('isExpanded') ? <span>&#9660;</span> : <span>&#9654;</span> }
      </span>
    );

    const onHover = (isHovered) => {
      this.props.onHover(this.props.node.get('_id'), isHovered);
    };

    // empty node
    if (!hasChildren) {
      let styles = this.getPaddingStyle();
      if (this.props.node.get('isSelected')) {
        styles = _.extend({}, styles, this.selectedNodeStyle);
      } else {
        if (this.props.node.get('isHovered')) {
          styles = _.extend({}, styles, this.hoveredNodeStyle);
        }  
      }
      
      return (
        <div style={styles} 
          onMouseOver={() => onHover(true)}
          onMouseOut={() => onHover(false)}>
          <div style={this.getStyles(true)} onClick={changeSelection}>{nodeOpeningTagContent}</div>
          <div style={this.getStyles(false)}>{nodeClosingTagContent}</div>
        </div>
      );
    } else {
      let tagWrapperStyle = this.getPaddingStyle();
      let openingTagStyles = this.getStyles(true);

      if (this.props.node.get('isSelected')) {
        if (!this.props.node.get('isExpanded')) {
          tagWrapperStyle = _.extend({}, tagWrapperStyle, this.selectedNodeStyle);
        } else {
          openingTagStyles = _.extend({}, openingTagStyles, this.selectedNodeStyle);
        }
      } else {
        if (this.props.node.get('isHovered')) {
          if (this.props.node.get('isExpanded')) {
            openingTagStyles = _.extend({}, openingTagStyles, this.hoveredNodeStyle);
          } else {
            tagWrapperStyle = _.extend({}, tagWrapperStyle, this.hoveredNodeStyle);
          }
        }
      }

      return (
        <div style={tagWrapperStyle} onMouseOver={() => {
          // XX: only handle this if the node is collapsed
          !this.props.node.get('isExpanded') && onHover(true);
        }} onMouseOut={() => {
          // XX: only handle this if the node is collapsed
          !this.props.node.get('isExpanded') && onHover(false);
        }}>
          <div style={openingTagStyles} 
          onMouseOver={() => onHover(true)} onMouseOut={() => onHover(false)}
          onClick={changeSelection} onDoubleClick={toggleCollapse}>
            {expansionToggler}
            {nodeOpeningTagContent}
          </div>
            { 
              this.props.node.get('isExpanded') ? childNodes.map(node => (
                <Node node={node} depth={this.props.depth+1}
                  getChildNodes={this.props.getChildNodes}
                  changeBlazeNodeSelection={this.props.changeBlazeNodeSelection}
                  onToggleCollapse={this.props.onToggleCollapse}
                  onHover={this.props.onHover} />
              )) : "..."
            }
          <div style={this.getStyles(false)}>{nodeClosingTagContent}</div>
        </div> 
      );
    }
  }
});

export default Node;