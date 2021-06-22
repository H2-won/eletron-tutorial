// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
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
