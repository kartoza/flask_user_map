function addBasemap(){
   L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="http://www.openstreetmap.org" target="_parent">OpenStreetMap</a> and contributors, under an <a href="http://www.openstreetmap.org/copyright" target="_parent">open license</a>',
      maxZoom: 18
    }).addTo(map);
}

function addUsersLayer(){
  $.ajax({
      type: "GET",
      url: "/users.json",
      dataType: 'json',
      success: function (response) {
        geojsonLayer = L.geoJson(response).addTo(map);
      }
    });
}

function onMapClick(e) {
  var markerLocation = e.latlng
  marker_new_user = L.marker(markerLocation)
  map.addLayer(marker_new_user);
  var form = '<h3 class="alert alert-info">Add Me As InaSAFE User!</h3>'+
      '<form id="add_user" enctype="multipart/form-data" class="well">' +
      '<label><strong>Name:</strong></label>' +
      '<input type="text" class="span3" placeholder="Required" id="name" name="name" />' +

      '<label><strong>Email:</strong></label>' +
      '<input type="text" class="span3" placeholder="Required" id="email" name="email" />' +

      '<label><strong>Role:</strong></label>' +
      '<input type="radio" name="role" value="No"> User  '+
      '<input type="radio" name="role" value="Yes" checked> Developer</br>'+

      '<label><strong>Notifications:</strong></label>' +
      '<input type="checkbox" name="notification" value="Yes" /> Receive project news and updates' +

      '<input style="display: none;" type="text" id="lat" name="lat" value="' + markerLocation.lat.toFixed(6) + '" />' +
      '<input style="display: none;" type="text" id="lng" name="lng" value="' + markerLocation.lng.toFixed(6) + '" /><br><br>' +

      '<div class="row-fluid">' +
      '<div class="span6" style="text-align:center;"><button type="button" class="btn" onclick="cancelAddUser()">Cancel</button></div>' +
      '<div class="span6" style="text-align:center;"><button type="button" class="btn btn-primary" onclick="addUser()">Done!</button></div>' +
      '</div>' +
      '</form>'
    marker_new_user.bindPopup(form).openPopup()
}

function addUser() {
  $.ajax({
        type: "GET",
        url: "/add_user",
        dataType: 'json',
        success: function (response) {
          geojsonLayer = L.geoJson(response).addTo(map);
        }
      });
}

function cancelAddUser() {
  map.removeLayer(marker_new_user);
}

function onLocationFound(e) {
  var radius = e.accuracy / 2;
  L.marker(e.latlng).addTo(map)
      .bindPopup("You are within " + radius + " meters from this point")
      .openPopup();
  L.circle(e.latlng, radius).addTo(map);
}

function downloadShape(map) {
  var url = '/buildings-shp?bbox=' + map.getBounds().toBBoxString();
  console.log('New url: ' + url + ' <--');
  window.location.replace(url);
}
