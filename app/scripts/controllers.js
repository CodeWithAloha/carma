angular.module('carma.controllers', ['leaflet-directive', 'firebase'])
.controller('DashCtrl', function($scope, Spaces, $http, $firebaseArray, Restrictions) {
  var service = Restrictions;

  var ref = new Firebase('https://carma.firebaseio.com/checkins');
  $scope.checkins = $firebaseArray(ref);

  var success = function(position) {
    $scope.checkins.$add({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      timestamp: Firebase.ServerValue.TIMESTAMP
    });

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
