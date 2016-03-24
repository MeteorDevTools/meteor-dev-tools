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
    backgroundColor: 'rgb(56,121,217)'
  },

  hoveredNodeStyle : {
    backgroundColor: 'rgba(56,121,217,0.1)'
  },

  getPaddingStyle () {
    return {paddingLeft: `${3*this.props.depth}px`};
  },

  getStyles (openingTag) {
    return {
      display: this.props.node.get('isExpanded') ? 'block' : 'inline-block' 
    };
  },

  shouldComponentUpdate(nextProps) {
    return nextProps !== this.props;
  },

  render () {
    const isExpanded = this.props.node.get('isExpanded');
    const isSelected = this.props.node.get('isSelected');
    const isHovered = this.props.node.get('isHovered');

    console.error('@@@ rendering node');

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
    const nodeOpeningTagContent = `${this.props.node.get('name')}`;
    const nodeClosingTagContent = `/${this.props.node.get('name')}`;
    const expansionToggler = (
      <span onClick={toggleCollapse}>
        { isExpanded ?
        <span className="collapse-toggler">&#9660;</span> :
        <span className="collapse-toggler">&#9654;</span> }
      </span>
    );

    const onHover = (isHovered) => {
      this.props.onHover(this.props.node.get('_id'), isHovered);
    };

    const selectedNodeClassName = isSelected ? 'selected-node' : '';

    // empty node
    if (!hasChildren) {
      let styles = this.getPaddingStyle();
      if (isSelected) {
        styles = _.extend({}, styles, this.selectedNodeStyle);
      } else {
        if (isHovered) {
          styles = _.extend({}, styles, this.hoveredNodeStyle);
        }  
      }
      
      return (
        <div style={styles} 
          onMouseOver={() => onHover(true)}
          onMouseOut={() => onHover(false)}>
          <div className="tag-wrap" style={this.getStyles(true)} onClick={changeSelection}>
            &lt;<span className={`tag-name ${selectedNodeClassName}`}>{nodeOpeningTagContent}</span>&gt;
          </div>
          <div className="tag-wrap" style={this.getStyles(false)}>
            &lt;<span className={`tag-name ${selectedNodeClassName}`}>{nodeClosingTagContent}</span>&gt;
          </div>
        </div>
      );
    } else {
      let tagWrapperStyle = this.getPaddingStyle();
      let openingTagStyles = this.getStyles(true);

      if (isSelected) {
        if (!isExpanded) {
          tagWrapperStyle = _.extend({}, tagWrapperStyle, this.selectedNodeStyle);
        } else {
          openingTagStyles = _.extend({}, openingTagStyles, this.selectedNodeStyle);
        }
      } else {
        if (isHovered) {
          if (isExpanded) {
            openingTagStyles = _.extend({}, openingTagStyles, this.hoveredNodeStyle);
          } else {
            tagWrapperStyle = _.extend({}, tagWrapperStyle, this.hoveredNodeStyle);
          }
        }
      }

      return (
        <div style={tagWrapperStyle} onMouseOver={() => {
          // XX: only handle this if the node is collapsed
          !isExpanded && onHover(true);
        }} onMouseOut={() => {
          // XX: only handle this if the node is collapsed
          !isExpanded && onHover(false);
        }}>
          <div className="tag-wrap" style={openingTagStyles} 
          onMouseOver={() => onHover(true)} onMouseOut={() => onHover(false)}
          onClick={changeSelection} onDoubleClick={toggleCollapse}>
            {expansionToggler}
            &lt;<span className={`tag-name ${selectedNodeClassName}`}>{nodeOpeningTagContent}</span>&gt;
          </div>
            { 
              isExpanded ? childNodes.map(node => (
                <Node key={node.get('_id')} node={node} depth={this.props.depth+1}
                  getChildNodes={this.props.getChildNodes}
                  changeBlazeNodeSelection={this.props.changeBlazeNodeSelection}
                  onToggleCollapse={this.props.onToggleCollapse}
                  onHover={this.props.onHover} />
              )) : "..."
            }
          <div className="tag-wrap" style={this.getStyles(false)}>
            &lt;<span className={`tag-name ${!isExpanded ? selectedNodeClassName : ''}`}>
              {nodeClosingTagContent}</span>&gt;
          </div>
        </div> 
      );
    }
  }
});

export default Node;