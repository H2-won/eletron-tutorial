// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, Menu } = require("electron");
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
  mainWindow.setOverlayIcon("./huiIcon.png", "Description for overlay");

  // close 버튼 누를 시, 종료하지말고 hide
  mainWindow.on("close", function (e) {
    e.preventDefault();
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
app.whenReady().then(() => {
  loadMainProcessFiles();
  createTrayIcon();
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 트레이 아이콘
function createTrayIcon() {
  tray = new Tray("./huiIcon.png"); // 현재 애플리케이션 디렉터리를 기준으로 하려면 `__dirname + '/images/tray.png'` 형식으로 입력해야 합니다.
  const contextMenu = Menu.buildFromTemplate([
    { label: "Item1", type: "radio" },
    { label: "Item2", type: "radio" },
    { label: "Item3", type: "radio", checked: true },
    { label: "Item4", type: "radio" },
  ]);
  tray.setToolTip("이것은 나의 애플리케이션 입니다!");
  tray.setContextMenu(contextMenu);
  tray.on("double-click", () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
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
