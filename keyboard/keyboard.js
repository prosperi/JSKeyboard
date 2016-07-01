function init(lang, input, keyboard){
  var LAYOUT = "layouts/" + lang + ".json";
  var INPUT = document.getElementById(input);
  var KEYBOARD = document.getElementById(keyboard);

  $.ajax({
     url: LAYOUT,
     success: success,
     error: error
   });

   function success(data){
     var common_version = data.common;
     var shift_version = data.shift;

     drawKeyboard(common_version);

   }

   function error(){
     console.log("Error");
   }

   function drawKeyboard(layout){
     layout.forEach(function(row, index){
       for(var col in row){
         document.getElementById("col-"+ index + col).textContent = row[col];
         document.getElementById("col-"+ index + col).addEventListener("click", onClick);
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
         default:
              console.log("There is no such key");
       }
     }else{
       appendSymbol(this.textContent);
     }
     INPUT.focus();
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


}

init("layout", "input-div", "keyboard");
