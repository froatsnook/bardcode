import Radium from "radium";
import React, { Component, PropTypes } from "react";
import { findDOMNode } from "react-dom";

import drawBarcode from "./bardcode";

const DOM_WIDTH = 250;
const DOM_HEIGHT = 140;
const WIDTH = DOM_WIDTH*(window.devicePixelRatio || 1);
const HEIGHT = DOM_HEIGHT*(window.devicePixelRatio || 1);
const BARCODE_WIDTH = WIDTH;
const BARCODE_HEIGHT = HEIGHT - 40*(window.devicePixelRatio || 1);

@Radium
export default class Barcode extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    style: PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const canvas = findDOMNode(this.refs.canvas);

    this.g = canvas.getContext("2d");
    this.draw();
  }

  draw() {
    const { g } = this;
    const { value } = this.props;

    try {
      g.fillStyle = "white";
      g.fillRect(0, 0, WIDTH, HEIGHT);

      drawBarcode(g, value, {
        maxWidth: BARCODE_WIDTH,
        height: BARCODE_HEIGHT,
        y: 10*(window.devicePixelRatio || 1),
      });

      g.fillStyle = "black";
      g.font = "30px 'Helvetica Neue'";
      g.textAlign = "center";
      const x = WIDTH/2;
      const y = HEIGHT - 10*(window.devicePixelRatio || 1);
      g.fillText(value, x, y);
    } catch (err) {
      g.fillStyle = "red";
      g.fillRect(0, 0, WIDTH, HEIGHT);

      g.fillStyle = "white";
      g.font = "24px monospace";
      g.textAlign = "left";
      const x = 10;
      const y = HEIGHT/2;
      g.fillText(`Could not draw: "${value}"`, x, y - 10);
      g.font = "17px monospace";
      g.fillText(err.message, x, y + 16);
    }
  }

  render() {
    const { value, style } = this.props;

    return (
      <canvas ref="canvas"
              width={WIDTH}
              height={HEIGHT}
              style={[styles.container, style]}
              data-barcode={value} />
    );
  }
}

const styles = {
  container: {
    width: `${DOM_WIDTH}px`,
    height: `${DOM_HEIGHT}px`,
  },
};

