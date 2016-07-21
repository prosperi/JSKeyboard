function App(app){
  this.app = document.getElementById(app);
  this.keyboard = null;
  this.input = null;
  this.language = null;
}

function Keyboard(id, layout, app, input){
  this.id = id;
  this.element = document.getElementById(id);
  this.layout = layout;
  this.COMMON_VERSION = layout.common;
  this.SHIFT_VERSION = layout.shift;
  this.CAPS_VERSION = layout.caps;
  this.buttons = [];
  this.app = app;
  this.input = input;
  this.input.keyboard = this;
}

function Button(value, id, keyboard){
  this.value = value;
  this.id = id;
  this.colId = /[0-9]+$/.exec(id)[0].slice(0,1);
  this.rowId = /[0-9]+$/.exec(id)[0].slice(1);
  this.keyboard = keyboard;
  this.element = document.getElementById(id);
  this.element.addEventListener("click", this.constructor.prototype.onClick.bind(this));  // When ES6 becomes fully supported we'll be free ()=>{
  var specialChars = ["right", "left", "tab", "caps", "shift", "enter", "bspace", "lang", "delete"];
  if(specialChars.indexOf(value) === -1){
    this.element.textContent = value;
  }else{
    var img = document.createElement("img");
    img.src = "images/" + value + ".png";
    img.width = 14;
    this.element.appendChild(img);
  }
}

function Input(id, app){
  this.id = id;
  this.element = document.getElementById(id);
  this.app = app;
  this.keyboard = null;
}


// Init application. During this process language is loaded, new Keyboard and Input are creted
App.prototype.init = function(languages, inputID, keyboardID){

  var that = this;
  var LAYOUT_ADDRESS = "languages/" + languages[0] + ".json";

  $.ajax({
    url: "layouts/keyboard.html",
    success: function(data){
      that.app.innerHTML = data;
      $.ajax({
        url: LAYOUT_ADDRESS,
        success: success,
        error: error
      });
    },
    error: error
  });

  function success(data){
    var input = new Input(inputID, that);
    var keyboard = new Keyboard(keyboardID, data, that, input);
    that.keyboard = keyboard;
    that.input = input;
    that.language = {
      list: languages,
      current: 0
    };
    keyboard.draw("COMMON_VERSION", 1);
  }

  function error(){
    console.log("Error");
  }

};


// Initialize Keyboard.buttons array and create new Buttons
Keyboard.prototype.draw = function(layout, listenerChecker){

  this[layout].forEach(function(row, index){
    for(var col in row){
      if(document.getElementById("col-"+ index + col)){
        var button = new Button(row[col],"col-"+ index + col, this);
      }
      this.buttons.push(button);
    }
  }, this);

};

// Reassign Buttons' textContent (used for Caps, Shift and language change operations)
Keyboard.prototype.changeView = function(layout){
  var specialChars = ["right", "left", "tab", "caps", "shift", "enter", "bspace", "lang", "delete"];
  this.buttons.forEach(function(button){
    if(specialChars.indexOf(button.value) === -1){
      button.element.textContent = this[layout][button.colId][button.rowId];
    }
  }, this);
};

Keyboard.prototype.changeLanguage = function(){

  var lang;
  if(this.app.language.current < this.app.language.list.length - 1){
    lang = this.app.language.list[this.app.language.current + 1];
    this.app.language.current++;
  }else{
    lang = this.app.language.list[0];
    this.app.language.current = 0;
  }
  var LAYOUT_ADDRESS = "languages/" + lang + ".json";
  var that = this;

  $.ajax({
    url: LAYOUT_ADDRESS,
    success: success,
    error: error
  });

  function success(data){
    that.COMMON_VERSION = data.common;
    that.SHIFT_VERSION = data.shift;
    that.CAPS_VERSION = data.caps;
    that.changeView("COMMON_VERSION");
  }

  function error(){
    console.log("Error");
  }

};

// Button onClick Listener
Button.prototype.onClick =function(){
  // Find if a symbol was clicked. If that's the case then
  // its value's length should be equal to 1, otherwise
  // "special" button was clicked
  if(this.value.length > 1){
    switch(this.value){
      case "space":
           this.keyboard.input.appendSymbol(" ");
           break;
      case "enter":
           this.keyboard.input.appendSymbol('\n');
           break;
      case "tab":
           this.keyboard.input.appendSymbol("   ");
           this.keyboard.input.changeCursor(2);
           break;
      case "left":
           this.keyboard.input.changeCursor(-1);
           break;
      case "right":
           this.keyboard.input.changeCursor(1);
           break;
      case "bspace":
           this.keyboard.input.deleteSymbol(true);
           break;
      case "delete":
           this.keyboard.input.deleteSymbol(false);
           break;
      case "shift":
           this.keyboard.input.changeShift();
           break;
      case "caps":
           this.keyboard.input.changeCaps();
           break;
      case "lang":
            this.keyboard.changeLanguage();
            break;
      default:
           console.log("There is no such key");
    }
  }else{
    this.keyboard.app.input.appendSymbol(this.element.textContent);
  }
  this.keyboard.app.input.element.focus();
};

Input.prototype.appendSymbol = function(sym){
  var input = this.element;
  var start = input.selectionStart,
      end = input.selectionEnd;
  input.value = input.value.slice(0, start) + sym + input.value.slice(end);
  input.selectionStart = start + 1;
  input.selectionEnd = start + 1;
};

Input.prototype.deleteSymbol = function(type){
  var input = this.element;
  var start = input.selectionStart,
      end = input.selectionEnd;
  if(start === end)
     input.value = (type) ? input.value.slice(0, start-1) + input.value.slice(end) :  input.value.slice(0, start) + input.value.slice(end + 1);
  else
     input.value = input.value.slice(0, start) + input.value.slice(end);
  input.selectionStart = (type) ? start + 1 : start;
  input.selectionEnd =(type) ? end + 1 : end;
};

// Change Input field cursor, hChange argument shows the displacement of cursor
Input.prototype.changeCursor = function(hChange){
  var input = this.element;
  var start = input.selectionStart;
  input.selectionStart = start + hChange;
  input.selectionEnd = start + hChange;
};

Input.prototype.changeCaps = (function(){
  var counter = 0;
  return function(){
    counter++;
    return (counter%2 === 1) ? this.keyboard.changeView("CAPS_VERSION") : this.keyboard.changeView("COMMON_VERSION");
  };
}());

Input.prototype.changeShift = (function(){
  var counter = 0;
  return function(){
    counter++;
    return (counter%2 === 1) ? this.keyboard.changeView("SHIFT_VERSION", 0) : this.keyboard.changeView("COMMON_VERSION");
  }
}());
