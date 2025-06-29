import PortConfigPanel from "./components/PortConfigPanel";
import { Button, Spinner, Toast, ToastBody, Toaster, ToastTitle, useToastController } from "@fluentui/react-components";
import { useEffect, useId, useRef, useState } from "react";
import Chart from "./components/Chart";
import { int2char, int2hex, bytes2float } from "./utils/convert";

const { ipcRenderer } = window.require("electron");
const _ = require("lodash");

function App() {
  // 串口状态
  const [isReading, setIsReading] = useState(false);
  const [isOpeningPort, setIsOpeningPort] = useState(false);
  const [isClosingPort, setIsClosingPort] = useState(false);

  // 折线图数据
  const [graphData, setGraphData] = useState(Array.from({ length: 24 }).map(() => []));

  // 消息通知
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const notify = (title, body, intent) => {
    dispatchToast(
      (<Toast>
        <ToastTitle>
          {title}
        </ToastTitle>
        {
          body &&
          (<ToastBody>
            {body}
          </ToastBody>)
        }
      </Toast>),
      { intent }
    );
  };


  // 设置面板
  const [config, setConfig] = useState({
    communication: {
      port: "",
      baudRate: "9600",
      dataBits: "8",
      stopBits: "1",
      parity: "无",
      flowControl: "无"
    },
    graph: {
      showInterval: "1000",
      showLastNColumns: {
        enable: true,
        n: "10"
      }
    },
    receive: {
      display: "十进制",
      saveAsFile: {
        enable: true,
        lines: "6000",
        folder: "",
        filename: "%Y-%m-%d-%n.xlsx"
      },
      stopAfterSave: {
        enable: true
      }
    }
  });
  const onConfigChange = (newConfig) => {
    notify("配置已更新", null, "success");
    setConfig(newConfig);
    // 存储到本地
    ipcRenderer.send("save-config", newConfig);
  };

  useEffect(() => {
    ipcRenderer.send("get-config");
    ipcRenderer.once("config", (event, configFromFile) => {
      try {
        if (configFromFile === null) {
          return;
        }
        setConfig(configFromFile);
      } finally {
        ipcRenderer.send("get-homedir");
        ipcRenderer.on("homedir", (event, homedir) => {
          setConfig((config) => {
            const configCopy = _.cloneDeep(config);
            configCopy.receive.saveAsFile.folder = homedir;
            return configCopy;
          });
        });
      }
    });
  }, []);

  // 接收到的所有数据 24个float一组
  const [dataAll, setDataAll] = useState([]);
  // 当前接收到的组
  const currentLine = useRef([]);

  // 刷新折线图
  const showNext = () => {
    if (currentLine.current.length === 0) {
      return;
    }
    setGraphData(d => {
      const newData = _.cloneDeep(d);
      for (let i = 0; i < 24; i++) {
        newData[i].push(currentLine.current[i]);
      }
      currentLine.current = [];
      return newData;
    });
  };
  useEffect(() => {
    const interval = setInterval(showNext, config.graph.showInterval);
    return () => {
      clearInterval(interval);
    };
  }, [config.graph.showInterval]);

  // 刷新数据时滚动到底部
  const dataBoxBottomRef = useRef(null);
  useEffect(() => {
    dataBoxBottomRef.current.scrollIntoView();
  }, [dataAll, isReading]);

  const lineCount = useRef(0);
  const lineToSave = useRef([]);
  const fileSavedCount = useRef(0);
  const start = async () => {
    setIsOpeningPort(true);
    const portConfig = {
      path: config.communication.port,
      baudRate: _.toNumber(config.communication.baudRate),
      dataBits: _.toNumber(config.communication.dataBits),
      stopBits: _.toNumber(config.communication.stopBits),
      parity: (() => {
        if (config.communication.parity === "无") return "none";
        if (config.communication.parity === "奇校验") return "odd";
        if (config.communication.parity === "偶校验") return "even";
        if (config.communication.parity === "恒为1") return "mark";
        if (config.communication.parity === "恒为0") return "space";
      })(),
      rtscts: config.communication.flowControl === "硬件",
      xon: config.communication.flowControl === "软件",
      xoff: config.communication.flowControl === "软件"
    };

    setTimeout(() => {
      setIsOpeningPort(false);
      ipcRenderer.send("open-port", portConfig);
    }, 1000);
  };

  const stop = async () => {
    setIsClosingPort(true);

    setTimeout(() => {
      ipcRenderer.send("close-port");
      setIsClosingPort(false);
    }, 1000);
  };

  const newLine = (dataLine) => {
    // 取data的最后34*3=102个字节
    const data = dataLine.slice(-102);
    // 每34个字节一组，去除首尾两个字节
    const dataGroup = _.chunk(data, 34).map(d => d.slice(1, -1));
    // 每组数据中，每4个字节一组，转换为float
    const dataFloat = dataGroup.map(d => _.chunk(d, 4).map(bytes2float));
    // 将24个float一组的数据放入currentLine
    currentLine.current = _.flatten(dataFloat);
    setDataAll(d => [...d, ...dataLine]);
    lineCount.current++;
    setConfig((config) => {//为了获取最新的config
      if (config.receive.saveAsFile.enable) {
        lineToSave.current.push(currentLine.current);
        if (lineCount.current === _.toNumber(config.receive.saveAsFile.lines)) {
          console.log(config.receive.saveAsFile.folder);
          const filename = config.receive.saveAsFile.filename
            .replaceAll("%Y", new Date().getFullYear().toString())
            .replaceAll("%m", (new Date().getMonth() + 1).toString())
            .replaceAll("%d", new Date().getDate().toString())
            .replaceAll("%H", new Date().getHours().toString())
            .replaceAll("%M", new Date().getMinutes().toString())
            .replaceAll("%S", new Date().getSeconds().toString())
            .replaceAll("%l", config.receive.saveAsFile.lines.toString())
            .replaceAll("%n", fileSavedCount.current.toString())
            .trim();
          ipcRenderer.send("save-file", {
            folder: config.receive.saveAsFile.folder.trim(),
            filename,
            data: lineToSave.current
          });
          lineCount.current = 0;
          lineToSave.current = [];
          if (config.receive.stopAfterSave.enable) {
            stop();
          }
        }
      }
      return config;
    });
  };
  const dataCounter = useRef(0);
  const dataBuffer = useRef([]);
  useEffect(() => {
    ipcRenderer.on("port-data", (event, { data, index }) => {
      // 一行数组分成三组来传
      // 第一组数据开头是'1'，结尾是'A'
      // 第二组数据开头是'2'，结尾是'B'
      // 第三组数据开头是'3'，结尾是'C'
      const i = dataCounter.current % 3;
      if (data[0] !== "1".charCodeAt(0) + i ||
        data[data.length - 1] !== "A".charCodeAt(0) + i) {
        console.warn("异常的数据包", data);
        // notify("异常的数据包", data.toString(), "warning");
        return;
      }
      dataCounter.current++;
      dataBuffer.current = [...dataBuffer.current, ...data];
      if (i === 2) {
        newLine(dataBuffer.current);
        dataBuffer.current = [];
        dataCounter.current = 0;
      }
    });
    ipcRenderer.on("open-port-failed", (event, error) => {
      notify("串口打开失败", error.message, "error");
    });
    ipcRenderer.on("open-port-success", (event, error) => {
      setIsReading(true);
      notify("串口打开成功", null, "success");
    });
    ipcRenderer.on("close-port-failed", (event, error) => {
      notify("串口关闭失败", error.message, "error");
    });
    ipcRenderer.on("close-port-success", (event, error) => {
      setIsReading(false);
      lineCount.current = 0;
      fileSavedCount.current = 0;
      notify("串口关闭成功", null, "success");
    });
    ipcRenderer.on("uncaughtException", (event, error) => {
      notify("错误", error.message, "error");
    });
    ipcRenderer.on("save-file-failed", (event, error) => {
      notify("保存文件失败", error.message, "error");
    });
    ipcRenderer.on("save-file-success", (event, error) => {
      notify("保存文件成功", null, "success");
      fileSavedCount.current++;
    });
    return () => {
      ipcRenderer.removeAllListeners("port-data");
      ipcRenderer.removeAllListeners("open-port-failed");
      ipcRenderer.removeAllListeners("open-port-success");
      ipcRenderer.removeAllListeners("close-port-failed");
      ipcRenderer.removeAllListeners("close-port-success");
      ipcRenderer.removeAllListeners("uncaughtException");
      ipcRenderer.removeAllListeners("save-file-failed");
      ipcRenderer.removeAllListeners("save-file-success");
      ipcRenderer.removeAllListeners("homedir");
    };
  }, []);

  return (
    <>
      <Toaster toasterId={toasterId} />
      <div className={"flex flex-row h-screen"}
           style={{ background: "rgb(250, 250, 250)" }}>
        <div className={"h-full p-2"}>
          <div className={"flex flex-col content-center h-full p-2 gap-5 bg-white rounded-xl shadow overflow-y-scroll"}>
            <PortConfigPanel config={config}
                             onConfigChange={onConfigChange}
                             disabled={isReading || isOpeningPort || isClosingPort}
                             style={{ width: 280, minWidth: 280 }} />
            <div style={{ paddingLeft: "1em", paddingRight: "1em" }}>
              {
                !isReading &&
                <Button appearance={"primary"}
                        className={"w-full"}
                        onClick={async () => {
                          if (isOpeningPort || isClosingPort) {
                            return;
                          }
                          await start();
                        }}>
                  {
                    isOpeningPort ?
                      <div className={"flex flex-row gap-2"}>
                        <Spinner size={"tiny"} appearance={"primary"} />
                        正在打开串口
                      </div>
                      :
                      "开始读取"
                  }
                </Button>
              }
              {
                isReading &&
                <Button appearance={"primary"}
                        className={"w-full"}
                        onClick={async () => {
                          if (isOpeningPort || isClosingPort) {
                            return;
                          }
                          await stop();
                        }}
                        style={{ background: "#c50f1f" }}>
                  {
                    isClosingPort ?
                      <div className={"flex flex-row gap-2"}>
                        <Spinner size={"tiny"} appearance={"inverted"} />
                        正在关闭串口
                      </div>
                      :
                      "停止读取"
                  }
                </Button>
              }
            </div>
          </div>
        </div>
        <div className={"h-full flex-1"}>
          <div className={"h-2/3 pt-2 pr-2"}>
            <div className={"h-full bg-white rounded-xl shadow p-1"}>
              <Chart data={graphData} config={config} className={"h-full"} />
            </div>
          </div>
          <div className={"h-1/3 p-2 pl-0"}>
            <div className={"bg-white rounded-xl shadow h-full p-2"}
                 style={{
                   overflowY: isReading ? "hidden" : "scroll"
                 }}>
              {
                dataAll
                  .slice(isReading ? 3000 : 0)
                  .map((byte, index) => {
                    if (config.receive.display === "十进制") {
                      return byte;
                    } else if (config.receive.display === "十六进制") {
                      return int2hex(byte);
                    } else if (config.receive.display === "ASCII") {
                      return int2char(byte).toString();
                    }
                  })
                  .join(config.receive.display === "ASCII" ? "" : " ")
              }
              <div ref={dataBoxBottomRef}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
