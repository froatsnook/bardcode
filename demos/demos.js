(function() {

"use strict";

window.drawGrid = function(g, w, h, spacing) {
  g.strokeStyle = "black";

  for (var x = 0; x < w; x += spacing) {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, h);
    g.stroke();
  }

  for (var y = 0; y < h; y += spacing) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(w, y);
    g.stroke();
  }
};

var Demo = React.createClass({
  getInitialState: function() {
    return { code: this.props.children.toString().trim() };
  },

  runCode: function() {
    var code = this.state.code;
    //console.log(code);
    eval(code);
  },

  updateCode: function(e) {
    var newCode = e.target.value;
    this.setState({
      code: newCode
    });
  },

  render: function() {
    var self = this;

    // Extract the canvasId from the code.
    var canvasId = /document.getElementById\("(.*)"\)/.exec(this.state.code)[1];

    var w = /w = (\d+)/.exec(this.state.code)[1];
    var h = /h = (\d+)/.exec(this.state.code)[1];

    var codeStyle = {
        width: w + "px",
        height: h + "px"
    };
    var canvasStyle = {
        width: w + "px",
        height: h + "px"
    };

    setTimeout(function() {
      self.runCode();
    }, 0);

    return (
      <article className="demo-container">
        <div className="demo">
          <h3>{this.props.name}</h3>

          <textarea className="demo-code"
                    value={this.state.code}
                    onChange={this.updateCode}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    style={codeStyle}></textarea>

          <canvas id={canvasId}
                  className="demo-canvas"
                  width={w}
                  height={h}
                  style={canvasStyle}></canvas>
        </div>
      </article>
    );
  }
});

React.render(
  <div id="demos">

    <section>
      <h2>Introduction</h2>

      <p>By default, bardcode renders in the top left corner of the canvas.</p>

      <Demo name="demo 1 - just draw something">
{`
var w = 420, h = 200;
var canvas = document.getElementById("demo-1");
var g = canvas.getContext("2d");
g.fillStyle = "white";
g.fillRect(0, 0, w, h);
bardcode.drawBarcode(g, "test", { });
`}
      </Demo>

      <p>So why is it not at the very top left?  bardcode, by default, includes a quiet zone to the left and right of the barcode.  Since it's left aligned, there is some space on the left.  This can be configured:</p>

      <Demo name="demo 2 - no quiet zone">
{`
var w = 420, h = 200;
var canvas = document.getElementById("demo-2");
var g = canvas.getContext("2d");
g.fillStyle = "white";
g.fillRect(0, 0, w, h);
bardcode.drawBarcode(g, "test", {
    quietZoneSize: 0
});
`}
      </Demo>

      <p>You can align and position the barcode within the canvas however you want:</p>

      <Demo name="demo 3 - position and alignment">
{`
var w = 420, h = 230;
var canvas = document.getElementById("demo-3");
var g = canvas.getContext("2d");
g.fillStyle = "white";
g.fillRect(0, 0, w, h);
bardcode.drawBarcode(g, "test", {
    x: w/2,
    y: h/2,
    horizontalAlign: "center",
    verticalAlign: "middle"
});
`}
      </Demo>

      <p>You might also find it useful to rotate the barcode.  Use <span className="mono">options.angle</span> (degrees clockwise).</p>

      <Demo name="demo 4 - rotation">
{`
var w = 420, h = 250;
var canvas = document.getElementById("demo-4");
var g = canvas.getContext("2d");
g.fillStyle = "white";
g.fillRect(0, 0, w, h);
bardcode.drawBarcode(g, "test", {
    x: w/2,
    y: h/2,
    horizontalAlign: "center",
    verticalAlign: "middle",
    angle: 90
});
`}
      </Demo>

    </section>

    <section>
      <h2>Width and height</h2>

      <p>There are several options for controlling the width and height of rendered barcodes.</p>

      <p>Setting the <span className="mono">moduleWidth</span> sets the width of the thinnest bar.  The default value is 2.892.</p>

      <p>That is, of course, unless you specify the <span className="mono">maxWidth</span> which will decrease the <span className="mono">moduleWidth</span> (if necessary) so that the barcode will fit within it (including the quiet zone unless <span className="mono">quietZoneSize</span> is set to 0).</p>

      <p>However, both are ignored if the <span className="mono">width</span> is specfied.  The <span className="mono">moduleWidth</span> will be set to whatever value is necessary to make the barcode (plus quiet zone unless <span className="mono">quietZoneSize</span> is set to 0) have the given width.</p>

      <Demo name="demo 5 - width and height">
{`
var w = 420, h = 290;
var canvas = document.getElementById("demo-5");
var g = canvas.getContext("2d");
g.fillStyle = "white";
g.fillRect(0, 0, w, h);

drawGrid(g, w, h, 20);

bardcode.drawBarcode(g, "test", {
    x: w/2,
    y: 0,
    moduleWidth: 2,
    quietZoneSize: 0,
    horizontalAlign: "center",
    verticalAlign: "top",
    height: 50
});
bardcode.drawBarcode(g, "test", {
    x: w/2,
    y: 60,
    maxWidth: 2*w/3,
    horizontalAlign: "center",
    verticalAlign: "top",
    height: 50
});
bardcode.drawBarcode(g, "test", {
    x: w/2,
    y: 120,
    maxWidth: 2*w/3,
    quietZoneSize: 0,
    horizontalAlign: "center",
    verticalAlign: "top",
    height: 50
});
bardcode.drawBarcode(g, "test", {
    x: w/2,
    y: 180,
    width: w,
    horizontalAlign: "center",
    verticalAlign: "top",
    height: 50
});
bardcode.drawBarcode(g, "test", {
    x: w/2,
    y: 240,
    width: w,
    quietZoneSize: 0,
    horizontalAlign: "center",
    verticalAlign: "top",
    height: 50
});
`}
      </Demo>

    </section>

    <section>
      <h2>Symbologies</h2>

      <p>So far all of the barcodes have been Code-128 encoded "test".  Use the second parameter to `bardcode.drawBarcode` to change the barcode text, and set <span className="mono">options.type</span> to use a different symbology.</p>

      <p>The supported symbologies are:</p>
      <ul>
        <li>Codabar</li>
        <li>Code 128</li>
        <li>Code 39</li>
        <li>EAN-8</li>
        <li>EAN-13</li>
        <li>FIM</li>
        <li>ITF (interleaved 2 of 5)</li>
        <li>UPC-A</li>
      </ul>

      <Demo name="demo 6 - symbologies">
{`
var w = 420, h = 370;
var canvas = document.getElementById("demo-6");
var g = canvas.getContext("2d");
g.fillStyle = "white";
g.fillRect(0, 0, w, h);

var barcodes = [
  { type: "Codabar", val: "31117013206375" },
  { type: "Code 128", val: "BarCode 1" },
  { type: "Code 39", val: "0123456789" },
  { type: "EAN-8", val: "9638507" },
  { type: "EAN-13", val: "590123412345" },
  { type: "FIM", val: "C" },
  { type: "ITF", val: "04004" },
  { type: "UPC-A", val: "90123412345" }
];

var targetHeight = (h + 5)/barcodes.length;

for (var i = 0; i < barcodes.length; i++) {
  var barcode = barcodes[i];
  bardcode.drawBarcode(g, barcode.val, {
    type: barcode.type,
    x: w/2,
    y: i*targetHeight,
    maxWidth: w,
    horizontalAlign: "center",
    verticalAlign: "top",
    height: targetHeight - 5
  });
}
`}
      </Demo>

    </section>
  </div>,
  document.getElementById("content")
);

})();

