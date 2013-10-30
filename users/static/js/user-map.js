function onEachFeature(feature, layer) {
  // does this feature have a property named popupContent?
  if (feature.properties && feature.properties.popupContent) {
      layer.bindPopup(feature.properties.popupContent);
  }
}

function addUsersLayer(users_layer, developers_layer, trainers_layer) {
  $.ajax({
    type: "GET",
    url: "/users.json",
    dataType: 'json',
    success: function (response) {
      L.geoJson(
          response.users,
          {
            onEachFeature: onEachFeature,
            pointToLayer: function (feature, latlng) {
              return L.marker(latlng, {icon: user_icon });
            }
          }).addTo(users_layer);
      L.geoJson(
          response.developers,
          {
            onEachFeature: onEachFeature,
            pointToLayer: function (feature, latlng) {
              return L.marker(latlng, {icon: developer_icon });
            }
          }).addTo(developers_layer);
      L.geoJson(
          response.trainers,
          {
            onEachFeature: onEachFeature,
            pointToLayer: function (feature, latlng) {
              return L.marker(latlng, {icon: trainer_icon });
            }
          }).addTo(trainers_layer);
    }
  });
}

function onLocationFound(e) {
  var radius = e.accuracy/2;
  var label = "You are within " + radius + " meters from this point";
  L.circle(e.latlng, radius, {clickable:false, fillOpacity:0.1}).bindLabel(label, {noHide: true, direction:'auto'}).addTo(map).showLabel();


}

function onMapClick(e) {
  // Clear the un-saved clicked marker
  if (marker_new_user != null) {
    cancelMarker();
  }
  //Get new marker
  var markerLocation = e.latlng;
  marker_new_user = L.marker(markerLocation);
  map.addLayer(marker_new_user);
  var form = '<h3 class="alert alert-info">Add me as an InaSAFE user!</h3>' +
      '<form id="add_user" enctype="multipart/form-data" class="well">' +
      '<label><strong>Name:</strong></label>' +
      '<input type="text" class="span3" placeholder="Required" id="name" name="name" />' +
      '<span name="error-name" id="error-name"></span>' +

      '<label><strong>Email:</strong></label>' +
      '<input type="text" class="span3" placeholder="Required" id="email" name="email" />' +
      '<span name="error-email" id="error-email"></span>' +

      '<label><strong>Role:</strong></label>' +
      '<input type="radio" name="role" value="0" checked> User  ' +
      '<input type="radio" name="role" value="1"> Trainer  ' +
      '<input type="radio" name="role" value="2"> Developer</br>' +

      '<label><strong>Notifications:</strong></label>' +
      '<input type="checkbox" id="email_updates" name="email_updates" value="Yes" /> Receive project news and updates' +

      '<input style="display: none;" type="text" id="lat" name="lat" value="' + markerLocation.lat.toFixed(6) + '" />' +
      '<input style="display: none;" type="text" id="lng" name="lng" value="' + markerLocation.lng.toFixed(6) + '" /><br><br>' +

      '<div class="row-fluid">' +
      '<div class="span6" style="text-align:center;"><button type="button" class="btn" onclick="cancelMarker()">Cancel</button></div>' +
      '<div class="span6" style="text-align:center;"><button type="button" class="btn btn-primary" onclick="addUser()">Done!</button></div>' +
      '</div>' +
      '</form>'

  marker_new_user.bindPopup(form).openPopup()
}

function addUser() {
  var name = $("#name").val();
  var email = $("#email").val();
  var role = $('input:radio[name=role]:checked').val();
  var email_updates;
  if ($('#email_updates').is(':checked')) {
    email_updates = "true";
  } else {
    email_updates = "false";
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
      email_updates: email_updates,
      latitude: latitude,
      longitude: longitude
    },
    success: function (response) {
      if (response.type.toString() == 'Error') {
        if (typeof response.name != 'undefined') {
          $("span#error-name").addClass("label label-important");
          $('#error-name').text(response.name.toString());
        }
        if (typeof response.email != 'undefined') {
          $("span#error-email").addClass("label label-important");
          $('#error-email').text(response.email.toString());
        }
      } else {
        cancelMarker()
        mode = 0
        $('#add-success-modal').modal('show');
        if (role == '0') {
          L.geoJson(response).addTo(users_layer);
        } else if (role == '1') {
          L.geoJson(response).addTo(trainers_layer);
        } else if (role == '2') {
          L.geoJson(response).addTo(developers_layer);
        }
      }
    }
  });
}

function cancelMarker() {
  map.removeLayer(marker_new_user);
}

function downloadShape(map) {
  var url = '/buildings-shp?bbox=' + map.getBounds().toBBoxString();
  console.log('New url: ' + url + ' <--');
  window.location.replace(url);
}
