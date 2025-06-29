import { app, shell, BrowserWindow, ipcMain, dialog } from "electron";
import path, { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

import os from "os";
import fs from "fs";
import Port from "./port";
import xlsx from "node-xlsx";

const SerialPort = require("serialport");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 750,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: false,
      nodeIntegration: true
    }
    // alwaysOnTop: true
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  ipcMain.on("select-folder", (event) => {
    dialog.showOpenDialog({
      properties: ["openDirectory"]
    }).then(result => {
      event.sender.send("folder-selected", result.filePaths[0]);
    });
  });

  process.on("uncaughtException", e => {
    console.log(e);
  });

  let port = null;
  let index = 0;
  ipcMain.on("open-port", (event, openConfig) => {
    port = new Port();
    index = 0;
    const onData = (data) => {
      BrowserWindow.getAllWindows()[0].webContents.send("port-data", { data, index });
      index++;
    };
    const onOpen = () => {
      event.sender.send("open-port-success");
    };
    const onError = (err) => {
      console.log(err);
      event.sender.send("open-port-failed", err);
    };
    port.open(openConfig, { onData, onOpen, onError });
  });
  ipcMain.on("close-port", (event) => {
    port.close((err) => {
      if (err) {
        console.log(err);
        event.sender.send("close-port-failed", err);
      } else {
        event.sender.send("close-port-success");
        port = null;
      }
    });
  });
  ipcMain.on("get-available-ports", (event) => {
    SerialPort.list().then((ports) => {
      event.sender.send("available-ports", ports.map((port) => port.path));
    });
  });
  ipcMain.on("get-homedir", (event) => {
    event.sender.send("homedir", os.homedir());
  });

  ipcMain.on("save-file", async (event, { folder, filename, data }) => {
    try {
      // 生成excel 列名：Index AI0 AI1 ... AI23
      // data: [[AI0, AI1, ... AI23], [AI0, AI1, ... AI23], ...]
      let excelData = [["Index", ...Array.from({ length: 24 }, (v, i) => `AI${i}`)]];
      excelData.push(...data.map((item, index) => [index, ...item]));
      const buffer = xlsx.build([{ name: "sheet1", data: excelData }]);

      // 写入文件;
      if (!fs.existsSync(folder)) {
        await fs.promises.mkdir(folder, { recursive: true });
      }
      await fs.promises.writeFile(path.join(folder, filename), buffer);
    } catch (e) {
      console.log(e);
      event.sender.send("save-file-failed", e);
      return;
    }
    event.sender.send("save-file-success");
  });

  ipcMain.on("save-config", (event, config) => {
    fs.writeFileSync(path.join(os.homedir(), "enose-config.json"), JSON.stringify(config));
  });

  ipcMain.on("get-config", (event) => {
    try {
      const config = JSON.parse(fs.readFileSync(path.join(os.homedir(), "enose-config.json"), "utf-8"));
      event.sender.send("config", config);
    } catch (e) {
      console.log(e);
      event.sender.send("config", null);
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
