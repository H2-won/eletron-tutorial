// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, Menu } = require("electron");
// import path from "path";
const path = require("path");
const glob = require("glob");

let tray = null;
let mainWindow = null;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
    // 상단 메뉴바 숨기기, Alt 누르면 나타남
    autoHideMenuBar: true,
    // 작업표시줄에 아이콘 안뜨게
    skipTaskbar: false,
  });
  // and load the index.html of the app.
  mainWindow.loadFile("index.html");
  // 작업표시줄 아이콘에 작은 이미지 띄워줄때 (디스코드 빨간불 느낌인듯)
  // mainWindow.setOverlayIcon("./huiIcon.png", "Description for overlay");

  // 윈도우 말고 다른 곳을 클릭 시 (포커스에서 벗어날 시 blur 이벤트 발동)
  // mainWindow.on("blur", () => {
  //   mainWindow.hide();
  // });
  mainWindow.on("close", function (e) {
    // 앱 종료 방지
    e.preventDefault();
    // 앱 숨김
    mainWindow.hide();
  });
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Create background window.
  backgroundWindow = new BrowserWindow({
    show: false,
    webPreferences: { nodeIntegration: true },
  });
  backgroundWindow.loadFile("background.html");

  // Modal window 부모 윈도우 비활성화하면서 모달 띄움
  // let child = new BrowserWindow({
  //   parent: mainWindow,
  //   modal: true,
  //   show: false,
  // });
  // child.loadURL("https://resemble.ga");
  // child.once("ready-to-show", () => {
  //   child.show();
  // });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      console.log(BrowserWindow.getAllWindows().length);
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // Create mainWindow, load the rest of the app, etc...
  app.whenReady().then(() => {
    loadMainProcessFiles();
    createTrayIcon();
    createWindow();
  });
}

// app.whenReady().then(() => {
//   loadMainProcessFiles();
//   createTrayIcon();
//   createWindow();
//   // console.log(BrowserWindow.getAllWindows().length);
//   // if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   // else mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();

//   app.on("activate", function () {
//     // On macOS it's common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     console.log(BrowserWindow.getAllWindows().length);
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//     // mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
//   });
// });

app.on("activate", (e) => {
  e.preventDefault();
  mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
});

// 트레이 아이콘
function createTrayIcon() {
  const iconPath = path.join(__dirname, `/huiIcon.png`);
  tray = new Tray(iconPath); // 현재 애플리케이션 디렉터리를 기준으로 하려면 `__dirname + '/images/tray.png'` 형식으로 입력해야 합니다.
  const contextMenu = Menu.buildFromTemplate([
    { label: "Item1", type: "radio" },
    { label: "Item2", type: "radio" },
    { label: "Item3", type: "radio", checked: true },
    { label: "Item4", type: "radio" },
    {
      label: "종료",
      type: "normal",
      click() {
        app.exit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip("이것은 나의 애플리케이션 입니다!");
  tray.on("double-click", () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
  // tray.on("click", () => {
  //   mainWindow.show();
  // });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Require each JS file in the main-process dir
function loadMainProcessFiles() {
  const files = glob.sync(path.join(__dirname, "/src/main/*.js"));
  files.forEach((file) => {
    require(file);
  });
}
