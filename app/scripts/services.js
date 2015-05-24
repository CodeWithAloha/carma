var DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

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
  })

  .factory('MockRestrictions', function($q) {
    return {canPark: canPark};

    function canPark() {
      var results = [
        {
          restricted: false,
          until: 2100
        },
        {
          restricted: true,
          until: 2100
        }
      ];

      result = (Math.random() < 0.5) ? results[0] : results[1];
      return $q.when(result);
    }
  })

  .factory('Restrictions', function($http) {
    // Store resolved data so there's no need to refetch.
    var _data = $http.get('data/parking-restrictions.json');

    return {canPark: canPark};

    function toRadians(degrees) {
      return degrees * Math.PI / 180.0;
    }

    function distance(lat1, lon1, lat2, lon2) {
      // Shamelessly stolen from http://www.movable-type.co.uk/scripts/latlong.html
      var φ1 = toRadians(lat1), φ2 = toRadians(lat2), Δλ = toRadians(lon2-lon1), R = 6371000; // gives d in metres
      return Math.acos( Math.sin(φ1)*Math.sin(φ2) + Math.cos(φ1)*Math.cos(φ2) * Math.cos(Δλ) ) * R;
    }

    function isActiveDay(day, activeDays) {
      var dayString = DAYS[day];
      return activeDays.indexOf(dayString) !== -1;
    }

    function convertToInterval(time) {
      var hours = time / 100;
      var half = (time % 100 === 0) ? 0 : 1;

      return (hours * 2) + half;
    }

    function convertFromInterval(index) {
      var hours = index / 2;
      var minutes = (index % 2 === 0) ? 0 : 30;

      return (hours * 100) + minutes;
    }

    function canPark(latitude, longitude) {
      return _data.then(function(response) {
        var items = response.data;

        items.sort(function (item1, item2) {
          return distance(latitude, longitude, item1.coordinates[0], item1.coordinates[1]) < distance(latitude, longitude, item2.coordinates[0], item2.coordinates[1])
        });

        var closest = items[0];
        var currentDate = new Date();

        var restrictions = closest.restriction_list.filter(function (r) {
          return isActiveDay(currentDate.getDay(), r.active_days);
        });

        if (restrictions.length === 0) {
          return {
            restricted: false,
            until: 2400
          }
        }

        // Assume 48 timeslots (24 hours x 2 for half hour)
        var timePeriod = new Array(48);
        restrictions.forEach(function (r) {
          var start = convertToInterval(r.time_period[0]);
          var end = convertToInterval(r.time_period[1]);

          for (var i=start; i < end; i++) {
            timePeriod[i] = true;
          }
        });

        // Now figure out if we are true or undefined.
        var hours = currentDate.getHours();
        var half = (currentDate.getMinutes() < 30) ? 1 : 0;
        var index = (hours * 2) + half;

        if (timePeriod[index]) {
          // Restricted!
          for (var i=index; i < 48; i++) {
            if (!timePeriod[i]) {
              return {
                restricted: true,
                until: convertFromInterval(i)
              }
            }
          }
        }

        else {
          // Not restricted!
          for (var i=index; i < 48; i++) {
            if (timePeriod[i]) {
              return {
                restricted: false,
                until: convertFromInterval(i)
              }
            }
          }

          return {
            restricted: false,
            until: 2400
          };
        }
      });
    }
  });
