angular.module('carma.controllers', ['firebase'])
.controller('DashCtrl', function($scope, Spaces, $http, $rootScope,  $firebaseArray, Restrictions) {

  var service = Restrictions;
  
  var success = function(position) {
    $rootScope.center = [position.coords.latitude, position.coords.longitude];
    $scope.$emit('positionCoordinated');

    var canPark = service.canPark(position.coords.latitude, position.coords.longitude);
    canPark.then(function (result) {
      console.log(result);
    });

    $scope.center = [position.coords.latitude, position.coords.longitude];
  }

  navigator.geolocation.getCurrentPosition(success);

  $http.get('data/parking-signs.json')
    .success(function(data) {
        Spaces.set(data);
        $scope.$emit('dataLoaded');
        $rootScope.features = data.features;
    });
});
