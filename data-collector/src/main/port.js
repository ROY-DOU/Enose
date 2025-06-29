const SerialPort = require("serialport");
const ByteLength = require("@serialport/parser-byte-length");

class Port {
  _port = null;
  _parser = null;

  open(openConfig, { onData, onOpen, onError }) {
    const { path, ...config } = openConfig;
    try {
      this._port = new SerialPort(path, { ...config });
      this._parser = this._port.pipe(new ByteLength({ length: 34 }));
    } catch (err) {
      console.log(err);
      onError(err);
    }
    this._parser.on("data", (data) => {
      onData(data);
    });
    this._port.on("open", () => {
      this._port.flush();
      onOpen();
    });
    this._port.on("error", (err) => {
      onError(err);
    });
  }

  close(onErr) {
    this._port.close(onErr);
  }
}

export default Port;
