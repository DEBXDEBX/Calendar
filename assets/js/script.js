"use strict";
// Used to access file system
let app = require("electron").remote;
let { dialog } = app;
let fs = require("fs");

const electron = require("electron");
const { ipcRenderer } = electron;

//Select audio files
const addAudio = document.querySelector("#addAudio");
const addImageAudio = document.querySelector("#addImageAudio");
const deleteAudio = document.querySelector("#deleteAudio");
const warningEmptyAudio = document.querySelector("#warningEmptyAudio");
const warningSelectAudio = document.querySelector("#warningSelectAudio");
const warningNameTakenAudio = document.querySelector("#warningNameTakenAudio");
const tabAudio = document.querySelector("#tabAudio");
const btnAudio = document.querySelector("#btnAudio");
const cancelAudio = document.querySelector("#cancelAudio");
const clickAudio = document.querySelector("#clickAudio");
// Global variable's
// This is the Main array that holds all the year objects
const arrayOfYearObjs = [];
// create elements object
const el = new Elements();
// create display object
const display = new Display(el, $);
//Theme current
let currentTheme = "Dark";
//Delete Mode
let deleteMode = false;
// create year index
let yearIndex = -243;
// create month index
let monthIndex = -243;
// current note Index
let nI = -243;
// this is for the fontSize

// temp hold for array
let settingsArrayContainer;
// The start of program exicution.
window.onload = function () {
  startUp();
};

//startUp
function startUp() {
  //get data from settings obect
  let settingsStorage = new SettingsStorage();
  let settings = settingsStorage.getSettingsFromFile();

  if (settings.type === "calender") {
    // set the holding array
    settingsArrayContainer = settings.filePathArray;
    // loadsettings
    applySettings(settings);
    // update Form
    display.showAutoLoadList(settingsArrayContainer);

    if (el.autoLoadCheckBox.checked) {
      if (settings.filePathArray) {
        autoLoadYearObjects(settings.filePathArray);
      }
    }
  }
}
//*************************************************** */
// Helper functions
//*************************************************** */
//************************************************** */
function renderYearTabs() {
  display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
}
//************************************************** */
function renderMonthTabs() {
  display.paintMonthTabs(
    mapOutKey("name", arrayOfYearObjs[yearIndex].arrayOfMonthObjects)
  );
}
//************************************************** */
function renderNotes() {
  if (arrayOfYearObjs[yearIndex].arrayOfMonthObjects[monthIndex].arrayOfNotes) {
    display.paintNotes(
      deleteMode,
      arrayOfYearObjs[yearIndex].arrayOfMonthObjects[monthIndex].arrayOfNotes
    );
  } else {
    console.log("no notes to display!");
  }
}
//***************************************************** */
function removeActiveClass(element) {
  if (element) {
    element.classList.remove("active");
  }
}
//**************************************************** */
function pushFileSettingsContainer(filePath) {
  // check if the fileNamePath already exists if it does alert and return
  // make a variable to check
  let isTaken = false;

  for (const element of settingsArrayContainer) {
    if (element === filePath) {
      isTaken = true;
    }
  }

  if (isTaken) {
    warningNameTakenAudio.play();
    display.showAlert("That file is already loaded!", "error");
    return;
  }

  // add it too tempHOld
  settingsArrayContainer.push(filePath);
}
//***************************************************** */
function sortArrayByName(array) {
  array.sort(function (a, b) {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }); //End sort function
}
//*************************************************** */
function getRadioValue(form, name) {
  let val;
  // get list of radio buttons with specified name
  const radios = form.elements[name];
  // loop through list of radio buttons
  for (let i = 0, len = radios.length; i < len; i++) {
    if (radios[i].checked) {
      // radio checked?
      val = radios[i].value; // if so, hold its value in val
      break; // and break out of for loop
    }
  }
  return val; // return value of checked radio or undefined if none checked
}
//****************************************************** */
function mapOutKey(key, array) {
  const newArray = array.map(function (item) {
    return item[key];
  });
  return newArray;
}
//
function autoLoadYearObjects(array) {
  for (const item of array) {
    readFileContents(item);
  }
}
//*************************************************** */
function readFileContents(filepath) {
  if (!filepath) {
    let message = "No file selected!";
    let msgType = "error";
    display.showAlert(message, msgType);
    return;
  }

  fs.readFile(filepath, "utf-8", (err, data) => {
    if (err) {
      let message = "An error occured reading the file!";
      let msgType = "error";
      display.showAlert(message, msgType);
      return;
    } else {
      try {
        data = JSON.parse(data);
      } catch {
        let message = "Can not parse data!";
        let msgType = "error";
        display.showAlert(message, msgType);
        return;
      }

      if (data) {
        if (data.fileType === "ElectronCalender2019September") {
          // set filepath: This is in case you moved your file
          data.fileNamePath = filepath;

          // check if the fileNamePath already exists if it does alert and return
          // make a variable to return
          let isTaken = false;

          for (const element of arrayOfYearObjs) {
            if (element.fileNamePath === data.fileNamePath) {
              isTaken = true;
            }
          }

          if (isTaken) {
            display.showAlert("That file is already loaded!", "error");
            renderYearTabs();
            return;
          }
          // create a yearObj object
          let newYearObject = new YearObject(
            data.name,
            data.fileNamePath,
            data.arrayOfMonthObjects
          );
          // push the file cab obj into the array of file cabinets
          arrayOfYearObjs.push(newYearObject);
          sortArrayByName(arrayOfYearObjs);
          // write the file cab object to disk
          newYearObject.writeYearToHardDisk(fs, display);
          renderYearTabs();
          return;
        } else {
          let message =
            "This is not a valid ElectronCalender2019September file!";
          let msgType = "error";
          display.showAlert(message, msgType);
        }
      }
    }
  });
}
//************************************************* */
function loadUpSettingsForm() {
  let settingsStorage = new SettingsStorage();
  let settings = settingsStorage.getSettingsFromFile();
  settingsArrayContainer = settings.filePathArray;

  if (settings.type === "calender") {
    // set check box
    if (settings.autoLoad) {
      // check the box
      el.autoLoadCheckBox.checked = true;
    } else {
      // uncheck the box
      el.autoLoadCheckBox.checked = false;
    }

    // check the right theme
    switch (settings.theme) {
      case "Dark":
        el.darkRadio.checked = true;
        break;
      case "Light":
        el.lightRadio.checked = true;
        break;
      default:
        console.log("No valid theme");
    }

    // check the right font size
    switch (settings.fontSize) {
      case "x-small":
        el.xSmallRadio.checked = true;
        break;
      case "small":
        el.smallRadio.checked = true;
        break;
      case "normal":
        el.normalRadio.checked = true;
        break;
      case "large":
        el.largeRadio.checked = true;
        break;
      case "x-large":
        el.xLargeRadio.checked = true;
        break;
      default:
        console.log("No valid font size");
    }
  }
  // update autoload form ul
  display.showAutoLoadList(settingsArrayContainer);
} // End loadUpSettingsForm()
//*********************************************** */
function applySettings(settings) {
  el.autoLoadCheckBox.checked = settings.autoLoad;

  switch (settings.fontSize) {
    case "x-small":
      el.root.style.fontSize = "10px";
      break;
    case "small":
      el.root.style.fontSize = "12px";
      break;
    case "normal":
      el.root.style.fontSize = "16px";
      break;
    case "large":
      el.root.style.fontSize = "20px";
      break;
    case "x-large":
      el.root.style.fontSize = "24px";
      break;
    default:
      console.log("No valid font-size!");
  }

  if (deleteMode) {
    // set the theme
    switch (settings.theme) {
      case "Dark":
        el.blankCssLink.href = "assets/css/dark.css";
        break;
      case "Light":
        el.blankCssLink.href = "assets/css/light.css";
        break;
      default:
        console.log("No valid option!");
      // code block
    }
  } else {
    // set the theme
    switch (settings.theme) {
      case "Dark":
        el.blankCssLink.href = "assets/css/dark.css";
        el.body.style.backgroundColor = "black";
        currentTheme = "Dark";
        break;
      case "Light":
        el.blankCssLink.href = "assets/css/light.css";
        el.body.style.backgroundColor = "white";
        currentTheme = "Light";
        break;
      default:
        console.log("No valid option!");
    }
  }
} // End
//**************************************************** */
function handleFilePath(imagePath) {
  if (!imagePath) {
    warningEmptyAudio.play();
    display.showAlert("Please enter a path in the name area!", "error");
    return;
  }
  // set image path
  arrayOfYearObjs[yearIndex].arrayOfMonthObjects[monthIndex].arrayOfNotes[
    nI
  ].imagePath = imagePath;
  // save year object
  arrayOfYearObjs[yearIndex].writeYearToHardDisk(fs, display);
  addImageAudio.play();
  display.showAlert("A new image was added to the note!", "success");
} // End handleFilePath(imagePath)
//
function addImage() {
  let imagePath;

  dialog.showOpenDialog((fileNames) => {
    if (!fileNames) {
      display.showAlert("No file selected!", "error");
    } else {
      // got file name
      imagePath = fileNames[0];
      handleFilePath(imagePath);
    }
  });
} // End addImage()
//************************************************ */
// IPC
//************************************************ */

// listen for index.js to set deletemode
ipcRenderer.on("deleteMode:set", (event, deleteModeBool) => {
  $("#myModal").modal("hide");
  // set the delete mode to true or false
  deleteMode = deleteModeBool;

  let paintNote = false;

  // check for notes
  let htmlNotes = document.querySelectorAll(".note");
  if (htmlNotes.length > 0) {
    paintNote = true;
  }

  if (deleteMode) {
    display.showAlert("Edit and Delete Mode!", "error");
    el.body.style.backgroundColor = "#d3369c";
    el.body.style.background = "linear-gradient(to right, #180808, #ff0000)";

    switch (currentTheme) {
      case "Dark":
        el.blankCssLink.href = "assets/css/dark.css";
        break;
      case "Light":
        el.blankCssLink.href = "assets/css/light.css";
        break;
      default:
        console.log("No Match");
    }
  } else {
    display.showAlert("Read and Write Mode!", "success");
    switch (currentTheme) {
      case "Dark":
        el.body.style.background = "none";
        el.body.style.backgroundColor = "black";
        el.blankCssLink.href = "assets/css/dark.css";
        break;
      case "Light":
        el.body.style.background = "none";
        el.body.style.backgroundColor = "white";
        el.blankCssLink.href = "assets/css/light.css";
        break;
      default:
        console.log("No Match");
    }
  }

  if (paintNote) {
    renderNotes();
  }
}); //End ipcRenderer.on("deleteMode:set"

//listen for index.js to set theme
ipcRenderer.on("Theme:set", (event, theme) => {
  $("#myModal").modal("hide");
  // set te current theme
  currentTheme = theme;
  // check if delete mode is on, if so return
  if (deleteMode) {
    switch (currentTheme) {
      case "Dark":
        el.blankCssLink.href = "assets/css/dark.css";
        break;
      case "Light":
        el.blankCssLink.href = "assets/css/light.css";
        break;
      default:
        console.log("No Match");
    }
    return;
  }
  switch (currentTheme) {
    case "Dark":
      el.blankCssLink.href = "assets/css/dark.css";
      el.body.style.backgroundColor = "black";
      deleteMode = false;
      break;
    case "Light":
      el.blankCssLink.href = "assets/css/light.css";
      el.body.style.backgroundColor = "white";
      deleteMode = false;
      break;
    default:
      console.log("No valid option!");
    // code block
  }
});
// End ipcRenderer.on("Theme:set"

// listen for index.js to show settings form
ipcRenderer.on("SettingsForm:show", (event) => {
  $("#myModal").modal("hide");
  loadUpSettingsForm();
  display.showSettingsForm();
});

// listen for inedex.js to send data
ipcRenderer.on("Display:showAlert", (event, dataObj) => {
  display.showAlert(dataObj.message, dataObj.msgType);
}); // End ipcRenderer.on("Display:showAlert"

// listen for inedex.js to send data
ipcRenderer.on("year:add", (event, dataObj) => {
  $("#myModal").modal("hide");
  if (!dataObj.fileNamePath) {
    display.showAlert("You did not enter a path!", "error");
    display.hideSettingsForm();
    renderYearTabs();
    return;
  }
  if (!dataObj.name) {
    display.showAlert("You did not enter a name for the Year!", "error");
    display.hideSettingsForm();
    renderYearTabs();
    return;
  }
  if (isNaN(Number(dataObj.name))) {
    display.showAlert("You did not enter a number for the Year!", "error");
    display.hideSettingsForm();
    renderYearTabs();
    return;
  }
  if (!dataObj.fileNamePath) {
    display.showAlert("You clicked cancel!", "error");
    display.hideSettingsForm();
    renderYearTabs();
    return;
  }
  // check if the fileNamePath already exists if it does alert and return
  // make a variable to return
  let isTaken = false;
  for (const element of arrayOfYearObjs) {
    if (element.fileNamePath === dataObj.fileNamePath) {
      isTaken = true;
    }
  }
  if (isTaken) {
    display.showAlert("That file is already loaded!", "error");
    display.hideSettingsForm();
    renderYearTabs();
    return;
  }
  // create a year object
  let newYear = new YearObject(dataObj.name, dataObj.fileNamePath);
  // create the 12 months
  let January = new MonthObject("January");
  newYear.arrayOfMonthObjects.push(January);
  let February = new MonthObject("February");
  newYear.arrayOfMonthObjects.push(February);
  let March = new MonthObject("March");
  newYear.arrayOfMonthObjects.push(March);
  let April = new MonthObject("April");
  newYear.arrayOfMonthObjects.push(April);
  let May = new MonthObject("May");
  newYear.arrayOfMonthObjects.push(May);
  let June = new MonthObject("June");
  newYear.arrayOfMonthObjects.push(June);
  let July = new MonthObject("July");
  newYear.arrayOfMonthObjects.push(July);
  let August = new MonthObject("August");
  newYear.arrayOfMonthObjects.push(August);
  let September = new MonthObject("September");
  newYear.arrayOfMonthObjects.push(September);
  let October = new MonthObject("October");
  newYear.arrayOfMonthObjects.push(October);
  let November = new MonthObject("November");
  newYear.arrayOfMonthObjects.push(November);
  let December = new MonthObject("December");
  newYear.arrayOfMonthObjects.push(December);
  // push the year obj into the array of year objects
  arrayOfYearObjs.push(newYear);
  sortArrayByName(arrayOfYearObjs);
  // write the year object to disk
  newYear.writeYearToHardDisk(fs, display);
  display.hideSettingsForm();
  renderYearTabs();
});
// End ipcRenderer.on("year:add"********************

// listen for index.js to change font size
ipcRenderer.on("FontSize:change", (event, fontSize) => {
  switch (fontSize) {
    case "x-small":
      el.root.style.fontSize = "10px";
      break;
    case "small":
      el.root.style.fontSize = "12px";
      break;
    case "normal":
      el.root.style.fontSize = "16px";
      break;
    case "large":
      el.root.style.fontSize = "20px";
      break;
    case "x-large":
      el.root.style.fontSize = "24px";
      break;
    default:
      console.log("No valid font-size!");
  }
}); // End ipcRenderer.on("FontSize:change"

// listen for inedex.js to send data
ipcRenderer.on("yearObj:load", (event, data) => {
  $("#myModal").modal("hide");
  // check if the fileNamePath already exists if it does alert and return
  // make a variable to return
  let isTaken = false;

  for (const element of arrayOfYearObjs) {
    if (element.fileNamePath === data.fileNamePath) {
      isTaken = true;
    }
  }
  if (isTaken) {
    display.showAlert("That file is already loaded!", "error");
    display.hideSettingsForm();
    renderYearTabs();
    return;
  }
  // create a year object
  let newYear = new YearObject(
    data.name,
    data.fileNamePath,
    data.arrayOfMonthObjects
  );
  // push the year obj into the array of year Objects
  arrayOfYearObjs.push(newYear);
  sortArrayByName(arrayOfYearObjs);
  // write the year object to disk
  newYear.writeYearToHardDisk(fs, display);
  display.hideSettingsForm();
  renderYearTabs();
  return;
});
//End ipcRenderer.on("year:load"*****************************
// ***********************************************************

// *************************************************************
//  End IPC Code
// *************************************************************
// *************************************************************
//  Year Code
// *************************************************************

el.yearList.addEventListener("click", (e) => {
  // event delegation
  if (e.target.classList.contains("year")) {
    //The Next code is to set the current tab color white with the active class
    const element = document.querySelector(".year.active");
    removeActiveClass(element);

    // add active class
    e.target.classList.add("active");

    // get the index from the html
    let index = e.target.dataset.index;
    index = parseInt(index);
    // Bug fix
    if (isNaN(index)) {
      return;
    }

    yearIndex = index;
    tabAudio.play();
    // get the array of months and send it to display
    renderMonthTabs();
    // New code below display all the notes for the year
    let yearOfNotes = [];

    for (const month of arrayOfYearObjs[yearIndex].arrayOfMonthObjects) {
      yearOfNotes = [...yearOfNotes, ...month.arrayOfNotes];
    }
    display.paintYearOfNotes(yearOfNotes);
  } // End code to set the active class
}); // End el.yearList.addEventListener()

// *************************************************************
//  Month Code
// *************************************************************
el.monthList.addEventListener("click", (e) => {
  // event delegation
  if (e.target.classList.contains("month")) {
    const element = document.querySelector(".month.active");
    removeActiveClass(element);
    // add active class
    e.target.classList.add("active");
    // get the index from the html
    let index = e.target.dataset.index;
    index = parseInt(index);

    // Bug fix
    if (isNaN(index)) {
      return;
    }
    monthIndex = index;
    tabAudio.play();

    renderNotes();
    return;
  } // End code to set the active class
});

// *************************************************************
//  Note Code
// *************************************************************
// When the user clicks on a note
el.noteList.addEventListener("click", (e) => {
  // this gets the data I embedded into the html
  let dataIndex = e.target.dataset.index;
  let deleteIndex = parseInt(dataIndex);
  nI = deleteIndex;

  // this makes sure only one picture in a note shows up in the note area
  const picArray = [];
  const picElements = document.querySelectorAll(".myPic");
  // push all pic index's into an array to loop through next
  for (const element of picElements) {
    // remove all elements with the class of .myPic
    let indexP = element.getAttribute("data-pIndex");
    indexP = parseInt(indexP);
    picArray.push(indexP);
  }
  // loop through picArray and return if the picture is already displayed
  for (const item of picArray) {
    if (item === nI) {
      nI = -243;
      return;
    }
  }

  // event delegation
  if (e.target.classList.contains("moveUp")) {
    // get the index from the html
    let index = e.target.parentElement.dataset.index;
    index = parseInt(index);

    //If index is zero. You can't move it any more so return
    if (index === 0) {
      return;
    }
    // get move to index
    let moveTo = index - 1;
    let arr =
      arrayOfYearObjs[yearIndex].arrayOfMonthObjects[monthIndex].arrayOfNotes;
    // swap array elements
    [arr[index], arr[moveTo]] = [arr[moveTo], arr[index]];
    btnAudio.play();
    // write to file
    arrayOfYearObjs[yearIndex].writeYearToHardDisk(fs, display);
    renderNotes();
    // return
    return;
  }

  // event delegation
  if (e.target.classList.contains("moveDown")) {
    // get the index from the html
    let index = e.target.parentElement.dataset.index;
    index = parseInt(index);

    let arr =
      arrayOfYearObjs[yearIndex].arrayOfMonthObjects[monthIndex].arrayOfNotes;

    //If index is equal to length - 1. You can't move it any more so return
    if (index === arr.length - 1) {
      return;
    }
    // get move to index
    let moveTo = index + 1;
    // swap array elements
    [arr[index], arr[moveTo]] = [arr[moveTo], arr[index]];
    btnAudio.play();
    // write to file
    arrayOfYearObjs[yearIndex].writeYearToHardDisk(fs, display);
    renderNotes();
    // return
    return;
  }
  // event delegation
  if (e.target.classList.contains("delete-item")) {
    // get the index from the html
    let deleteIndex = e.target.parentElement.dataset.index;
    deleteIndex = parseInt(deleteIndex);
    if (isNaN(deleteIndex)) {
      return;
    }
    // check if control was down, if so delete note
    if (!deleteMode) {
      warningEmptyAudio.play();
      display.showAlert(
        "You have to select Edit and Delete mode in menu to make a deletion!",
        "error"
      );
      return;
    }
    if (!e.ctrlKey) {
      warningEmptyAudio.play();
      display.showAlert(
        "You have to hold down ctrl key to make a deletion!",
        "error"
      );
      return;
    }
    if (e.ctrlKey) {
      if (deleteMode) {
        // delete note
        arrayOfYearObjs[yearIndex].arrayOfMonthObjects[
          monthIndex
        ].arrayOfNotes.splice(deleteIndex, 1);
        // write to file
        arrayOfYearObjs[yearIndex].writeYearToHardDisk(fs, display);
        deleteAudio.play();
        display.showAlert("Note deleted!", "success");
        renderNotes();
      }
    } // End control key down
    return;
  }
  // event delegation
  if (e.target.classList.contains("myPic")) {
    // remove image
    e.target.remove();
    return;
  }

  // event delegation
  if (e.target.classList.contains("note")) {
    // see if the note has a imagePath

    let selectedNote =
      arrayOfYearObjs[yearIndex].arrayOfMonthObjects[monthIndex].arrayOfNotes[
        nI
      ];

    if (selectedNote.imagePath) {
      let oImg = document.createElement("img");
      oImg.setAttribute("src", selectedNote.imagePath);
      oImg.setAttribute("alt", "na");
      oImg.setAttribute("width", "100%");
      oImg.setAttribute("data-pIndex", nI);
      oImg.className = "myPic";
      // insert the image after current note

      // You can not use el.noteList because you are in the addeventListener for el.noteList
      // use this.noteList
      this.noteList.insertBefore(oImg, e.target.nextSibling);
      // 2ND fix: just reselect the element, both will work
      // document
      //   .querySelector("#noteList")
      //   .insertBefore(oImg, e.target.nextSibling);
    }
    // check if the alt Key is held down and add Image to note
    if (e.altKey) {
      addImage();
      return;
    }
    // if shift is down remove the current path
    if (e.shiftKey) {
      selectedNote.imagePath = null;
      // write to file
      arrayOfYearObjs[yearIndex].writeYearToHardDisk(fs, display);
      // reasign current note
      nI = -243;
      deleteAudio.play();
      display.showAlert("Removed the image from note!", "success");
      // send note array to display
      renderNotes();
    }
    return;
  } // End class name contains note

  // event delegation
  if (e.target.classList.contains("edit-note")) {
    // this kicks off the modal
    // get the index from the html
    let index = e.target.parentElement.dataset.index;
    index = parseInt(index);
    if (isNaN(index)) {
      return;
    }
    nI = index;
    //set modal text
    // grab current note
    let note =
      arrayOfYearObjs[yearIndex].arrayOfMonthObjects[monthIndex].arrayOfNotes[
        nI
      ];

    el.noteModalTextArea.value = note.text;
    clickAudio.play();
    return;
  }
}); // End el.noteList.addEventListener

// when You click the + in the Note Heading
el.addNoteIcon.addEventListener("click", (e) => {
  clickAudio.play();
  // clear the text Area
  el.noteTextAreaInput.value = "";
  display.showNoteForm();

  window.setTimeout(function () {
    el.noteTextAreaInput.focus();
  }, 1000);
}); // End

// when You click the add note btn in the note form
el.addNoteSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // create note
  let noteText = el.noteTextAreaInput.value.trim();

  // check if text is empty
  if (!noteText) {
    warningEmptyAudio.play();
    display.showAlert("Please enter note in the text area!", "error");
    return;
  }
  // create new note
  let newNote = new Note(noteText);
  // push note into note array

  arrayOfYearObjs[yearIndex].arrayOfMonthObjects[monthIndex].arrayOfNotes.push(
    newNote
  );

  // save year object
  arrayOfYearObjs[yearIndex].writeYearToHardDisk(fs, display);
  // clear the text Area
  el.noteTextAreaInput.value = "";
  addAudio.play();
  display.showAlert("A new note was added!", "success", 900);

  renderNotes();
}); // End

// when You click the cancel btn in the note form
el.noteCancelBtn.addEventListener("click", (e) => {
  cancelAudio.play();
  el.noteForm.reset();
  display.displayNone(el.noteForm);
  window.setTimeout(function () {
    el.noteTextAreaInput.focus();
  }, 1000);
}); // End

// when You click the clear btn in the note form
el.noteClearTextAreaBtn.addEventListener("click", (e) => {
  btnAudio.play();
  // clear the text Area
  el.noteTextAreaInput.value = "";
  window.setTimeout(function () {
    el.noteTextAreaInput.focus();
  }, 1000);
}); //End

// when you click on the add Date btn in the note form
el.noteAddDateBtn.addEventListener("click", (e) => {
  btnAudio.play();
  let date = new Date();
  el.noteTextAreaInput.value = date.toDateString();
  window.setTimeout(function () {
    el.noteTextAreaInput.focus();
  }, 1000);
}); //End

// *************************************************************
//  Edit Note Code
// *************************************************************
// when you click on the save edit btn in the modal
el.saveEditedNoteBtn.addEventListener("click", (e) => {
  if (yearIndex < 0 || isNaN(yearIndex)) {
    warningNameTakenAudio.play();
    return;
  }
  let newNoteText = el.noteModalTextArea.value.trim();
  // check if text is empty
  if (!newNoteText) {
    warningEmptyAudio.play();
    display.showAlert("Please enter text in the text area!", "error");
    return;
  }
  // grab current note
  // grab current note
  let note =
    arrayOfYearObjs[yearIndex].arrayOfMonthObjects[monthIndex].arrayOfNotes[nI];
  // if note is valid set the new text
  if (note) {
    note.text = newNoteText;
  }
  addAudio.play();
  // save year object
  display.showAlert("Note updated!", "success", 3000);
  arrayOfYearObjs[yearIndex].writeYearToHardDisk(fs, display);
  renderNotes();
});
// when you click on the close Btn on the edit note form
el.editNoteCloseBtn.addEventListener("click", (e) => {
  clickAudio.play();
});
// *************************************************************
//  End Edit Note Code
// *************************************************************
// *************************************************************
//  End Note Code
// *************************************************************

// *************************************************************
//  Settings Code
// *************************************************************
// when You click on save settings Btn
el.saveSettingsSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // get form data to create a settings object
  // theme radio code
  let themeValue = getRadioValue(el.settingsForm, "theme");
  // set the current theme
  currentTheme = themeValue;
  // fontsize radio code
  let fontSizeValue = getRadioValue(el.settingsForm, "fontSize");
  let settingsStorage = new SettingsStorage();
  let settingsObj = new SettingsObj();
  // set the object values
  settingsObj.theme = themeValue;
  settingsObj.fontSize = fontSizeValue;
  settingsObj.filePathArray = settingsArrayContainer;
  // set auto load true or false
  settingsObj.autoLoad = el.autoLoadCheckBox.checked;
  // save the object
  settingsStorage.saveSettings(settingsObj);
  addAudio.play();
  // reset form
  el.settingsForm.reset();
  if (settingsObj.autoLoad) {
    // clear two arrays
    // setting the length to Zero emptys the array
    arrayOfYearObjs.length = 0;
    settingsArrayContainer.length = 0;
    display.displayNone(el.settingsForm);
    startUp();
  } else {
    // let settings = settingsStorage.getSettingsFromFile();
    applySettings(settingsObj);
    // hide form
    display.displayNone(el.settingsForm);
    renderYearTabs();
    return;
  }
}); // End

// when You click on settings form cancel Btn
el.settingsCancelBtn.addEventListener("click", (e) => {
  cancelAudio.play();
  // hide form
  display.displayNone(el.settingsForm);
  renderYearTabs();
  return;
});

// when You click on settings form factory reset btn
el.factoryResetBtn.addEventListener("click", (e) => {
  btnAudio.play();
  let settingsStorage = new SettingsStorage();
  settingsStorage.clearFileFromLocalStorage();
  loadUpSettingsForm();
});

// When You click on settings form add path to autoload Btn
el.settingsAddPathBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // this is for extsions
  let myOptions = {
    filters: [
      {
        name: "Custom File Type",
        extensions: ["deb"],
      },
    ],
    properties: ["openFile", "multiSelections"],
  };

  dialog.showOpenDialog(null, myOptions, (fileNames) => {
    if (!fileNames || fileNames.length === 0) {
      display.showAlert("No file selected", "error");
    } else {
      // got file name

      for (let filePath of fileNames) {
        pushFileSettingsContainer(filePath);
      }
      addImageAudio.play();
      // update Form
      display.showAutoLoadList(settingsArrayContainer);
    }
  });
});

// when You click on x to delete a file path
el.autoLoadList.addEventListener("click", (e) => {
  e.preventDefault();
  // event delegation
  if (e.target.classList.contains("deleteFile")) {
    if (!deleteMode) {
      warningEmptyAudio.play();
      display.showAlert(
        "You have to select Edit and Delete mode in menu to make a deletion!",
        "error"
      );
      return;
    }
    if (!e.ctrlKey) {
      warningEmptyAudio.play();
      display.showAlert(
        "You have to hold down ctrl key to make a deletion!",
        "error"
      );
      return;
    }
    if (e.ctrlKey) {
      if (deleteMode) {
        // this gets the data I embedded into the html
        let dataIndex = e.target.parentElement.parentElement.dataset.index;
        let deleteIndex = parseInt(dataIndex);
        if (isNaN(deleteIndex)) {
          return;
        }
        // delete path
        settingsArrayContainer.splice(deleteIndex, 1);
        warningSelectAudio.play();
        // update Form
        display.showAutoLoadList(settingsArrayContainer);
      }
    }
  }
});
// *************************************************************
//  End Settings Code
// *************************************************************
