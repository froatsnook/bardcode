/**
 * Barcode input, 1 per line.
 */

import Radium from "radium";
import React, { Component, PropTypes } from "react";

@Radium
export default class BarcodeInput extends Component {
  static propTypes = {
    value: PropTypes.arrayOf(PropTypes.string).isRequired,

    // onChange(barcodes)
    // Called when the barcodes change.
    onChange: PropTypes.func.isRequired,

    // Additional styles.
    style: PropTypes.object,
  };

  change = (e) => {
    const { onChange } = this.props;
    const text = e.target.value;

    const value = text.split("\n");
    onChange(value);
  };

  render() {
    const { value, style } = this.props;
    const text = value.join("\n");

    return (
      <div style={[styles.container, style]}>
        <textarea style={styles.text}
                  value={text}
                  onChange={this.change}
                  placeholder="Input barcodes one per line, then download all as a zip file" />
      </div>
    );
  }
}

const styles = {
  container: {
    width: "100%",
    height: "100%",
  },

  text: {
    width: "100%",
    height: "100%",
    resize: "none",
    fontFamily: "monospace",
    outline: 0,
  },
};

