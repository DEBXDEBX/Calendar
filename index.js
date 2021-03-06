const electron = require("electron");
let fs = require("fs");
//start the app
const { app, BrowserWindow, Menu, ipcMain, dialog } = electron;
console.log(
  "starting: all console.log() go in terminal for the chrome side. index.js"
);

// you have to do this declaraiton for scoping issues
let mainWindow;
let addWindow;
let helpWindow;
// watch the app object and wait for a ready event
app.on("ready", () => {
  // function to run when the app is ready
  // create browser window
  // webPreferences: true sets up the require in the script js file electron version 5.0.0 and above
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // instruct main window to load html file, from the file system not http:
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.maximize();
  // mainWindow.setFullScreen(true);
  // quit app and close addWindow if main window is closed
  mainWindow.on("closed", () => app.quit());
  // attach menu
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

//When you click on create year
function createYear() {
  addWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: "Create New Year",
    parent: mainWindow,
    modal: true,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  addWindow.setMenu(null);
  addWindow.loadURL(`file://${__dirname}/add.html`);
  // the following is for garbage collection
  addWindow.on("closed", () => {
    addWindow = null;
  });
}

// this listens for the add window
ipcMain.on("year:add", (event, name) => {
  // close the addWindow
  addWindow.close();
  // Set fileName to name
  // filter for .deb extensions
  let myOptions = {
    defaultPath: name,
    filters: [{ name: "Custom File Type", extensions: ["deb"] }],
  };
  // open save dialog to create a fileNamePath
  dialog.showSaveDialog(null, myOptions, (fileNamePath) => {
    // send all info in an object to script.js
    mainWindow.webContents.send("year:add", { fileNamePath, name });
  });
}); // End ipcMain.on("fileCab:add"

// this listens for the addWindow cancel btn
ipcMain.on("addForm:cancel", (event) => {
  addWindow.close();
}); // End ipcMain.on("addForm:cancel"

//When you click on help
function loadHelp() {
  helpWindow = new BrowserWindow({
    width: 800,
    height: 800,
    title: "Help",
  });
  helpWindow.setMenu(null);
  helpWindow.loadURL(`file://${__dirname}/help.html`);
  helpWindow.maximize();
  // the following is for garbage collection
  helpWindow.on("closed", () => {
    helpWindow = null;
  });
}

//When You click on load year
function loadYear() {
  console.log("Start loading year....");
  // this is for extsions
  let myOptions = {
    filters: [{ name: "Custom File Type", extensions: ["deb"] }],
    properties: ["openFile", "multiSelections"],
  };
  dialog.showOpenDialog(null, myOptions, (fileNames) => {
    if (fileNames === undefined) {
      let message = "No file selected!";
      let msgType = "error";
      mainWindow.webContents.send("Display:showAlert", { message, msgType });
    } else {
      // readFileContents(fileNames[0]);
      fileNames.forEach((file) => readFileContents(file));
    }
  });

  function readFileContents(filepath) {
    if (!filepath) {
      let message = "No file selected!";
      let msgType = "error";
      mainWindow.webContents.send("Display:showAlert", { message, msgType });
      return;
    }

    fs.readFile(filepath, "utf-8", (err, data) => {
      if (err) {
        let message = "An error occured reading the file!";
        let msgType = "error";
        mainWindow.webContents.send("Display:showAlert", { message, msgType });
        return;
      } else {
        try {
          data = JSON.parse(data);
        } catch {
          let message = "Can not parse data!";
          let msgType = "error";
          mainWindow.webContents.send("Display:showAlert", {
            message,
            msgType,
          });
          return;
        }

        if (data) {
          if (data.fileType === "ElectronCalender2019September") {
            // set filepath: This is in case you moved your file
            data.fileNamePath = filepath;
            // laod file cab
            // data is an object to be converted to an file cab object
            mainWindow.webContents.send("yearObj:load", data);
          } else {
            let message =
              "This is not a valid ElectronCalender2019September file!";
            let msgType = "error";
            mainWindow.webContents.send("Display:showAlert", {
              message,
              msgType,
            });
          }
        }
      }
    });
  }
} // End readFileContents(filepath)

function showSettingsForm() {
  mainWindow.webContents.send("SettingsForm:show");
} // End showSettingsForm()

function setDeleteModeFalse() {
  let deleteMode = false;
  mainWindow.webContents.send("deleteMode:set", deleteMode);
} // End setDeleteModeFalse()

function setDeleteModeTrue() {
  let deleteMode = true;
  mainWindow.webContents.send("deleteMode:set", deleteMode);
} // End setDeleteModeTrue()

function setThemeLight() {
  let myThemeString = "Light";
  mainWindow.webContents.send("Theme:set", myThemeString);
} // End setThemeLight()

function setThemeDark() {
  let myThemeString = "Dark";
  mainWindow.webContents.send("Theme:set", myThemeString);
} // End setThemeDark()

function setFontSize(fontSize) {
  mainWindow.webContents.send("FontSize:change", fontSize);
} // End setFontSize(fontSize)

// Top Menu
const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Create New Year",
        accelerator: process.platform === "darwin" ? "Command+N" : "Ctrl+N",
        click() {
          createYear();
        },
      },
      {
        label: "Load Year",
        accelerator: process.platform === "darwin" ? "Command+O" : "Ctrl+O",
        click() {
          loadYear();
        },
      },

      {
        label: "Quit",
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
  {
    label: "Mode",
    submenu: [
      {
        label: "Read and Write",
        accelerator: process.platform === "darwin" ? "Command+L" : "Ctrl+L",
        click() {
          setDeleteModeFalse();
        },
      },
      {
        label: "Edit and Delete",
        accelerator: process.platform === "darwin" ? "Command+D" : "Ctrl+D",
        click() {
          setDeleteModeTrue();
        },
      },
    ],
  },
  {
    label: "Settings",
    submenu: [
      {
        label: "Font-size: x-small",
        accelerator: process.platform === "darwin" ? "Command+1" : "Ctrl+1",
        click() {
          setFontSize("x-small");
        },
      },
      {
        label: "Font-size: small",
        accelerator: process.platform === "darwin" ? "Command+2" : "Ctrl+2",
        click() {
          setFontSize("small");
        },
      },
      {
        label: "Font-size: normal",
        accelerator: process.platform === "darwin" ? "Command+3" : "Ctrl+3",
        click() {
          setFontSize("normal");
        },
      },
      {
        label: "Font-size: large",
        accelerator: process.platform === "darwin" ? "Command+4" : "Ctrl+4",
        click() {
          setFontSize("large");
        },
      },
      {
        label: "Font-size: x-large",
        accelerator: process.platform === "darwin" ? "Command+5" : "Ctrl+5",
        click() {
          setFontSize("x-large");
        },
      },
      {
        label: "Light Theme",
        accelerator: process.platform === "darwin" ? "Command+L" : "Ctrl+6",
        click() {
          setThemeLight();
        },
      },
      {
        label: "Dark Theme",
        accelerator: process.platform === "darwin" ? "Command+D" : "Ctrl+7",
        click() {
          setThemeDark();
        },
      },
      {
        label: "Start Up Settings Form",
        accelerator: process.platform === "darwin" ? "Command+L" : "Ctrl+S",
        click() {
          showSettingsForm();
        },
      },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "Help",
        accelerator: process.platform === "darwin" ? "Command+D" : "Ctrl+h",
        click() {
          loadHelp();
        },
      },
    ],
  },
]; // End menuTemplate

//Check for mac os
if (process.platform === "darwin") {
  //add empty object to the front of the array
  menuTemplate.unshift({});
}

//check for NODE_ENV => prodution, development, staging, test
//This does not work comment it out before you build

//DEVELOPER TOOLS
// if (process.env.NODE_ENV !== "production") {
//   // add object to end of array menu
//   menuTemplate.push({
//     label: "View",
//     submenu: [
//       //predefined role
//       { role: "reload" },
//       {
//         label: "Toggle Developer Tools",
//         accelerator:
//           process.platform === "darwin" ? "Command+Alt+I" : "Ctrl+Shift+I",
//         click(item, focusedWindow) {
//           focusedWindow.toggleDevTools();
//         },
//       },
//     ],
//   });
// }
