angular.module('carma.controllers', [])

.controller('DashCtrl', function($scope, Spaces, $http, $rootScope) {

  var success = function(position) {
    $rootScope.center = [position.coords.latitude, position.coords.longitude];
    $scope.$emit('positionCoordinated');
  }

  navigator.geolocation.getCurrentPosition(success);

  $http.get('data/parking-signs.json')
    .success(function(data) {
        Spaces.set(data);
        $scope.$emit('dataLoaded');
        $scope.features = data.features;
    });
})

.controller('SpacesCtrl', function($scope, Spaces) {
    console.log(Spaces.all());
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Spaces) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
