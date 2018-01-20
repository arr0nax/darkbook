var map;
var markers = [
  {lat: -25.363, lng: 131.044},
  {lat: -25.362, lng: 131.043},
]

function initMap() {
  console.log('hello');
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.7697, lng: -122.3933},
    zoom: 8
  });
  // fetchLatLng();
  parseIPs();
}

function dropMarker(marker) {
  var pin = new google.maps.Marker({
    position: marker,
    map: map
  });
}

function fetchLatLng(ip) {
  fetch('http://freegeoip.net/json/'+ip).then(function(res) {
    return res.json();
  }).then(function(res) {
    console.log(res);
    dropMarker({lat: res.latitude, lng: res.longitude});
  });
}

function parseIPs() {
  fetch('security.htm').then(function(res) {
    return res.text();
  }).then(function(res) {
    console.log(res);
    var parser = new DOMParser();
    var doc = parser.parseFromString(res, "text/html");
    console.log(doc);
    var ips = [];
    var metaData = [];


    var hTags = doc.getElementsByTagName("h2");
    console.log(hTags);
    var searchText = "IP Addresses";
    var found;

    for (var i = 0; i < hTags.length; i++) {
      console.log(hTags[i]);
      if (hTags[i].textContent == searchText) {
        found = i;
        break;
      }
    }

    console.log(found);

    var liips = doc.getElementsByTagName("h2")[found].nextSibling.childNodes;
    console.log(liips);
    for (var i = 0; i < liips.length; i++) {
      ips.push(liips[i].innerText);
      

    }
    console.log(ips);
    ips.forEach(ip => {
      fetchLatLng(ip);
    });
  });

}
