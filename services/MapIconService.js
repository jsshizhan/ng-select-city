/**
 * Created by Administrator on 2015-12-17.
 */
/**
 * Created by u133 on 2/2/15.
 */
app.service("MapIconService",function () {

  this.getIcon = function (type) {
      var iconUrl = "";
      var iconSize = [20,25];
      if(type == "from"){
        iconUrl = "images/leaflet/from.png";
      }
      else if(type == "to"){
        iconUrl = "images/leaflet/to.png";
      }
      else if(type == 'free'){
        iconUrl = "images/leaflet/green.png";
      }
      else if(type == 'one_order'){
        iconUrl = "images/leaflet/red.png";
      }
      else if(type == 'more_order'){
        iconUrl = "images/leaflet/yellow.png";
      }
      else{
        iconUrl = "images/leaflet/blue.png";
      }

      return L.icon({
        iconUrl : iconUrl,
        iconSize : iconSize
      });
  }

  this.getIconByType = function(type){
    var iconUrl = "";
    var iconSize = [20,25];
    if(type == "from"){
      iconUrl = "images/leaflet/from.png";
    }
    else if(type == "to"){
      iconUrl = "images/leaflet/to.png";
    }
    else if(type == 'green'){
      iconUrl = "images/leaflet/green.png";
    }
    else if(type == 'red'){
      iconUrl = "images/leaflet/red.png";
    }
    else if(type == 'yellow'){
      iconUrl = "images/leaflet/yellow.png";
    }
    else{
      iconUrl = "images/leaflet/blue.png";
    }

    return L.icon({
      iconUrl : iconUrl,
      iconSize : iconSize
    });
  }




});
