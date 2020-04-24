class Elements {
  constructor() {
    // select the lists
    this.yearList = document.querySelector("#yearList");
    this.monthList = document.querySelector("#monthList");
    this.yearOfNotesList = document.querySelector("#yearOfNotesList");
    this.noteList = document.querySelector("#noteList");
    // select headings
    this.yearHeading = document.querySelector("#yearHeading");
    this.monthHeading = document.querySelector("#monthHeading");
    this.nHeading = document.querySelector("#headingNote");

    // // select forms
    this.noteForm = document.querySelector("#noteForm");
    this.settingsForm = document.querySelector("#settingsForm");
    // // select add show forms + / icon
    this.addShowFormNote = document.querySelector("#nadd");
    // // select textName and textArea
    this.textArea = document.querySelector("#myTextArea");
    // // select the autoload list
    this.autoLoadList = document.querySelector("#autoLoadList");
    // select message display
    this.messageDisplay = document.querySelector("#displayMessage");
  } // End constructor
} // End Elements class
