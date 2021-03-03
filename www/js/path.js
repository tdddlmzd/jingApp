app.controller('pathController', function($scope) {


    var map = L.map('map').setView([31.292088, 121.495623], 2);
    var url = 'http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}';
    L.tileLayer(url, {
        foo: 'bar',
        attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> Haut-Gis-Org',
        zoom: 2, //地图缩放大小
        center: L.latLng([31.292088, 121.495623]),
        id: 'mapbox.streets'
    }).addTo(map);

    // 创建layer
    var tileUrl = 'http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}',
        layer = new L.TileLayer(tileUrl, {});
    //给map条件layer
    map.addLayer(layer);

    //实际路径
    var executeList = [
        [22.54784, 113.97779],
        [22.54685, 113.98079]
    ];
    if (executeList.length > 0) {
        //map.fitBounds(executeList);
        new L.polyline(executeList, {
            color: '#0983f8'
        }).addTo(map); //线条颜色
    }


});