var map;
var readers = [];
var messages = {
  a: [],
  b: [],
  c: [],
  d: [],
  e: [],
  f: [],
  g: [],
  h: [],
  i: [],
  j: [],
  k: [],
  l: [],
  m: [],
  n: [],
  o: [],
  p: [],
  q: [],
  r: [],
  s: [],
  t: [],
  u: [],
  v: [],
  w: [],
  x: [],
  y: [],
  z: [],
  und: [],
}

var markers = [
  {lat: -25.363, lng: 131.044},
  {lat: -25.362, lng: 131.043},
]

var parser = new DOMParser();

document.addEventListener("DOMContentLoaded", function(event) {
  // document.getElementById("security").addEventListener("change",function() {
  //   var file = this.files[0];
  //   var reader = new FileReader();
  //   reader.onload = function(e) {
  //     var text = reader.result;
  //     parseIPs(text);
  //   }
  //
  //   reader.readAsText(file);
  // })

  document.getElementById("messages").addEventListener("change",function() {
    for (var i=0; i<this.files.length; i++) {
      readers.push(new FileReader);
      readers[i].onload = function(e) {
        parseMessage(e.target.result);
      }
    }
    for (var i=0; i<this.files.length; i++) {
      readers[i].readAsText(this.files[i]);
    }
  })

  document.getElementById("chat").addEventListener("keypress",function(e) {
    if (e.keyCode === 13) {
      const message_input = document.getElementById("chat").value;
      document.getElementById('response').innerHTML = "<ul>"+message_input+"</ul>" + document.getElementById('response').innerHTML;
      document.getElementById("chat").value = '';
      generateResponse(message_input);
    }
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

function parseMessage(message) {
  var doc = parser.parseFromString(message, "text/html");
  var unparsed = doc.getElementsByTagName("p");
  for (var i = 1; i < unparsed.length; i++) {
    if (unparsed[i].innerText[0]) {
      if (unparsed[i].innerText[0].match(/^[a-zA-Z]$/)) {
        if (unparsed[i-1].innerText) {
          messages[unparsed[i].innerText[0].toLowerCase()].push({
            sent: unparsed[i].innerText,
            response: unparsed[i-1].innerText,
          })
        }
      } else {
        if (unparsed[i-1].innerText) {
          messages.und.push({
            sent: unparsed[i].innerText,
            response: unparsed[i-1].innerText,
          })
        }
      }
    }
  }

}

function generateResponse(input) {
  const clean = input.toLowerCase();
  var candidates = {
    count: 0,
    messages: [

    ]
  };

  for (var i=0; i<messages[clean[0]].length; i++) {
    var currentCount = 0;
    for (var j=0; j<clean.length; j++) {
      if (messages[clean[0]][i].sent[j]) {
        if (clean[j] === messages[clean[0]][i].sent[j].toLowerCase()) {
          currentCount++;
        }
      }
    }
    if (currentCount < candidates.count) {

    } else if (currentCount === candidates.count) {
      candidates.messages.push(messages[clean[0]][i])
    } else if (currentCount > candidates.count) {
      candidates.count = currentCount;
      candidates.messages = [
        messages[clean[0]][i]
      ]
    }
  }

  console.log(candidates);

  document.getElementById('response').innerHTML = "<ul>" + candidates.messages[Math.floor(Math.random()*candidates.messages.length)].response + "</ul>" + document.getElementById('response').innerHTML;
}
