import Radium from "radium";
import React, { Component, PropTypes } from "react";

import Barcode from "./Barcode";

@Radium
export default class BarcodeRenderer extends Component {
  static propTypes = {
    barcodes: PropTypes.arrayOf(PropTypes.string).isRequired,
    style: PropTypes.object,
  };

  render() {
    const { barcodes, style } = this.props;

    const nonEmpty = barcodes.filter((x) => !!x);

    const elements = nonEmpty.map((barcode, n) => {
      return (
        <Barcode key={`${n}_${barcode}`} value={barcode} style={styles.barcode} />
      );
    });

    return (
      <div style={[styles.container, style]}>
        {elements}
      </div>
    );
  }
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },

  barcode: {
    margin: "8px",
  },
};

