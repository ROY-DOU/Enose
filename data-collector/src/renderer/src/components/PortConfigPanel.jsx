import { Button, Checkbox, Combobox, Dropdown, Option, Radio, RadioGroup, Input, makeStyles, Tooltip, Popover, PopoverTrigger, PopoverSurface } from "@fluentui/react-components";
import { Folder16Regular, QuestionCircle16Regular } from "@fluentui/react-icons";
import { useEffect, useRef, useState } from "react";

const _ = require("lodash");
const useStyles = makeStyles({
  combobox: {
    minWidth: "unset",
    ">.fui-Combobox__input": {
      width: "80px"
    }
  },
  listbox: {
    width: "80px"
  }
});

function PortConfigPanel(props) {
  const { disabled, config, onConfigChange, ...rest } = props;
  const classes = useStyles();
  const [availablePorts, setAvailablePorts] = useState([]);
  useEffect(() => {
    console.log(config);
  }, [config]);
  useState(() => {
    const interval = setInterval(() => {
      const { ipcRenderer } = window.require("electron");
      ipcRenderer.send("get-available-ports");
      ipcRenderer.once("available-ports", (_, ports) => {
        setAvailablePorts(ports);
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });
  const handleConfigChange = (value, name, group) => {
    const newConfig = {
      ...config,
      [group]: {
        ...config[group],
        [name]: value
      }
    };
    if (_.isEqual(newConfig, config)) {
      return;
    }
    onConfigChange(newConfig);
  };
  const selectFolder = () => {
    const { ipcRenderer } = window.require("electron");
    ipcRenderer.send("select-folder");
    ipcRenderer.once("folder-selected", (_, folder) => {
      const saveAsFile = {
        ...config.receive.saveAsFile,
        folder
      };
      handleConfigChange(saveAsFile, "saveAsFile", "receive");
    });
  };
  return (
    <div {...rest}>
      <div className={"flex flex-col gap-4"}>
        <div>
          <div>通信设置</div>
          <div className={"flex flex-col gap-1"} style={{ marginLeft: "1em" }}>
            <div>
              <span className={"mr-2"}>串口号</span>
              <Combobox className={classes.combobox}
                        disabled={disabled}
                        listbox={{ className: classes.combobox }}
                        value={config.communication.port}
                        onOptionSelect={(_, { selectedOptions }) =>
                          handleConfigChange(selectedOptions[0], "port", "communication")}
                        onChange={() => {
                          console.log("change");
                        }}>
                {
                  availablePorts.map((option, index) => (
                    <Option key={index}>
                      {option}
                    </Option>
                  ))
                }
              </Combobox>
            </div>
            <div>
              <span className={"mr-2"}>波特率</span>
              <Combobox freeform
                        disabled={disabled}
                        className={classes.combobox}
                        listbox={{ className: classes.combobox }}
                        value={config.communication.baudRate}
                        onOptionSelect={(_, { selectedOptions }) => {
                          handleConfigChange(selectedOptions[0], "baudRate", "communication");
                        }}
                        onChange={e => {
                          handleConfigChange(e.target.value, "baudRate", "communication");
                        }}>
                {
                  [
                    "110", "300", "600", "1200", "2400", "4800",
                    "7200", "9600", "14400", "19200", "28800", "38400",
                    "56000", "57600", "76800", "115200", "230400", "460800"
                  ].map((option, index) => (
                    <Option key={index} value={option}>
                      {option}
                    </Option>
                  ))
                }
              </Combobox>
            </div>
            <div>
              <span className={"mr-2"}>数据位</span>
              <Combobox disabled={disabled}
                        className={classes.combobox}
                        listbox={{ className: classes.combobox }}
                        value={config.communication.dataBits}
                        onOptionSelect={(_, { selectedOptions }) => {
                          handleConfigChange(selectedOptions[0], "dataBits", "communication");
                        }}>
                {["5", "6", "7", "8"].map((option, index) => (
                  <Option key={index} value={option}>
                    {option}
                  </Option>
                ))}
              </Combobox>
            </div>
            <div>
              <span className={"mr-2"}>停止位</span>
              <Combobox disabled={disabled}
                        className={classes.combobox}
                        listbox={{ className: classes.combobox }}
                        value={config.communication.stopBits}
                        onOptionSelect={(_, { selectedOptions }) => {
                          handleConfigChange(selectedOptions[0], "stopBits", "communication");
                        }}>
                {["1", "1.5", "2"].map((option, index) => (
                  <Option key={index} value={option}>
                    {option}
                  </Option>
                ))}
              </Combobox>
            </div>
            <div>
              <span className={"mr-2"}>校验位</span>
              <Combobox className={classes.combobox}
                        disabled={disabled}
                        listbox={{ className: classes.combobox }}
                        value={config.communication.parity}
                        onOptionSelect={(_, { selectedOptions }) => {
                          handleConfigChange(selectedOptions[0], "parity", "communication");
                        }}>
                {
                  ["无", "奇校验", "偶校验", "恒为0", "恒为1"].map((option, index) => (
                    <Option key={index} value={option}>
                      {option}
                    </Option>
                  ))
                }
              </Combobox>
            </div>
            <div>
              <span className={"mr-2"}>流控制</span>
              <Combobox className={classes.combobox}
                        disabled={disabled}
                        listbox={{ className: classes.combobox }}
                        value={config.communication.flowControl}
                        onOptionSelect={(_, { selectedOptions }) => {
                          handleConfigChange(selectedOptions[0], "flowControl", "communication");
                        }}>
                {
                  ["无", "软件", "硬件"].map((option, index) => (
                    <Option key={index} value={option}>
                      {option}
                    </Option>
                  ))
                }
              </Combobox>
            </div>
          </div>
        </div>
        <div>
          <div>折线图设置</div>
          <div style={{ marginLeft: "1em" }} className={"flex flex-col gap-1"}>
            <div>
              每次显示间隔
              <Input size={"small"} style={{ width: 50 }}
                     disabled={disabled}
                     value={config.graph.showInterval}
                     onChange={(e, data) => {
                       handleConfigChange(data.value, "showInterval", "graph");
                     }} />
              毫秒
            </div>
            <div>
              <Checkbox disabled={disabled}
                        label={(
                          <div>
                            仅显示最后
                            <Input size={"small"} style={{ width: 50 }}
                                   value={config.graph.showLastNColumns.n}
                                   disabled={!config.graph.showLastNColumns.enable || disabled}
                                   onChange={(e, data) => {
                                     const showLastNColumns = {
                                       ...config.graph.showLastNColumns,
                                       n: data.value
                                     };
                                     handleConfigChange(showLastNColumns, "showLastNColumns", "graph");
                                   }} />
                            列数据
                          </div>)}
                        checked={config.graph.showLastNColumns.enable}
                        onChange={(e, data) => {
                          const showLastNColumns = {
                            ...config.graph.showLastNColumns,
                            enable: data.checked
                          };
                          handleConfigChange(showLastNColumns, "showLastNColumns", "graph");
                        }} />
            </div>
          </div>
        </div>
        <div>
          <div>接收区设置</div>
          <div style={{ marginLeft: "1em" }} className={"flex flex-col gap-1"}>
            <div>
              <span className={"mr-2"}>显示方式</span>
              <Combobox className={classes.combobox}
                        disabled={disabled}
                        listbox={{ className: classes.combobox }}
                        value={config.receive.display}
                        onOptionSelect={(_, { selectedOptions }) => {
                          handleConfigChange(selectedOptions[0], "display", "receive");
                        }}>
                {
                  ["十进制", "十六进制", "ASCII"].map((option, index) => (
                    <Option key={index} value={option}>
                      {option}
                    </Option>
                  ))
                }
              </Combobox>
            </div>
            <div>
              <Checkbox label={"将接收到的数据存储于Excel文件"}
                        disabled={disabled}
                        checked={config.receive.saveAsFile.enable}
                        onChange={(e, data) => {
                          const saveAsFile = {
                            ...config.receive.saveAsFile,
                            enable: data.checked
                          };
                          handleConfigChange(saveAsFile, "saveAsFile", "receive");
                        }} />
            </div>
            <div style={{ marginLeft: "2em" }}>
              <div>
                <div>
                  每隔
                  <Input size={"small"} style={{ width: 50 }}
                         disabled={!config.receive.saveAsFile.enable || disabled}
                         value={config.receive.saveAsFile.lines}
                         onChange={(e, data) => {
                           const saveAsFile = {
                             ...config.receive.saveAsFile,
                             lines: data.value
                           };
                           handleConfigChange(saveAsFile, "saveAsFile", "receive");
                         }} />
                  行存储一次
                </div>
              </div>
              <div>
                <Checkbox label={"存储完成后自动关闭串口"}
                          disabled={disabled}
                          checked={config.receive.stopAfterSave.enable}
                          onChange={(e, data) => {
                            const stopAfterSave = {
                              ...config.receive.saveAsFile,
                              enable: data.checked
                            };
                            handleConfigChange(stopAfterSave, "stopAfterSave", "receive");
                          }} />
              </div>
              <div>
                <div>
                  文件夹位置
                </div>
                <Input value={config.receive.saveAsFile.folder}
                       disabled={!config.receive.saveAsFile.enable || disabled}
                       contentAfter={
                         <Button icon={<Folder16Regular />}
                                 appearance={"transparent"}
                                 disabled={!config.receive.saveAsFile.enable}
                                 onClick={selectFolder} />
                       }
                       style={{ width: 200 }}
                       onChange={(e, data) => {
                         const saveAsFile = {
                           ...config.receive.saveAsFile,
                           folder: data.value
                         };
                         handleConfigChange(saveAsFile, "saveAsFile", "receive");
                       }} />
              </div>
              <div>
                <div>文件名格式</div>
                <Input style={{ width: 200 }}
                       disabled={!config.receive.saveAsFile.enable || disabled}
                       value={config.receive.saveAsFile.filename}
                       contentAfter={
                         <Popover openOnHover
                                  mouseLeaveDelay={200}>
                           <PopoverTrigger disabledButtonEnhancement>
                             <Button icon={<QuestionCircle16Regular />}
                                     appearance={"transparent"}
                                     disabled={!config.receive.saveAsFile.enable}></Button>
                           </PopoverTrigger>
                           <PopoverSurface>
                             <div>
                               <div className={"text-center"}>文件名支持以下占位符</div>
                               <div className={"flex flex-row justify-center"}>
                                 <div>
                                   <div>%Y</div>
                                   <div>%m</div>
                                   <div>%d</div>
                                   <div>%H</div>
                                   <div>%M</div>
                                   <div>%S</div>
                                   <div>%l</div>
                                   <div>%n</div>
                                 </div>
                                 <div className={"text-right"}>
                                   <div>年</div>
                                   <div>月</div>
                                   <div>日</div>
                                   <div>时</div>
                                   <div>分</div>
                                   <div>秒</div>
                                   <div>文件行数</div>
                                   <div>本次通信中保存的第n个数据文件</div>
                                 </div>
                               </div>
                             </div>
                           </PopoverSurface>
                         </Popover>
                       }
                       onChange={(e, data) => {
                         const saveAsFile = {
                           ...config.receive.saveAsFile,
                           filename: data.value
                         };
                         handleConfigChange(saveAsFile, "saveAsFile", "receive");
                       }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default PortConfigPanel;
