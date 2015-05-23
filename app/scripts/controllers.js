angular.module('carma.controllers', ['leaflet-directive'])

.controller('DashCtrl', function($scope, Spaces, $http) {

  var success = function(position) {
    $scope.center = [position.coords.latitude, position.coords.longitude];
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
