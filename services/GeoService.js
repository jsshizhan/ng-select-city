/**
 * Created by u133 on 2/2/15.
 */
app.service("GeoService", ["$http", function ($http) {

    this.reverseGeoCoding = function (lnglat,callback) {
        var reverseGeoUrl = "http://api.map.baidu.com/geocoder/v2/?ak="+baidu_ak+"&callback=JSON_CALLBACK&location=" + lnglat.lat + "," + lnglat.lng + "&output=json&pois=1";

        return $http.jsonp(reverseGeoUrl)
            .success(function (data) {
                callback( data.result && data.result.formatted_address);
            })
    }

  this.reverseGeoCodingDetail = function (lnglat,callback) {
    var reverseGeoUrl = "http://api.map.baidu.com/geocoder/v2/?ak="+baidu_ak+"&callback=JSON_CALLBACK&location=" + lnglat.lat + "," + lnglat.lng + "&output=json&pois=1";
    return $http.jsonp(reverseGeoUrl)
      .success(function (data) {
        callback( data.result);
      })
  }

    this.geoCoding=function(address,city,callback) {
        var geoUrl = 'http://api.map.baidu.com/geocoder/v2/?ak='+baidu_ak+'&callback=JSON_CALLBACK&output=json&address='+address+'&city='+city;
        return $http.jsonp(geoUrl)
            .success(function (data) {
                callback( data.result && data.result.location);
            })
    }




  this.placeSearchs = function(query,region,pageSize,callback){
    if(query){
      region = region || '江苏省';
      pageSize = pageSize || 1;
      $http.jsonp('http://api.map.baidu.com/place/v2/search?query='+query+'&page_size='+pageSize+'&region='+region+'&scope=2&output=json&ak='+baidu_ak+'&callback=JSON_CALLBACK').success(function(success){
        if(success.results&&success.results.length >= 1) {
          callback(success.results);
        }
        else {
          callback(success.results);
          toastr.warning('没有此地址信息');
        }
      }).error(function(error){
        toastr.error('获取百度地址信息数据失败');
      });
    }
  }

   
}]);
