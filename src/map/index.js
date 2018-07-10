import React from 'react';
import isequal from 'lodash/isEqual';
import PropTypes from 'prop-types';
import * as maptalks from 'maptalks';

class Map extends React.Component {
  static defaultProps = {};

  static propTypes = {
    center: PropTypes.array.isRequired,
    zoom: PropTypes.number.isRequired,
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
    maxExtent: PropTypes.array,
    zoomable: PropTypes.bool,
    className: PropTypes.string,
    checkSize: PropTypes.bool,
    renderer: PropTypes.string,
    maxVisualPitch: PropTypes.number,
    maxPitch: PropTypes.number,
    centerCross: PropTypes.bool,
    zoomInCenter: PropTypes.bool,
    fpsOnInteracting: PropTypes.number,
    enableInfoWindow: PropTypes.bool,
    zoomAnimationDuration: PropTypes.number,
    panAnimationDuration: PropTypes.number,
    layerCanvasLimitOnInteracting: PropTypes.number,
    layer: PropTypes.arrayOf(PropTypes.object),
    baseLayer: PropTypes.arrayOf(PropTypes.object),
    events: PropTypes.objectOf(PropTypes.func)
  };

  static childContextTypes = {
    map: PropTypes.instanceOf(maptalks.Map)
  };

  constructor(props) {
    super(props);

    this.state = {
      map: undefined,
      isLoad: false
    };

    this.container = null;

    this.events = {};
  }

  getChildContext() {
    const { map } = this.state;
    return {
      map
    };
  }

  // componentWillReceiveProps(nextProps)
  // shouldComponentUpdate(nextProps, nextState)
  // componentWillUpdate(nextProps, nextState)
  // componentDidUpdate(prevProps, prevState)

  componentWillReceiveProps(nextProps) {
    const { map } = this.state;
    const { center, zoom } = this.props;
    if (!map) {
      return null;
    }

    if (!isequal(nextProps.center, center)) {
      map.setCenter(nextProps.center);
    }

    if (!isequal(nextProps.zoom, zoom)) {
      map.setZoom(nextProps.zoom);
    }
    // set layers
    this.setBaseLayer(nextProps.baseLayer);
    this.setLayers(nextProps.layers);

    return null;
  }

  /**
   * set base layers
   * @param layers
   * @returns {null}
   */
  setBaseLayer (layers) {
    const { map } = this.state;
    if (!map) {
      return null;
    }
    if (layers && layers.length > 0) {
      map.setBaseLayer();
    }
  }

  /**
   * set layers
   * @param layers
   * @returns {null}
   */
  setLayers (layers) {
    const { map } = this.state;
    if (!map) {
      return null;
    }
    if (layers && layers.length > 0) {
      // map.addLayer();
    }
  }

  setRef = (x = null) => {
    this.container = x;
  };

  componentDidMount() {
    const { center, zoom, events } = this.props;
    const options = {
      zoom,
      center
    };
    const map = new maptalks.Map(this.container, options);
    this.setState({
      map
    });

    if (map.isLoaded()) {
      this.setState({
        isLoad: true
      });
      for (const key in events) {
        if (key === 'onload') {
          events[key](map, this);
        } else {
          map.on(key, events[key], this);
        }
      }
    }
  }

  componentWillUnmount() {
    // console.log('des');
  }

  render() {
    const { isLoad } = this.state;
    const { className, children } = this.props;
    return (
      <div ref={this.setRef} className={className}>
        {isLoad ? children : null}
      </div>
    );
  }
}

export default Map;
