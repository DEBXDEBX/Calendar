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
    // select add show forms + / icon
    this.addNoteIcon = document.querySelector("#addNoteIcon");
    // select textName and textArea
    this.noteTextareaInput = document.querySelector("#noteTextareaInput");
    // select message display
    this.messageDisplay = document.querySelector("#displayMessage");
    // select message border
    this.messageBorder = document.querySelector("#modalBorder");
  } // End constructor
} // End Elements class
