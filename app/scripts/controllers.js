angular.module('carma.controllers', ['leaflet-directive', 'firebase'])
.controller('DashCtrl', function($scope, Spaces, $http, $firebaseArray) {
  var ref = new Firebase('https://carma.firebaseio.com/checkins');
  $scope.checkins = $firebaseArray(ref);

  var success = function(position) {
    $scope.checkins.$add({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      timestamp: Firebase.ServerValue.TIMESTAMP
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

  console.log($scope.checkins);
  $scope.checkins.$watch(function(e) {
    console.log('Event: ' + e.event + ', Key: ' + e.key);
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
