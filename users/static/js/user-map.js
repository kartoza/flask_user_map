function addBasemap() {
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="http://www.openstreetmap.org" target="_parent">OpenStreetMap</a> and contributors, under an <a href="http://www.openstreetmap.org/copyright" target="_parent">open license</a>',
    maxZoom: 18
  }).addTo(map);
}

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

function addUsersLayer() {
  $.ajax({
    type: "GET",
    url: "/users.json",
    dataType: 'json',
    success: function (response) {
      geojsonLayer = L.geoJson(
          response,
          {onEachFeature: onEachFeature}).
          addTo(map);
    }
  });
}

function onMapClick(e) {
    // Clear the un-saved clicked marker
  if (marker_new_user != null ) {
    cancelAddUser()
  }
  //Get new marker
  var markerLocation = e.latlng
  marker_new_user = L.marker(markerLocation)
  map.addLayer(marker_new_user);
  var form = '<h3 class="alert alert-info">Add Me As InaSAFE User!</h3>' +
      '<form id="add_user" enctype="multipart/form-data" class="well">' +
      '<label><strong>Name:</strong></label>' +
      '<input type="text" class="span3" placeholder="Required" id="name" name="name" />' +
      '<span name="error-name" id="error-name"></span>' +

      '<label><strong>Email:</strong></label>' +
      '<input type="text" class="span3" placeholder="Required" id="email" name="email" />' +
      '<span name="error-email" id="error-email"></span>' +

      '<label><strong>Role:</strong></label>' +
      '<input type="radio" name="role" value="false" checked> User  ' +
      '<input type="radio" name="role" value="true"> Developer</br>' +

      '<label><strong>Notifications:</strong></label>' +
      '<input type="checkbox" id="notification" name="notification" value="Yes" /> Receive project news and updates' +

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
  var name = $("#name").val();
  var email = $("#email").val();
  var role = $('input:radio[name=role]:checked').val();
  var notification;
  if ($('#notification').is(':checked')) {
    notification = "true";
  } else {
    notification = "false";
  }
  var latitude = $("#lat").val()
  var longitude = $("#lng").val()

  //Clear Form Message:
  $("span#error-name").removeClass("label label-important");
  $("span#error-email").removeClass("label label-important");
  $('#error-name').text('');
  $('#error-email').text('');

  $.ajax({
    type: "POST",
    url: "/add_user",
    data: {
      name: name,
      email: email,
      role: role,
      notification: notification,
      latitude: latitude,
      longitude: longitude
    },
    success: function (response){
      if (response.type.toString() == 'Error') {
        if(typeof response.name != 'undefined'){
          $("span#error-name").addClass("label label-important");
          $('#error-name').text(response.name.toString());
        }
        if(typeof response.email != 'undefined'){
          $("span#error-email").addClass("label label-important");
          $('#error-email').text(response.email.toString());
        }
      } else {
        L.geoJson(response).addTo(map);
        map.removeLayer(marker_new_user);
      }
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
