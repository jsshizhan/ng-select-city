'use strict';

/**
 * @ngdoc filter
 * @name angularApp.filter:areaName
 * @function
 * @description
 * # areaName
 * Filter in the angularApp.
 */
app
  .filter('areaName', function () {

      function convertNameToCode(name) {
          var code = "";
          var cities = CITY_CODE.cities;
          var citiesLen = cities.length;
          for (var j = citiesLen; j--;) {
              var cityName = cities[j].name;
              //判断是不是属于这个城市
              if (name.indexOf(cityName) > -1) {
                  var areaes = cities[j].areas,
                      areaesLen = areaes.length;
                  for (var m = areaesLen; m--;) {
                      var areaName = areaes[m].name;
                      //判断是不是属于这个区域
                      if (name.indexOf(areaName) > -1) {
                          return areaes[m].code;
                      }
                  }

                  return cities[j].code;
              }
          }
        
          return code;
      }


      return function(input) {
          if(input) {
              var addresses = input.toString().trim();
              return convertNameToCode(addresses);
          }
      };
  });
