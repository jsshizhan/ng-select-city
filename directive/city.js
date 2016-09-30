angular.module('city', []).directive('city', ["$parse","$timeout",function($parse,$timeout) {

  function link(scope, element, attrs) {
    scope.cities = CITY_CODE.cities;
    var city,area,currentValue;
    $timeout(function(){
      city= $('.city.ui.dropdown',element).dropdown({onChange:function(value, text, $choice){
       setValue(value,text);
       if (angular.element($choice).length > 0) {
         $timeout(function () {
           scope.areas = angular.element($choice).scope().city.areas
           if(value&&text)
              scope.callback({address:text,code:value,type:'city'});
         });
       }
      area.dropdown('clear');
      }
    })});

    $timeout(function(){
    area = $('.area.ui.dropdown', element).dropdown({
      onChange: function (value, text, $choice) {
        setValue(value,text);
        $timeout(function () {
          if(typeof value == 'string'&& text)
            scope.callback({address:text,code:value,type:'area'});
        });
      }
    })});

    function setValue(value,text) {
        if(scope.code!=value && value) {
            $timeout(function() {
              scope.code = value;
              currentValue = value;
            });

        }
    }

    function update(newValue) {
      if(newValue) {
        if(newValue != currentValue) {
          currentValue = newValue;
          newValue = newValue.toString();
          $timeout(function () {
            var cityCode = newValue.substr(0, 4) + "00";
            city.dropdown("set selected", cityCode);
            if (city.dropdown("get item", cityCode)) {
              scope.areas = city.dropdown("get item", cityCode).scope().city.areas;
              $timeout(function () {
                area.dropdown("set selected", newValue);
              });
            }
          });
        }
      }
      else{
        $timeout(function(){
          city.dropdown("clear");
          area.dropdown("clear");
        });
        
      }

    }

    scope.$watch('code', update);

      $timeout(function(){
          scope.code=attrs.default;
      });
  }

  return {
    link: link,
    scope: { code: '=',onlyCity:'=',callback:'&'},
    template:'<div class="city ui address search  selection  dropdown labeled"  style="margin-left:3%;width: 210px!important;min-width: 0!important;min-height: 30px!important;height:30px;padding-top: 7px!important;">'+
              '<i class="dropdown icon"></i>'+
             ' <span class="text default">市</span>'+
            ' <div class="menu">'+
             '   <div ng-repeat="city in cities" data-value="{{city.code}}"  class="item" ng-bind="city.name"></div>'+
             ' </div>'+
           ' </div>'+
           ' <div class="area address ui search selection  dropdown labeled"  style="margin-left:3%;width: 120px!important;min-width: 0!important;min-height: 30px!important;height:30px;padding-top: 7px!important;">'+
           '   <i class="dropdown icon"></i>'+
           '   <span class="text default">区/县</span>'+
           '   <div class="menu">'+
           '     <div ng-repeat="area in areas" data-value="{{area.code}}" class="item" ng-bind="area.name"></div>'+
           '   </div>'+
           ' </div>'
  };
}]);
