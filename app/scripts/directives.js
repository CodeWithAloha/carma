var app = angular.module('carma.directives', [])
  app.directive('carmaMap', function($rootScope, $http) {
    return {
      scope: false,
      link: function(scope, elm, attr) {
        $rootScope.$on('positionCoordinated',function () {
          $http.get('config/map.json')
            .success(function(config) {
              L.mapbox.accessToken = config.access_token;
              scope.map = L.mapbox.map(elm[0], 'russellbvea.m8ni14il');
              scope.map.setView($rootScope.center, 18);
            });
        })
        ;
      }
    }
  });
