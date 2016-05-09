import JSZip from "jszip";
import Radium from "radium";
import React, { Component } from "react";
import { saveAs } from "./FileSaver";

import BarcodeInput from "./BarcodeInput";
import BarcodeRenderer from "./BarcodeRenderer";

@Radium
export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      barcodes: [],
    };
  }

  setBarcodes = (barcodes) => {
    this.setState({ barcodes });
  };

  download = (e) => {
    e.preventDefault();

    const zip = new JSZip();
    const images = zip.folder("barcodes");
    var canvases = document.querySelectorAll("canvas");
    for (let n = 0; n < canvases.length; n++) {
      const canvas = canvases[n];
      const barcode = canvas.getAttribute("data-barcode");
      const data = canvas.toDataURL("image/png");
      const raw = data.slice(22);

      const name = barcode.replace(/[^-_a-zA-Z0-9]/g, "_");
      images.file(`${name}.png`, raw, { base64: true });
    }

    zip.generateAsync({ type: "blob" })
      .then((content) => {
        saveAs(content, "barcodes.zip");
      });
  };

  render() {
    const { barcodes } = this.state;

    return (
      <div style={styles.container}>
        <div style={styles.left}>
          <h3 style={styles.header}>Paste Barcodes</h3>

          <div style={styles.content}>
            <BarcodeInput style={styles.barcodeInput}
                          value={barcodes}
                          onChange={this.setBarcodes} />
          </div>
        </div>

        <div style={styles.right}>
          <h3 style={styles.header}>Output</h3>
          <div style={styles.scroller}>
            <BarcodeRenderer barcodes={barcodes} style={styles.renderer} />
          </div>
          <a href="#" onClick={this.download} style={styles.download}>Download All</a>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },

  left: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "50%",
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    padding: 20,
  },

  right: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "50%",
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    padding: 20,
  },

  header: {
    color: "#596774",
    textTransform: "uppercase",
    letterSpacing: "2px",
    fontSize: "15px",
    fontWeight: "200",
    marginBottom: "13px",
  },

  content: {
    position: "relative",
    flex: 1,
  },

  barcodeInput: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  scroller: {
    position: "relative",
    flex: 1,
    overflowY: "auto",
  },

  renderer: {
    width: "100%",
  },

  download: {
    color: "#596774",
    textTransform: "uppercase",
    letterSpacing: "2px",
    fontSize: "15px",
    fontWeight: "200",
    marginBottom: "13px",
    textDecoration: "none",

    ":hover": {
      textDecoration: "underline",
    },
  },
};

