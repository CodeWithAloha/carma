var app = angular.module('carma.directives', [])
  app.directive('carmaMap', function($rootScope, $http) {
    return {
      scope: false,
      link: function(scope, elm, attr) {
        $rootScope.$on('positionCoordinated',function () {
          $http.get('config/map.json')
            .success(function(config) {
              L.mapbox.accessToken = config.access_token;
              scope.map = L.mapbox.map(elm[0], 'russellbvea.m8ni14il', {
                  zoomControl: false,
              });
              scope.map.setView($rootScope.center, 18);
            });
        });
        document.querySelector('.carma-timer-button').addEventListener('click', function() {
            document.querySelector('.carma').classList.add('drag');
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
