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

   function drawKeyboard(keyboard){
     keyboard.forEach(function(row, index){
       for(var col in row){
         document.getElementById("col-"+ index + col).textContent = row[col];       }
     });
   }


}

init("layout", "input-div", "keyboard");
