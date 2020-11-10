class Elements {
  constructor() {
    // select the lists
    this.yearList = document.querySelector("#yearList");
    this.monthList = document.querySelector("#monthList");
    this.yearOfNotesList = document.querySelector("#yearOfNotesList");
    this.noteList = document.querySelector("#noteList");
    this.autoLoadList = document.querySelector("#autoLoadList");
    // select headings
    this.yearHeading = document.querySelector("#yearHeading");
    this.monthHeading = document.querySelector("#monthHeading");
    this.nHeading = document.querySelector("#headingNote");
    // select forms
    this.noteForm = document.querySelector("#noteForm");
    this.settingsForm = document.querySelector("#settingsForm");
    // select btn's
    this.addNoteSubmitBtn = document.querySelector("#addNoteSubmitBtn");
    this.noteCancelBtn = document.querySelector("#noteCancelBtn");
    this.noteClearTextAreaBtn = document.querySelector("#noteClearTextAreaBtn");
    this.noteAddDateBtn = document.querySelector("#noteAddDateBtn");
    this.saveEditedNoteBtn = document.querySelector("#saveEditedNoteBtn");
    this.editNoteCloseBtn = document.querySelector("#editNoteCloseBtn");
    this.saveSettingsSubmitBtn = document.querySelector(
      "#saveSettingsSubmitBtn"
    );
    this.settingsCancelBtn = document.querySelector("#settingsCancelBtn");
    this.factoryResetBtn = document.querySelector("#factoryResetBtn");
    this.settingsAddPathBtn = document.querySelector("#settingsAddPathBtn");
    // select add show forms + / icon
    this.addNoteIcon = document.querySelector("#addNoteIcon");
    // select textName and textArea
    this.noteTextAreaInput = document.querySelector("#noteTextAreaInput");
    this.noteModalTextArea = document.querySelector("#noteModalTextArea");
    // select message display
    this.messageDisplay = document.querySelector("#displayMessage");
    // select message border
    this.messageBorder = document.querySelector("#modalBorder");
    this.autoLoadCheckBox = document.querySelector("#autoLoadCheckBox");
    // this is for the fontSize
    this.root = document.querySelector(":root");
    this.body = document.querySelector("body");
    this.autoLoadCheckBox = document.querySelector("#autoLoadCheckBox");
    this.darkRadio = document.querySelector("#darkRadio");
    this.lightRadio = document.querySelector("#lightRadio");
    this.xSmallRadio = document.querySelector("#xSmallRadio");
    this.smallRadio = document.querySelector("#smallRadio");
    this.normalRadio = document.querySelector("#normalRadio");
    this.largeRadio = document.querySelector("#largeRadio");
    this.xLargeRadio = document.querySelector("#xLargeRadio");
    this.blankCssLink = document.querySelector("#blankCssLink");
  } // End constructor
} // End Elements class
