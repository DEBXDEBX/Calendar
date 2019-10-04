class Display {
  constructor(elements, $) {
    this.elements = elements;
    //JQuery
    this.$ = $;
    this.tabColorIndex = 0;
  } // End constructor

  // Method
  showAlert(message, className, displayTime = 4000) {
    // Create div
    const div = document.createElement("div");
    // Add classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector("body");
    // Insert alert other element
    container.insertBefore(div, this.elements.noteForm);
    // container.insertBefore(div, this.elements.transactionHeading);
    // Timeout after 4 sec
    setTimeout(function() {
      document.querySelector(".alert").remove();
    }, displayTime);
  } // End showAlert()

  //Method
  displayNone(element) {
    this.$(element).slideUp("slow");
  } // End displayNone(element)

  //Method
  displayBlock(element) {
    this.$(element).slideDown("slow");
  } // End displayBlock(element)

  //Method
  clearYearDisplay() {
    this.elements.yearList.innerHTML = "";
  } // End clearYearDisplay()

  //Method
  clearMonthDisplay() {
    this.elements.monthList.innerHTML = "";
  } // End clearYearDisplay()

  //Method
  clearNoteDisplay() {
    this.elements.noteList.innerHTML = "";
  } // End clearNoteDisplay()

  // Method
  paintYearTabs(mapedArray) {
    this.clearMonthDisplay();
    this.displayNone(this.elements.monthHeading);
    this.displayNone(this.elements.monthList);

    this.clearNoteDisplay();
    this.displayNone(this.elements.nHeading);
    this.displayNone(this.elements.noteList);
    this.displayNone(this.elements.noteForm);

    this.displayBlock(this.elements.yearHeading);
    this.displayBlock(this.elements.yearList);
    this.clearYearDisplay();

    // this will paint all year tabs
    // make variable for html
    let html = "";
    mapedArray.forEach((element, index) => {
      html += `<li data-index="${index}" class="year">${element}</li>`;
    });
    // paint year tabs
    this.elements.yearList.innerHTML = html;
    // color tabs
    let tabList = document.getElementsByClassName("year");
    this.colorSetOfTabs(tabList);
  } // End paintYearTabs(mapedArray)

  // Method
  paintMonthTabs(mapedArray) {
    this.clearMonthDisplay();

    this.displayNone(this.elements.monthList);
    this.displayBlock(this.elements.monthList);
    this.displayNone(this.elements.monthHeading);
    this.displayBlock(this.elements.monthHeading);
    this.displayNone(this.elements.nHeading);
    this.displayNone(this.elements.noteForm);
    this.displayNone(this.elements.noteList);
    this.clearNoteDisplay();

    // this will paint all month tabs
    // make variable for html
    let html = "";
    mapedArray.forEach((element, index) => {
      html += `<li data-index="${index}" class="month">${element}</li>`;
    });
    // paint file cab tabs
    this.elements.monthList.innerHTML = html;
    // color tabs
    let tabList = document.getElementsByClassName("month");
    this.colorSetOfTabs(tabList);
  } // End paintFileCabTabs(mapedArray)

  //Method
  colorSetOfTabs(tabList) {
    let tabColors = [
      "#2de11d",
      "#4848e8",
      "#e84d4d",
      "Orange",
      "Violet",
      "#820ee8",
      "#8e7fc7",
      "#ff008b",
      "#17abf5",
      "#4c69bd"
    ];
    // create an array from an array like object
    let newArray = Array.from(tabList);
    for (let i = 0; i < newArray.length; i++) {
      newArray[i].style.backgroundColor = tabColors[this.tabColorIndex];
      if (this.tabColorIndex === tabColors.length - 1) {
        this.tabColorIndex = 0;
      } else {
        this.tabColorIndex++;
      }
    }
  } // End colorSetOfTabs(tabList)

  //Method
  showSettingsForm() {
    //  hide everything
    this.displayNone(this.elements.yearList);
    this.displayNone(this.elements.monthList);
    // this.displayNone(this.elements.transactionList);
    this.displayNone(this.elements.monthHeading);
    // this.displayNone(this.elements.totalH1);
    this.displayNone(this.elements.transactionHeading);
    this.displayNone(this.elements.myForm);
    this.displayNone(this.elements.yearHeading);
    this.displayNone(this.elements.noteList);
    this.displayNone(this.elements.noteForm);
    this.displayNone(this.elements.nHeading);
    //show settings form
    this.displayBlock(this.elements.settingsForm);
  } // End showSettingsForm()

  //Method
  clearAutoLoadUL() {
    // clear the ul
    this.elements.autoLoadList.innerHTML = "";
  } // End clearAutoLoadUL()

  //Method
  showAutoLoadList(autoLoadArray) {
    // clear the ul
    this.clearAutoLoadUL();
    // make variable for html
    let html = "";
    autoLoadArray.forEach((element, index) => {
      html += `<li data-index="${index}" class="autoLoad"><span title='Delete'><i class="fas fa-trash-alt deleteFile"></i></span>${element}</li>`;
    });
    this.elements.autoLoadList.innerHTML = html;
  }

  //Method
  showNoteHeading() {
    this.displayBlock(this.elements.nHeading);
  }

  //Method
  showNoteForm() {
    this.displayBlock(this.elements.noteForm);
  }

  //Method
  paintNotes(deleteMode, noteArray) {
    this.displayNone(this.elements.nHeading);
    this.displayBlock(this.elements.nHeading);
    this.displayNone(this.elements.noteForm);
    this.displayNone(this.elements.noteList);
    // clear the div
    this.clearNoteDisplay();
    // build div
    noteArray.forEach((note, index) => {
      // if delete mode is true, build div with head of the note to delete and move note
      if (deleteMode) {
        let html = "";
        let newHead = document.createElement("div");
        html += `<h3 data-index="${index}" class="head"><span title='Move Down' class='moveUp'>&uArr;</span><i
      title="Delete Note"
      class="delete-item fas fa-trash-alt"
    ></i
  ><span title='Move Up' class='moveDown'>&dArr;</span></h3>`;
        newHead.innerHTML = html;
        // insert the head of the note
        this.elements.noteList.appendChild(newHead);
      } // End Head of Note
      //######################## Now build the Note #################################
      let newElement = document.createElement("h4");
      newElement.className = "note";
      newElement.setAttribute("data-index", `${index}`);
      if (note.imagePath) {
        newElement.appendChild(
          document.createTextNode(`${note.text}\n\n ${note.imagePath}`)
        );
      } else {
        newElement.appendChild(document.createTextNode(`${note.text}`));
      }
      // insert the note
      this.elements.noteList.appendChild(newElement);
    });

    this.displayBlock(this.elements.noteList);
  } // paintNotes(deleteMode, noteArray)
} // End Display class
