import babel from "rollup-plugin-babel";
import json from "rollup-plugin-json";

export default {
  input: "lib/index.js",
  output: {
    name: "bardcode",
  },
  plugins: [
    json({
      preferConst: false,
    }),
    babel(),
  ],
  banner: "/*\n * bardcode (c) 2016-2017 froatsnook\n */",
};

