var app = angular.module('carma.directives', ['firebase'])
  app.directive('carmaMap', function($rootScope, $http, $firebaseArray) {
    return {
      scope: false,
      link: function(scope, elm, attr) {
        $rootScope.$on('positionCoordinated',function () {
          $http.get('config/map.json')
            .success(function(config) {
              L.mapbox.accessToken = config.access_token;
              scope.map = L.mapbox.map(elm[0], 'russellbvea.m8ni14il', {
                  // zoomControl: false,
              });
              window.map = scope.map;
              var center = [21.31296713802774, -157.86324620246884];
              scope.map.setView(center, 19);

              L.marker(center , {
                  icon: L.mapbox.marker.icon( {
                    'marker-color': '7D8C93'
                  })
              }).addTo(scope.map);
            });
        });

        var ref = new Firebase('https://carma.firebaseio.com/checkins');
        scope.checkins = $firebaseArray(ref);

        document.querySelector('.carma-timer-button').addEventListener('click', function() {
            document.querySelector('.carma').classList.add('drag');
            scope.checkins.$add({
              latitude: $rootScope.center[0],
              longitude: $rootScope.center[1],
              timestamp: Firebase.ServerValue.TIMESTAMP
            });
        });
        document.querySelector('.carma-map-close').addEventListener('click', function() {
            document.querySelector('.carma').classList.remove('drag');
        });
      }
    }
  });
  app.directive('carmaTimer', function() {
    return function(scope, elm, attr)   {
      var timeRemain = 60;
      var timer = document.querySelector('.carma-timer-seconds');
      timer.textContent = timeRemain;
      setInterval(function(){
        timeRemain--;
        timer.textContent = timeRemain;
      }, 1000);
    }
  });
