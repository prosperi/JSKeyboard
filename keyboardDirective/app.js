angular.module('app', [])

.directive('keyboardDiv', function(){
  return {
    restrict: 'E',
    replace: 'true',
    templateUrl: 'keyboard.html',
    link: function(scope, elem, attrs){
      init("layout", "input-div", elem[0].getAttribute("id"));
    }
  };
})
