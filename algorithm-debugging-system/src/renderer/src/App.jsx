import child_process from "child_process";
import { useEffect, useRef, useState } from "react";
import { Button, Input, Label, Spinner, Toast, ToastBody, Toaster, ToastTitle, useId, useToastController } from "@fluentui/react-components";
import { algorithm } from "./assets/algorithm.json";
import fs from "fs";
import electron from "electron";

function App() {
  const uploadFileRef = useRef(null);
  const filePath = useRef("");
  const currentPath = useRef("");
  const algorithmNames = ["LGBM_feature_extract", "xgboost_feature_extract", "forest_sorted", "dwt"];
  const toasterId = useId("toaster");
  const { dispatchToast, dismissAllToasts } = useToastController(toasterId);
  const notify = (title, body, type) =>
    dispatchToast(
      <Toast>
        {
          type === "progress" ?
            <ToastTitle media={<Spinner size="tiny" />}>{title}</ToastTitle> :
            <ToastTitle>{title}</ToastTitle>
        }
        <ToastBody>{body}</ToastBody>
      </Toast>,
      { intent: type, timeout: type === "progress" ? 5000000 : 3000 }
    );

  function uploadFile(file) {
    filePath.current = file.path;
    notify("上传文件成功", `文件名：${file.path}`, "success");
  }

  function onuploadFileChange(event) {
    const file = event.target.files[0];
    uploadFile(file);
  }

  function drop(e) {
    const file = e.dataTransfer.files[0];
    uploadFile(file);
  }

  const [pythonPath, setPythonPath] = useState("");
  const pythonId = useId("python");

  function callAlgorithm(algorithmName, filePath) {
    const flush = "import sys\nsys.stdout.flush()\nsys.stderr.flush()\n";
    const shell = `${pythonPath} -c "${algorithm}\ntry:\n  ${algorithmName}('${filePath}')\nfinally:\n  ${flush}"`;
    if (!fs.existsSync("./result")) {
      fs.mkdirSync("./result");
    }
    notify("算法调用中", "", "progress");
    child_process.exec(shell, (err, stdout, stderr) => {
      dismissAllToasts();
      if (err) {
        console.log(stderr);
        notify("算法调用失败", stderr, "error");
      } else {
        console.log(stdout);
        // electron.shell.openPath(`./result/${algorithmName}.png`);
        notify("算法调用成功", "", "success");
        electron.shell.openPath(`${currentPath.current}/result/${algorithmName}.png`);
      }
      to;
    });
  }

  function getCurrentPath() {
    const shell = `
import os
currentpath = os.getcwd()
print(currentpath)`;
    child_process.exec(`python -c "${shell}"`, (err, stdout, stderr) => {
      if (err) {
        console.log(stderr);
      }
      if (stdout) {
        currentPath.current = stdout.replaceAll("\n", "");
      }
    });
  }

  function getPythonPath() {
    const shell = `
import sys
pythonpath = sys.executable
print(pythonpath)`;
    child_process.exec(`python -c "${shell}"`, (err, stdout, stderr) => {
      if (err) {
        console.log(stderr);
      }
      if (stdout) {
        setPythonPath(stdout.replaceAll("\n", ""));
      }
    });
  }

  useEffect(() => {
    getPythonPath();
    getCurrentPath();
  }, []);


  return (
    <>
      <Toaster toasterId={toasterId} position={"top-end"} />
      <div className={"h-screen flex flex-col"}>
        <div className={"text-center flex flex-col justify-center"} style={{ fontSize: 20, height: 100 }}>
          电子鼻算法调试系统<br />
          V1.0
        </div>
        <div className={"flex-1 grid grid-cols-2 grid-rows-1 p-5"}>
          <div className={"h-full"}>
            <div className={"h-full flex flex-col justify-center"}>
              <div style={{
                width: 200, height: 200,
                margin: "auto",
                borderRadius: "0.5rem",
                outlineStyle: "dashed"
              }}
                   className={"text-center flex flex-col justify-center"}
                   onDrop={e => {
                     e.preventDefault();
                     drop(e);
                   }}
                   onDragLeave={e => e.preventDefault()}
                   onDragEnter={e => e.preventDefault()}
                   onDragOver={e => e.preventDefault()}>
                <div>
                  <Button appearance={"subtle"} onClick={() => uploadFileRef.current.click()}>
                    上传实验数据
                  </Button>
                </div>
                <input ref={uploadFileRef}
                       type={"file"}
                       className={"hidden"}
                       accept={"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
                       onChange={onuploadFileChange}
                />
              </div>
            </div>
          </div>
          <div className={"h-full flex flex-col"}>
            <div style={{ flex: 1 }} className={"flex flex-col justify-center"}>
              <Label htmlFor={pythonId}>
                Python可执行文件路径
              </Label>
              <Input className={"mb-5"}
                     id={pythonId} value={pythonPath}
                     onChange={(_, data) => setPythonPath(data.value)} />
              <div className={"grid grid-cols-2 grid-rows-3 gap-x-2 gap-y-3"}>
                {
                  algorithmNames.map((name, index) => {
                      return (
                        <Button key={index} appearance={"primary"}
                                onClick={() => {
                                  if (!filePath.current) {
                                    notify("请先上传实验数据", "", "error");
                                    return;
                                  }
                                  callAlgorithm(name, filePath.current);
                                }}>
                          {name}
                        </Button>
                      );
                    }
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
