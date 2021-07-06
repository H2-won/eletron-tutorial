const { ipcMain, dialog } = require("electron");

ipcMain.on("open-file-dialog", async (event) => {
  filepaths = await dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"],
  });
  event.sender.send("selected-directory", filepaths);
});

ipcMain.on("open-error-dialog", (e) => {
  dialog.showErrorBox(
    "Error Dialog Test",
    "This is error dialog test in Electron"
  );
});

ipcMain.on("open-information-dialog", async (event) => {
  const options = {
    type: "info",
    title: "Information",
    message: "This is an information dialog. Isn't it nice?",
    buttons: ["Yes", "No"],
  };
  // showMessageBox 리턴값 = 누른 버튼의 index값
  result = await dialog.showMessageBox(options);
  event.sender.send("information-dialog-selection", result.response);
});
