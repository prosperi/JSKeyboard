var LAYOUT, INPUT, KEYBOARD, SCOPE, COMMON_VERSION, SHIFT_VERSION, CAPS_VERSION;

function init(lang, input, keyboard, scope){
  LAYOUT = "layouts/" + lang + ".json";
  INPUT = INPUT || document.getElementById(input);
  KEYBOARD = KEYBOARD || document.getElementById(keyboard);
  SCOPE = SCOPE || scope;
  console.log(INPUT, KEYBOARD, scope);

  $.ajax({
     url: LAYOUT,
     success: success,
     error: error
   });

   function success(data){
     COMMON_VERSION = data.common;
     SHIFT_VERSION = data.shift;
     CAPS_VERSION = data.caps;

     drawKeyboard(COMMON_VERSION, 1);

   }

   function error(){
     console.log("Error");
   }

}

 function drawKeyboard(layout, listenerChecker){
   layout.forEach(function(row, index){
     for(var col in row){
       var el = document.getElementById(SCOPE + "-" + "col-" + index + col);
       // Checks if element exists (not null);
       if(el){
        el.textContent = row[col];
         if(listenerChecker){
          el.addEventListener("click", onClick);
         }
       }
     }
   });
 }


 function onClick(){
   if(this.textContent.length > 1){
     switch(this.textContent){
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
       case "eng":
            changeLanguage("eng");
            break;
       case "geo":
            changeLanguage("geo");
            break;
       default:
            console.log("There is no such key");
     }
   }else{
     appendSymbol(this.textContent);
   }
   INPUT.focus();
   $(INPUT).trigger('input');
 }

 function appendSymbol(sym){
   var start = INPUT.selectionStart,
       end = INPUT.selectionEnd;
   INPUT.value = INPUT.value.slice(0, start) + sym + INPUT.value.slice(end);
   INPUT.selectionStart = start + 1;
   INPUT.selectionEnd = start + 1;
 }

 function changeCursor(hChange){
   var start = INPUT.selectionStart;
   INPUT.selectionStart = start + hChange;
   INPUT.selectionEnd = start + hChange;
 }

 function deleteSymbol(type){
   var start = INPUT.selectionStart,
       end = INPUT.selectionEnd;
   if(start === end)
      INPUT.value = (type) ? INPUT.value.slice(0, start-1) + INPUT.value.slice(end) :  INPUT.value.slice(0, start) + INPUT.value.slice(end + 1);
   else
      INPUT.value = INPUT.value.slice(0, start) + INPUT.value.slice(end);
   INPUT.selectionStart = (type) ? start + 1 : start;
   INPUT.selectionEnd =(type) ? end + 1 : end;
 }

 var changeCaps = (function(){
   var counter = 0;
   return function(){
     counter++;
     return (counter%2 == 1) ? drawKeyboard(CAPS_VERSION, 0) : drawKeyboard(COMMON_VERSION, 0);
   };
 }());

 var changeShift = (function(){
   var counter = 0;
   return function(){
     counter++;
     return (counter%2 == 1) ? drawKeyboard(SHIFT_VERSION, 0) : drawKeyboard(COMMON_VERSION, 0);
   }
 }());

 function changeLanguage(language){
   init(language);
 }

 //init("layout", "input-div", "keyboard");
