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
      var curr = moment();
      var pm = moment('2015-05-23 21:00:00');
      var timeRemain = pm.diff(curr);

      var hours = document.querySelector('.carma-timer-hours');
      var diffHours = pm.diff(curr, 'hours');
      hours.textContent = diffHours;

      var minutes = document.querySelector('.carma-timer-minutes');
      var diffMinutes = pm.diff(curr, 'minutes') % 60;
      minutes.textContent = diffMinutes;


      var seconds = document.querySelector('.carma-timer-seconds');
      seconds.textContent = pm.diff(curr, 'seconds') - (diffHours * 3600) - (diffMinutes * 60);

      setInterval(function(){
        var curr = moment();
        diffHours = pm.diff(curr, 'hours');
        hours.textContent =  diffHours;

        diffMinutes = pm.diff(curr, 'minutes') % 60;
        minutes.textContent = diffMinutes;

        var diffSeconds = pm.diff(curr, 'seconds');
        seconds.textContent = pm.diff(curr, 'seconds') - (diffHours * 3600) - (diffMinutes * 60);
      }, 1000);
    }
  });
