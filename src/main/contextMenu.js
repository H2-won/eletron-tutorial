const { app, ipcMain, Menu, MenuItem, BrowserWindow } = require("electron");

const menu = new Menu();
menu.append(new MenuItem({ label: "Hello" }));
menu.append(new MenuItem({ type: "separator" }));
menu.append(
  new MenuItem({ label: "Electron", type: "checkbox", checked: true })
);

app.on("browser-window-created", (event, win) => {
  win.webContents.on("context-menu", (e, params) => {
    menu.popup(win, params.x, params.y);
  });
});

ipcMain.on("show-context-menu", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  menu.popup(win);
});

// ping pong test
ipcMain.on("asynchronous-message", (event, arg) => {
  event.sender.send("asynchronous-reply", "pong");
});
