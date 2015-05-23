angular.module('carma.services', [])
  .factory('Spaces', function($http) {
    // Might use a resource here that returns a JSON array
    var spaces;

    return {
        all: function() {
          return spaces;
        },
        set: function(spaces) {
          spaces = spaces;
        }
    }

  });

(function() {
angular.module('carma.checkins', ['firebase'])
  .factory('CheckIn', CheckIn);

CheckIn.$inject = ['$firebaseArray'];

function CheckIn($firebaseArray) {
  var ref = new Firebase('https://carma.firebaseio.com/checkins');

  return $firebaseArray(ref);
}

})();
