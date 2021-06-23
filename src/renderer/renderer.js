// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { ipcRenderer } = require("electron");
const path = require("path");

// Tell main process to show the menu when demo button is clicked

// context Menu
const contextMenuBtn = document.querySelector("#communicationBtn");
contextMenuBtn.addEventListener("click", () => {
  ipcRenderer.send("show-context-menu");
});

// file drag and drop
const holder = document.getElementById("holder");
holder.ondragover = () => {
  return false;
};
holder.ondragleave = holder.ondragend = () => {
  return false;
};
holder.ondrop = (e) => {
  e.preventDefault();
  for (let f of e.dataTransfer.files) {
    console.log("File(s) you dragged here: ", f.path);
  }
  return false;
};

// notification (알림)
// let myNotification = new Notification("Title", {
//   body: "Lorem Ipsum Dolor Sit Amet",
// });

// myNotification.onclick = () => {
//   console.log("Notification clicked");
// };

// notification (아이콘 있는 알림)
const notification = {
  title: "Boba Electron Tutorial!",
  body: "for HP Project",
  icon: path.join(__dirname, "./huiIcon.png"),
};

const notificationButton = document.getElementById("notificationBtn");

notificationButton.addEventListener("click", () => {
  const myNotification = new window.Notification(
    notification.title,
    notification
  );

  myNotification.onclick = () => {
    console.log("Notification clicked");
  };
});

// file select dialog
const selectDirBtn = document.getElementById("fileDialog");

selectDirBtn.addEventListener("click", (event) => {
  ipcRenderer.send("open-file-dialog");
});

ipcRenderer.on("selected-directory", (event, path) => {
  console.log(path);
  document.getElementById("selectedFile").innerHTML = `You selected: ${path}`;
});

const errorBtn = document.getElementById("errorDialog");

errorBtn.addEventListener("click", (event) => {
  ipcRenderer.send("open-error-dialog");
});

const informationBtn = document.getElementById("infoDialog");

informationBtn.addEventListener("click", (event) => {
  ipcRenderer.send("open-information-dialog");
});

ipcRenderer.on("information-dialog-selection", (event, index) => {
  const infoSpan = document.getElementById("info-selection");
  console.log("ipc is comming", index);
  let message = "You selected ";
  if (index === 0) message += "yes.";
  else message += "no.";
  infoSpan.innerHTML = message;
});

const asyncMsgBtn = document.getElementById("asyncBtn");

asyncMsgBtn.addEventListener("click", () => {
  ipcRenderer.send("asynchronous-message", "ping");
});

ipcRenderer.on("asynchronous-reply", (event, arg) => {
  const message = `Asynchronous message reply: ${arg}`;
  document.getElementById("asyncMsg").innerHTML = message;
});

const openFileBtn = document.querySelector("#openFileBtn");

openFileBtn.addEventListener("click", () => {
  ipcRenderer.send("openFile");
});

ipcRenderer.on("fileData", (event, data) => {
  console.log(data);
  document.querySelector("#fileText").innerHTML = data;
  document.write(data);
});
