var map;
var markers = [
  {lat: -25.363, lng: 131.044},
  {lat: -25.362, lng: 131.043},
]

document.addEventListener("DOMContentLoaded", function(event) {
  document.getElementById("files").addEventListener("change",function() {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      var text = reader.result;
      parseIPs(text);
    }

    reader.readAsText(file);
  })
});

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.7697, lng: -122.3933},
    zoom: 8
  });
  // fetchLatLng();
  // parseIPs();
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
    dropMarker({lat: res.latitude, lng: res.longitude});
  });
}

function parseIPs(res) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(res, "text/html");
  var ips = [];
  var metaData = [];


  var hTags = doc.getElementsByTagName("h2");
  var searchText = "IP Addresses";
  var found;

  for (var i = 0; i < hTags.length; i++) {
    if (hTags[i].textContent == searchText) {
      found = i;
      break;
    }
  }

  var liips = doc.getElementsByTagName("h2")[found].nextSibling.childNodes;
  for (var i = 0; i < liips.length; i++) {
    ips.push(liips[i].innerText);


  }
  ips.forEach(ip => {
    fetchLatLng(ip);
  });

}
