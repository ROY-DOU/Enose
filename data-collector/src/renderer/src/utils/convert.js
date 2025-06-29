// 输入49 输出31
const _ = require("lodash");
const int2hex = (num) => {
  return _.parseInt(num).toString(16).padStart(2, "0");
};

// 输入1 输出[0, 0, 0, 1]
const int2char = (num) => {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32BE(num);
  return buffer;
};

const bytes2float = (bytes) => {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  for (let i = 0; i < 4; i++) {
    view.setUint8(i, bytes[i]);
  }
  return view.getFloat32(0);
};
export { int2hex, int2char, bytes2float };
