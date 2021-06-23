const { ipcMain, dialog } = require("electron");

ipcMain.on("open-file-dialog", (event) => {
  dialog.showOpenDialog(
    {
      properties: ["openFile", "multiSelections"],
    },
    (files) => {
      if (files) {
        event.sender.send("selected-directory", files);
      }
    }
  );
});

ipcMain.on("open-error-dialog", (e) => {
  dialog.showErrorBox(
    "Error Dialog Test",
    "This is error dialog test in Electron"
  );
});

ipcMain.on("open-information-dialog", (event) => {
  const options = {
    type: "info",
    title: "Information",
    message: "This is an information dialog. Isn't it nice?",
    buttons: ["Yes", "No"],
  };
  dialog.showMessageBox(options, (index) => {
    event.sender.send("information-dialog-selection", index);
  });
});
