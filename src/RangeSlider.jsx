import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styles from './styles.css';

const cx = require('classnames');

class RangeSlider extends React.Component {
  constructor(props) {
    super(props);

    this.serializeValue = this.serializeValue.bind(this);
    this.getCursorVal = this.getCursorVal.bind(this);
    this.updateRangeValues = this.updateRangeValues.bind(this);
    this.updateStartValue = this.updateStartValue.bind(this);
    this.updateEndValue = this.updateEndValue.bind(this);
    this.updateRangePos = this.updateRangePos.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    this.state = {
      start: props.start !== undefined ? props.start : props.min,
      end: props.end !== undefined ? props.end : props.max,
      dragging: null,
      dxStart: null,
      dxEnd: null
    };
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  serializeValue(value) {
    return (
      (value - this.props.min) /
      (this.props.max - this.props.min)
    ) * 100;
  }

  getCursorVal(e) {
    const slider = ReactDOM.findDOMNode(this.slider);
    const sliderRect = slider.getBoundingClientRect();
    const dx = e.clientX - sliderRect.left;
    const dxPercent = (dx / sliderRect.width);

    let val = Math.max(
      this.props.min,
      Math.min(
        this.props.max,
        this.props.min + Math.round(dxPercent * (this.props.max - this.props.min))
      )
    );

    return val -= val % this.props.increment;
  }

  updateRangeValues(val) {
    switch (this.state.dragging) {
      case 'start':
        this.updateStartValue(val);
        break;
      case 'end':
        this.updateEndValue(val);
        break;
      case 'range':
        this.updateRangePos(val);
        break;
      default:
        break;
    }
  }

  updateStartValue(val) {
    if ((this.props.disableRange && val <= this.props.max) || (!this.props.disableRange && val < this.state.end))
      this.setState({ start: val });
  }

  updateEndValue(val) {
    if (val > this.state.start)
      this.setState({ end: val });
  }

  updateRangePos(val) {
    if (!this.props.disableRangeDrag) {
      let dxStart = this.state.dxStart;
      let dxEnd = this.state.dxEnd;

      if (dxStart === null) {
        dxStart = val - this.state.start;
        dxEnd = this.state.end - val;
        this.setState({ dxStart, dxEnd });
      }

      const start = val - dxStart;
      const end = val + dxEnd;

      if (this.props.flexibleRange || (start >= this.props.min && end <= this.props.max))
        this.setState({ 
          start: Math.max(this.props.min, start),
          end: Math.min(this.props.max, end)
        });
    }
  }

  handleMouseDown(e) {
    this.setState({ dragging: e.target.getAttribute('dir') });
  }

  handleMouseUp() {
    if (this.state.dragging && this.props.onChange) {
      this.props.onChange(this.state.start, !this.props.disableRange ? this.state.end : null);
    }
    this.setState({ dragging: null, dxStart: null, dxEnd: null });
  }

  handleMouseMove(e) {
    if (this.state.dragging) {
      let cursorVal = this.getCursorVal(e);
      this.updateRangeValues(cursorVal);
    }
  }

  render() {
    const startPercent = this.serializeValue(this.state.start);
    const endPercent = this.serializeValue(this.state.end);
    const rangePercent = endPercent - startPercent;

    const customStyling = this.props.styling || {};

    const labels = this.props.showLabels ? (
      <div className={cx(styles.labelContainer, customStyling.labelContainer, { 
        [styles.top]: this.props.labelPosition === 'top',
        [styles.bottom]: this.props.labelPosition === 'bottom',
        [styles.left]: this.props.labelPosition === 'left',
        [styles.right]: this.props.labelPosition === 'right',
        [customStyling.top]: this.props.labelPosition === 'top',
        [customStyling.bottom]: this.props.labelPosition === 'bottom',
        [customStyling.left]: this.props.labelPosition === 'left',
        [customStyling.right]: this.props.labelPosition === 'right'
      })}>
        <div className={cx(styles.label, styles.startLabel, customStyling.label, customStyling.startLabel)}>
          { this.props.labelTransform ? this.props.labelTransform(this.state.start) : this.state.start }
        </div>
        { !this.props.disableRange ?
          <div className={cx(styles.label, styles.endLabel, customStyling.label, customStyling.toLabel)}>
            { this.props.labelTransform ? this.props.labelTransform(this.state.end) : this.state.end }
          </div>
          : null }
      </div>
    ) : null;

    return (
      <div className={cx(styles.container, customStyling.container, { 
        [styles.labelsLeft]: this.props.labelPosition === 'left', 
        [styles.labelsRight]: this.props.labelPosition === 'right',
        [customStyling.labelsLeft]: this.props.labelPosition === 'left', 
        [customStyling.labelsRight]: this.props.labelPosition === 'right'
      })}>
        { this.props.showLabels && ['top', 'left'].includes(this.props.labelPosition) ? labels : null }
        <div ref={r => { this.slider = r; }} className={cx(styles.slider, customStyling.slider)}>
          { !this.props.disableRange ?
            <div
              dir='range'
              className={cx(styles.range, customStyling.range, { 
                [styles.draggable]: !this.props.disableRangeDrag,
                [customStyling.draggable]: !this.props.disableRangeDrag
              })}
              style={{ left: `${startPercent}%`, width: `${rangePercent}%` }}
              onMouseDown={this.handleMouseDown}></div>
            : null }
          <span
            dir='start'
            className={cx(styles.handle, styles.startHandle, customStyling.handle, customStyling.startHandle)}
            style={{ left: `${startPercent}%` }}
            onMouseDown={this.handleMouseDown}></span>
          { !this.props.disableRange ?
            <span
              dir='end'
              className={cx(styles.handle, styles.endHandle, customStyling.handle, customStyling.endHandle)}
              style={{ left: `${endPercent}%` }}
              onMouseDown={this.handleMouseDown}></span>
            : null }
        </div>
        { this.props.showLabels && 
          (!this.props.labelPosition || ['bottom', 'right'].includes(this.props.labelPosition)) ? labels : null }
      </div>
    );
  }
}

RangeSlider.defaultProps = {
  increment: 1
};

RangeSlider.propTypes = {
  start: PropTypes.number,
  end: PropTypes.number,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  increment: PropTypes.number,
  showLabels: PropTypes.bool,
  disableRange: PropTypes.bool,
  disableRangeDrag: PropTypes.bool,
  flexibleRange: PropTypes.bool,
  styling: PropTypes.object,
  labelTransform: PropTypes.func,
  labelPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  onChange: PropTypes.func
};

export default RangeSlider;