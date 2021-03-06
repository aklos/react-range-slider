# React Range Slider

Yet another range slider for React. However, this one is easily customizable, simple and actually does what you need it to do (if it doesn't please create an issue).

Lots of nice optional features, and fully customizable styling.

## Installation

Install via npm

```
npm install --save @aklos/react-range-slider
```

## Usage

Import the component into your project

```
import RangeSlider from '@aklos/react-range-slider';
// or
const RangeSlider = require('@aklos/react-range-slider');
```

Example configuration

```
<RangeSlider
  min={0}
  max={100}
  increment={5}
  showLabels
  flexibleRange
  labelTransform={(labelStr) => labelStr + ' km'}
  onChange={(start, end) => console.log(start, end)}
/>
```

### Options

* `min` - `Number, required`: The minimum value for the slider.
* `max` - `Number, required`: The maximum value.
* `start` - `Number`: Initial start value.
* `end` - `Number`: Initial end value.
* `increment` - `Number`: Amount to increment between values.
* `disableRange` - `Boolean`: Disable start/end range and just use a basic slider.
* `disableRangeDrag` - `Boolean`: Disable ability to click and drag range by its filled area.
* `flexibleRange` - `Boolean`: Allow range dragging to compress/expand when going above or below min/max.
* `showLabels` - `Boolean`: Show start/end value labels. If range is disabled, only one label will show.
* `labelPosition` - `Enum('top', 'bottom', 'left', 'right')`: Where to position the labels in relation to the slider.
* `labelTransform` - `Function(labelStr)`: Change the label string output to whatever you want (ie. formatted dates, add units, etc.)
* `styling` - `Object`: Pass your own styling overrides, as a flat CSS class name map.
* `onChange` - `Function(valA, valB?)`: Handle the output value(s) however you like.

### Styling

Every part of the slider is customizable, below is the CSS structure:

* `.container` - The slider + label div.
  * `&.labelsLeft` - Layout for left positioned labels.
  * `&.labelsRight` - Layout for right positioned labels.
  * `.slider` - The actual slider div.
    * `.range` - The filled range.
      * `&.draggable` - Draggable range styling.
    * `.handle` - Both range handles.
      * `&.startHandle` - Only on start handle.
      * `&.endHandle` - Only on end handle.
  * `.labelContainer` - Container div for both labels.
    * `&.top` - Top position styling.
    * `&.bottom` - Bottom position styling.
    * `&.left` - Left position styling.
    * `&.right` - Right position styling.
    * `.label` - Both labels.
      * `&.startLabel` - Only on start label.
      * `&.endLabel` - Only on end label.

When overriding with `styling` prop, provide flat class name map:

```
/* sliderStyles.css */
.container { background-color: blue; }
.container.labelsLeft { display: flex; flex-direction: row; }
.slider { width: 320px; }
.slider.range { background-color: gray; }

/* js */
import styles from './sliderStyles.css';

<RangeSlider
  ...props
  styling={{
    container: styles.container,
    labelsLeft: styles.labelsLeft,
    slider: styles.slider,
    range: styles.range
  }}
/>
```

## Examples

Coming soon.
