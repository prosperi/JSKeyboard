angular.module('app', [])

.controller('MainCtrl', ['$scope', function($scope){
  $scope.keyboard = "keyboard_01";
  $scope.input = "";
}])

.controller('SubCtrl', ['$scope', function($scope){
  $scope.input = "";
  $scope.keyboard = "keyboard_02";
}])

.directive('keyboardDiv', function(){
  return {
    restrict: 'E',
    replace: 'true',
    templateUrl: 'keyboard.html',
    link: function(scope, elem, attrs){
      init("layout", attrs.inputDiv, scope.keyboard, scope.keyboard);
    }
  };
})
