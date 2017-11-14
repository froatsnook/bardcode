export default function encodeFIM(text) {
  if (!/^[ABCD]$/.test(text)) {
    throw new Error("FIM can only encode 'A', 'B', 'C', or 'D'");
  }

  let bits;
  switch (text) {
  case "A": bits = "110010011"; break;
  case "B": bits = "101101101"; break;
  case "C": bits = "110101011"; break;
  case "D": bits = "111010111"; break;
  }

  return {
    type: "bits",
    data: [{ char: text, humanReadable: false, bits }],
  };
}

