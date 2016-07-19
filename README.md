# JSKeyboard
Simple virtual keyboard, built with plain js.

# Code Example
- Create a new div which will be the parent node of your keyboard and input:
```sh
  <div id="app"></div>
```
- Import js/keyboard.js before </body> tag:
```sh
  <script src="js/keyboard.js"></script>
```
- Finally, create new App and pass arguments:
```
  var app = new App("app") // argument for App is the id of our div, in our case "app"
```    
- ... and initialize the app
```
app.init(["eng"], "input-div", "keyboard")
```
# API Reference
app.init( \<languages\> , \<input_id\> , \<keyboard_id\> )
  - ***\<languages\>***     
      The first argument is an array of languages that should be imported;
      eng - English. Those values are names of json files stored in languages directory
      New language json can be simply added by changing English symbols with new language symbols
      Compare languages/eng.json and languages/geo.json for more information.
  - ***\<input_id\>***   
      This is the default id for input field. If you need to change this id, first of all
      change input field id in layouts/keyboard.html and then pass the new id to init()
  - ***\<keyboard_id\>*** 
      Same goes for the keyboard argument, if you need to change this id, do it from
      layouts/keyboard.html


# Further Development
The keyboard layout can be modified by editing html code in **layouts/keyboard.html** while removing corresponding fields in
**languages/language.json** (in this case eng.json).
**language.json** contains 3 objects: layout for common, caps and shift versions of keyboard.

>If anybody prefers using templating engine(in this case jade), there is 
>**keyboard.jade** in layouts directory, it does the same as
>keyboard.html. So jade can also be used for any changes, but new html file should be 
>generated afterwards.

# License
MIT

# Credits
Icons made by [google][author] from [flaticon]

[author]:<http://www.flaticon.com/authors/google>
[flaticon]: <www.flaticon.com>
