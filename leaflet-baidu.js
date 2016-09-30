/**
 * Projection class for Baidu Spherical Mercator
 *
 * @class BaiduSphericalMercator
 */
L.Projection.BaiduSphericalMercator = {
    /**
     * Project latLng to point coordinate
     *
     * @method project
     * @param {Object} latLng coordinate for a point on earth
     * @return {Object} leafletPoint point coordinate of L.Point
     */
    project: function(latLng) {
        var projection = new BMap.MercatorProjection();
        var point = projection.lngLatToPoint(
            new BMap.Point(latLng.lng, latLng.lat)
        );
        var leafletPoint = new L.Point(point.x, point.y);
        return leafletPoint;
    },

    /**
     * unproject point coordinate to latLng
     *
     * @method unproject
     * @param {Object} bpoint baidu point coordinate
     * @return {Object} latitude and longitude
     */
    unproject: function (bpoint) {
        var projection= new BMap.MercatorProjection();
        var point = projection.pointToLngLat(
            new BMap.Pixel(bpoint.x, bpoint.y)
        );
        var latLng = new L.LatLng(point.lat, point.lng);
        return latLng;
    },

    /**
     * Don't know how it used currently.
     *
     * However, I guess this is the range of coordinate.
     * Range of pixel coordinate is gotten from
     * BMap.MercatorProjection.lngLatToPoint(180, -90) and (180, 90)
     * After getting max min value of pixel coordinate, use
     * pointToLngLat() get the max lat and Lng.
     */
    bounds: (function () {
        var MAX_X= 20037726.37;
        var MIN_Y= -11708041.66;
        var MAX_Y= 12474104.17;
        var bounds = L.bounds(
            [-MAX_X, MIN_Y], //-180, -71.988531
            [MAX_X, MAX_Y]  //180, 74.000022
        );
        var MAX = 33554432;
        bounds = new L.Bounds(
            [-MAX, -MAX],
            [MAX, MAX]
        );
        return bounds;
    })()
};

/**
 * Coordinate system for Baidu EPSG3857
 *
 * @class BEPSG3857
 */
L.CRS.BEPSG3857 = L.extend({}, L.CRS, {
    code: 'EPSG:3857',
    projection: L.Projection.BaiduSphericalMercator,

    transformation: (function () {
        var z = -18 - 8;
        var scale = Math.pow(2, z);
        return new L.Transformation(scale, 0.5, -scale, 0.5);
    }())
});


d_ = function(a){
  for(var b={featureType:"t",elementType:"e",visibility:"v",color:"c",lightness:"l",saturation:"s", weight:"w",zoom:"z",hue:"h"},c={all:"all",geometry:"g","geometry.fill":"g.f","geometry.stroke":"g.s",labels:"l","labels.text.fill":"l.t.f","labels.text.stroke":"l.t.s","lables.text":"l.t","labels.icon":"l.i"},d=[],e=0,f;f=a[e];e++){var g=f.stylers;delete f.stylers;$.extend(f,g);var g=[],i;for(i in b)f[i]&&("elementType"===i?g.push(b[i]+":"+c[f[i]]):g.push(b[i]+":"+f[i]));2<g.length&&d.push(g.join("|"))}return d.join(",")
}

/**
 * Tile layer for Baidu Map
 *
 * @class BaiduLayer
 */
L.TileLayer.BaiduLayer = L.TileLayer.extend({
    options: {
        minZoom: 3,
        maxZoom: 19,
        subdomains: ['0', '1', '2']
    },

    initialize: function (url, options) {
        url = url || 'http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20150601';
          //'t%3Aland%7Ce%3Ag%7Cc%3A%23212121%2Ct%3Abuilding%7Ce%3Ag%7Cc%3A%232b2b2b%2Ct%3Ahighway%7Ce%3Aall%7Cl%3A-42%7Cs%3A-91%2Ct%3Aarterial%7Ce%3Ag%7Cl%3A-77%7Cs%3A-94%2Ct%3Agreen%7Ce%3Ag%7Cc%3A%231b1b1b%2Ct%3Awater%7Ce%3Ag%7Cc%3A%23181818%2Ct%3Asubway%7Ce%3Ag.s%7Cc%3A%23181818%2Ct%3Arailway%7Ce%3Ag%7Cl%3A-52%2Ct%3Aall%7Ce%3Al.t.s%7Cc%3A%23313131%2Ct%3Aall%7Ce%3Al.t.f%7Cc%3A%238b8787%2Ct%3Amanmade%7Ce%3Ag%7Cc%3A%231b1b1b%2Ct%3Alocal%7Ce%3Ag%7Cl%3A-75%7Cs%3A-91%2Ct%3Asubway%7Ce%3Ag%7Cl%3A-65%2Ct%3Arailway%7Ce%3Aall%7Cl%3A-40%2Ct%3Ahighway%7Ce%3Al.t.f%7Cc%3A%2338761d%7Cl%3A45%7Cs%3A-43%7Cw%3A0.8%7Ch%3A%2338761d'//+encodeURIComponent(JSON.stringify(styleJson));//'http://{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl';
        L.TileLayer.prototype.initialize.call(this, url, options);
    },

    getTileUrl: function (coords) {
        var offset = Math.pow(2, coords.z - 1),
            x = coords.x - offset,
            y = offset - coords.y - 1,
            baiduCoords = L.point(x, y);
        baiduCoords.z = coords.z;
        return L.TileLayer.prototype.getTileUrl.call(this, baiduCoords);
    }
});

L.tileLayer.baiduLayer = function (url, options) {
    return new L.TileLayer.BaiduLayer(url, options);
};
