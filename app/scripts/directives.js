var app = angular.module('carma.directives', [])
app.directive('map', function() {
  return function(scope, elm, attr) {
    console.log('linked');
  }
});
