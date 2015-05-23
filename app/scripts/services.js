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
