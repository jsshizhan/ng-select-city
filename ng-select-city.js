/**
 * Created by Administrator on 2016/9/23.
 */
 if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
      module.exports = 'ng-select-city';
}

angular.module('ng-select-city', ['city']).directive('ngSelectCity',function($http, $timeout,$filter,GeoService,MapIconService){
  function link(scope, element, attrs){

    //ÏÂÀ­²Ëµ¥
    $('.ui.dropdown')
      .dropdown()
    ;

    //ÇÐ»»±êÇ©
    $('.tabular.menu .item')
      .tab({history:false});
	  
	  var map = new L.map('map',{'crs': L.CRS.BEPSG3857,zoomControl:false });
	  scope.map = map;
	  scope.map.setView([31.568, 120.299], 6);
      
      var baiduLayer = new L.TileLayer.BaiduLayer();
      scope.map.addLayer(baiduLayer);

    // var markers = L.markerClusterGroup({ disableClusteringAtZoom: 11 });
    var markerArray = [];
    var markerGroup = L.featureGroup();
    var icon = MapIconService.getIcon();
    var selectMarker;
    var areaNameFilter = $filter('areaName');

    var addressChoiceModal = $('.ui.modal.addressChoice').modal({
      closable: false,
      autofocus: false,
      detachable: false
    })

    element.find('.entry').on('click',function(){
      $timeout(function(){
        scope.map.invalidateSize();
      });
      var initMarker = L.marker([40.847461, 111.758518], {
        icon: icon
      });
      markerArray.push(initMarker);
      scope.map.addLayer(markerGroup);
      fitMap();
      addressChoiceModal.modal('show');
    });

    scope.cancel = function(){
      addressChoiceModal.modal('hide');
    }
    scope.sure = function(){
      if(!scope.uid&&!scope.historyAddressId&&!scope.id){
        toastr.warning('ÇëÑ¡ÔñÒ»ÌõÊý¾Ý');
        return;
      }
      scope.detail = selectMarker.content;
      scope.code = selectMarker.code;
      addressChoiceModal.modal('hide');
      storedb('history_address').insert({"detail":scope.detail,"code":scope.code,"time":new Date(),"lat":selectMarker.getLatLng().lat,"lng":selectMarker.getLatLng().lng});
    }

    scope.callback = function(text,code,type){
      setValue(text,type);
      if(scope.searchField){
        scope.searchAddress();
        return;
      }
      GeoService.geoCoding(text,'',function(result){
        clearMarkers();
        if(!result)
          return;
        var cityMarker = L.marker([result.lat,result.lng], {
          icon: icon
        });
        markerArray.push(cityMarker);
        fitMap(code);
      });
    }

    scope.searchAddress = function(){
      if(!scope.cityCode){
        toastr.warning('请选择城市');
        return;
      }
      changeTab();
      clearMarkers();
      GeoService.placeSearchs((scope.areaName && scope.areaName != 'È«¾³')?scope.areaName+scope.searchField:'' + scope.searchField,scope.cityName,10,function(results){
        if(!results || results.length == 0){
          scope.searchResult = [];
          return;
        }
        scope.searchResult = results;
        scope.map.setView([results[0].location.lat, results[0].location.lng], 16);
        var index = 0;
        results.forEach(function(result){
          var marker = L.marker([result.location.lat,result.location.lng], {
            icon: icon
          });
          marker.content = result.name;
          marker.uid = result.uid = result.uid||index++;
          marker.on('click',function(e){
            selectMarker = e.target;
            scope.selectAddress(selectMarker.uid);
          });
          markerArray.push(marker);
        });
        fitMap();
      });
    }

    scope.addressSearch = function(){
      scope.searchAddress();
    }

    scope.selectHistoryAddress = function(item){
      clearIds();
      $timeout(function(){
        scope.historyAddressId = item._id;
      },0);
      clearMarkers();
      selectMarker = L.marker([item.lat,item.lng]);
      selectMarker.content = item.detail;
      scope.map.addLayer(selectMarker);
      selectMarkerF();
    }

    scope.selectAddress = function(uid){
      clearIds();
      $timeout(function(){
        scope.uid = uid;
      },0);
      resetMarkerColor();
      markerGroup.eachLayer(function(marker){
        if(uid == marker.uid){
          selectMarker = marker;
          selectMarker.code = scope.cityCode;
          selectMarkerF();
          // selectMarker2City();
        }
      });
    }


    scope.historyAddressSearch = function(){
      scope.historyAddresses = storedb('history_address').find().reverse();
    }

    scope.commonAddreses = [{'id':1,'code':'330328','detail':'21321321321','lat':'38.094046','lng':'114.497168'},
      {'id':2,'code':'330328','detail':'21321321321','lat':'38.074107','lng':'114.545182'},{'id':3,'code':'330328','detail':'21321321321','lat':'38.079007','lng':'114.513212'}];

    scope.selectCommonAddress = function(item){
      clearIds();
      $timeout(function(){
        scope.id = item.id;
      },0);
      clearMarkers();
      selectMarker = L.marker([item.lat,item.lng]);
      selectMarker.content = item.detail;
      selectMarker.code = item.code;
      scope.map.addLayer(selectMarker);
      selectMarkerF();
    }

    function clearIds(){
      scope.uid = '';
      scope.historyAddressId='';
      scope.id='';
    }

    function selectMarker2City(){
      GeoService.reverseGeoCodingDetail(selectMarker.getLatLng(),function(result){
        scope.areaName = result.addressComponent.district;
        $timeout(scope.cityCode = areaNameFilter(scope.cityName+scope.areaName));
      });
    }

    function setValue(text,type){
      if(type == 'city'){
        scope.cityName = text;
        scope.areaName = '';
      }
      if(type == 'area'){
        scope.areaName = text;
      }
    }

    function changeTab(){
      $.tab('change tab','searchResult');
      $('.item').removeClass('active');
      $('#searchResult').addClass('active');
    }

    function fitMap(code){
      markerGroup.initialize(markerArray);
      // markers.addLayer(cityMarker);
      if(code)
        scope.map.fitBounds(markerGroup.getBounds(),{maxZoom:getMaxZoom(code)});
      else
        scope.map.fitBounds(markerGroup.getBounds());
    }

    function getMaxZoom(code){
      code = code.toString();
      return code.substr(code.length - 2) == '00'?10:15;
    }

    function clearMarkers(){
      // markers.clearLayers();
      if(selectMarker)
        scope.map.removeLayer(selectMarker);
      markerArray.length = 0;
      markerGroup.clearLayers();
    }

    function resetMarkerColor(){
      markerGroup.eachLayer(function(marker){
        marker.setIcon(icon);
      });
    }

    function selectMarkerF(){
      selectMarker.setIcon(MapIconService.getIconByType('red'));
      scope.map.panTo([selectMarker.getLatLng().lat,selectMarker.getLatLng().lng]);
      L.popup()
        .setLatLng(L.latLng(selectMarker.getLatLng().lat, selectMarker.getLatLng().lng))
        .setContent("<font color='	#000000'>" + selectMarker.content + "</font></p>")
        .openOn(scope.map);
    }

    scope.clearCache = function(){
      storedb('history_address').remove();
    }

  }

  return {
    scope: {code: '=',detail:'='},
    restrict: 'E',
    link: link,
    template: '<input class="entry" type="text" placeholder="" style="width: auto" ng-readonly="true" ng-model="detail">'+
              '    <div class="ui modal addressChoice" style="width: 1100px!important;">'+
              '    <!--<i class="close icon inner dialog-icon-color"></i>-->'+
              '    <span class="actions modal-icon fr" style="position: absolute;right: 0;background: none;top: -1em;">'+
              '        </span>'+
              '    <div class="header bg-0 width-58 fl" style="border: none !important;">地址选取</div>'+
              '    <div class="header bg-0 width-38 fr" style="border: none !important;">坐标选择</div>'+
              '    <div class="content" style="clear: both;padding-top: 0;padding: 1.5rem !important;">'+
              '     <div class="ui grid">'+
              '       <div class="ten wide column">'+
              '         <div class="ui grid" style="border-bottom: 1px dashed #999;padding-bottom: 1em;">'+
              '          <div class="ten wide column"  style="padding-right: 0!important;">'+
              '            <city code="cityCode"  callback="callback(address,code,type)">'+
              '            </city>'+
              '     </div>'+
              '      <div class="six wide column padding-0" style="width: 33%!important;">'+
              '         <div class="ui search">'+
              '            <div class="ui icon input">'+
              '               <input ng-model="searchField" type="text" placeholder="详细地址" style="height: 30px !important;margin-top: 0 !important;">'+
              '                <button class="ui icon button" ng-click="searchAddress()" style="height: 30px">'+
              '                <i class="search icon" style="margin-top: -5px"></i>'+
              '                 </button>'+
              '               </div>'+
              '              <div class="results"></div>'+
              '           </div>'+
              '        </div>'+
              '     </div>'+
              '    <div class="sixteen wide column" style="margin-top: 1em;"><button ng-click="clearCache()">清空缓存</button>'+
              '     <div class="ui tabular menu" style="padding: 0.8em 0 0 0.8em;height: 36px;">'+
              '      <a class="item active" style="padding: 0em 2em !important;" data-tab="commonAddress">'+
              '       <div>常用</div>'+
              '    </a>'+
              '    <a class="item " style="padding: 0em 2em !important;" data-tab="historyAddress" ng-click="historyAddressSearch()">'+
              '      <div>历史</div>'+
              '    </a>'+
              '    <a class="item " style="padding: 0em 2em !important;" data-tab="searchResult" id="searchResult" ng-click="addressSearch()">'+
              '      <div>搜索结果</div>'+
              '    </a>'+
              '  </div>'+
              '  <div class="ui bottom attached tab segment active mt-1 commonHeightBoxScroll" id="commonAddressBoxScroll"'+
              '      style="border: 0 !important;" data-tab="commonAddress">'+
              '      <table class="ui very basic table">'+
              '        <tbody>'+
              '        <tr ng-repeat="item in commonAddreses" ng-class="{true:\'choose\',false:\'\'}[id==item.id]" ng-click="selectCommonAddress(item)">'+
              '          <td><div ng-class="{true:\'ui label red\',false:\'ui label\'}[id==item.id] ">{{$index+1}}</div></td>'+
              '          <td>{{item.code}}</td>'+
              '          <td>{{item.detail}}</td>'+
              '        </tr>'+
              '        </tbody>'+
              '      </table>'+
              '  </div>'+
              '  <div class="ui bottom attached tab segment mt-1 commonHeightBoxScroll" id="historyAddressBoxScroll"'+
              '       style="border: 0 !important;overflow :scroll;overflow-x: hidden;padding: 1em 0;margin-top: 15px" data-tab="historyAddress">'+
              '      <table class="ui very basic table">'+
              '        <tbody>'+
              '        <tr ng-repeat="item in historyAddresses" ng-class="{true:\'choose\',false:\'\'}[historyAddressId==item._id]" ng-click="selectHistoryAddress(item)">'+
              '          <td><div ng-class="{true:\'ui label red\',false:\'ui label\'}[historyAddressId==item._id] ">{{$index+1}}</div></td>'+
              '          <td>{{item.code}}</td>'+
              '         <td>{{item.detail}}</td>'+
              '        </tr>'+
              '        </tbody>'+
              '      </table>'+
              '  </div>'+
              '  <div class="ui bottom attached tab segment mt-1 commonHeightBoxScroll"'+
              '       style="border: 0 !important;overflow :scroll;overflow-x: hidden;padding: 1em 0;margin-top: 15px" data-tab="searchResult">'+
              '      <table class="ui very basic table">'+
              '        <tbody>'+
              '        <tr ng-repeat="item in searchResult" ng-class="{true:\'choose\',false:\'\'}[uid==item.uid]" ng-click="selectAddress(item.uid)">'+
              '          <td style="width: 35px"><div ng-class="{true:\'ui label red\',false:\'ui label\'}[uid==item.uid] ">{{$index + 1}}</div>'+
              '          <td><div style="color: rgb(51,133,255);">{{item.name}}</div>'+
              '          <div>{{item.address}}</div>'+
              '          </td>'+
              '        </tr>'+
              '        </tbody>'+
              '      </table>'+
              '  </div>'+
              '</div>'+
              '<div class="sixteen wide column">'+
              '  <button class="ui teal button" ng-click="sure()">确定</button>'+
              '  <button class="ui red button" ng-click="cancel()">取消</button>'+
              '</div>'+
              '</div>'+
              '<div class="six wide column">'+
              '  <div>'+
              '<div id="map" class="car-map-height"  style="min-height: 522px;height: 372px;"></div>'+
              '  </div>'+
              '</div>'+
              '</div>'+
              '</div>'+
              '</div>'
  }
})
