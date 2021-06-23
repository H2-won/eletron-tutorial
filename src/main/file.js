const { ipcMain, dialog } = require("electron");
const fs = require("fs");

ipcMain.on("openFile", (event, path) => {
  dialog.showOpenDialog((fileNames) => {
    // fileNames is an array that contains all the selected
    if (fileNames === undefined) {
      console.log("No file selected");
    } else {
      readFile(fileNames[0]);
    }
  });

  function readFile(filepath) {
    fs.readFile(filepath, "utf-8", (err, data) => {
      if (err) {
        alert("An error ocurred reading the file :" + err.message);
        return;
      }
      console.log(data);
      event.sender.send("fileData", data);
    });
  }
});
