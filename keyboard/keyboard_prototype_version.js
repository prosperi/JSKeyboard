function App(){
  this.keyboard = null;
  this.input = null;
}

function Keyboard(id, layout, app){
  this.id = id;
  this.element = document.getElementById(id);
  this.layout = layout;
  this.COMMON_VERSION = layout.common;
  this.SHIFT_VERSION = layout.shift;
  this.CAPS_VERSION = layout.caps;
  this.buttons = [];
  this.app = app;
}

function Button(value, id, keyboard){
  this.value = value;
  this.id = id;
  this.keyboard = keyboard;
  this.element = document.getElementById(id);
  this.element.textContent = value;
  this.element.addEventListener("click", this.constructor.prototype.onClick.bind(this));  // When ES6 becomes fully supported we'll be free ()=>{
}

function Input(id, app){
  this.id = id;
  this.element = document.getElementById(id);
  this.app = app;
}

App.prototype.init = function(lang, inputID, keyboardID){

  var that = this;
  var LAYOUT_ADDRESS = "layouts/" + lang + ".json";

  $.ajax({
    url: LAYOUT_ADDRESS,
    success: success,
    error: error
  });

  function success(data){
    var keyboard = new Keyboard(keyboardID, data, that);
    var input = new Input(inputID, that);
    that.keyboard = keyboard;
    that.input = input;
    keyboard.draw("COMMON_VERSION", 1);
    console.log(that);
  }

  function error(){
    console.log("Error");
  }

};

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

Button.prototype.onClick =function(){
  if(this.value.length > 1){
    switch(this.value){
      case "space":
           appendSymbol(" ");
           break;
      case "enter":
           appendSymbol('\n');
           break;
      case "tab":
           appendSymbol("   ");
           changeCursor(2);
           break;
      case "left":
           changeCursor(-1);
           break;
      case "right":
           changeCursor(1);
           break;
      case "bspace":
           deleteSymbol(true);
           break;
      case "delete":
           deleteSymbol(false);
           break;
      case "shift":
           changeShift();
           break;
      case "caps":
           changeCaps();
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

Input.prototype.deleteSymbol = function(){

};

Input.prototype.changeCursor = function(){

};

var app = new App();
app.init("layout", "input-div", "keyboard");
