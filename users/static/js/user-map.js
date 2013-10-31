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
  var form =
      '<div class="panel panel-default">' +
          '<div class="panel-heading">' +
            '<h3 class="panel-title">InaSAFE User Form</h3>' +
          '</div>'+
          '<div class="panel-body">'+
            '<form role = "form-horizontal" id="add_user" enctype="multipart/form-data">' +
              '<div class="form-group" >' +
                  '<div class="input-group input-group-sm">' +
                    '<span class="input-group-addon">Name</span>' +
                    '<input type="text" class="form-control" placeholder="Required" id="name" name="name" />' +
                  '</div>' +
              '</div>'+

              '<div class="form-group">' +
                  '<div class="input-group input-group-sm">' +
                    '<span class="input-group-addon">Email</span>' +
                    '<input type="text" class="form-control" placeholder="Required" id="email" name="email" />' +
                  '</div>' +
              '</div>'+

              '<div class="form-group">' +
                    '<label for="label-role">Role</label>' +
                    '<div class="input-group input-group-sm">' +
                      '<span class="input-group-addon">' +
                        '<input type="radio" name="role" value="0" checked>' +
                      '</span>' +
                      '<span class="form-control"><small>User</small></span>' +
                      '<span class="input-group-addon">' +
                        '<input type="radio" name="role" value="1">' +
                      '</span>' +
                      '<span class="form-control"><small>Trainer</small></span>' +
                      '<span class="input-group-addon">' +
                        '<input type="radio" name="role" value="2">' +
                      '</span>' +
                      '<span class="form-control" ><small>Developer</small></span>' +
                    '</div>' +
              '</div>'+

              '<div class="form-group">' +
                  '<label for="label-email-updates">Email Updates</label>' +
                  '<div class="input-group input-group-sm">' +
                    '<span class="input-group-addon">' +
                      '<input type="checkbox" id="email_updates" name="email_updates" value="Yes" />' +
                    '</span>' +
                    '<span class="form-control">Receive project news and updates</span>' +
                  '</div>' +
              '</div>'+

              '<div class="form-group">' +
                '<input style="display: none;" type="text" id="lat" name="lat" value="' + markerLocation.lat.toFixed(6) + '" />' +
                '<input style="display: none;" type="text" id="lng" name="lng" value="' + markerLocation.lng.toFixed(6) + '" />' +
              '</div>' +

              '<div class="form-group">' +
                  '<div>'+
                   '<button type="button" class="btn btn-primary" onclick="addUser()">Done!</button>  ' +
                   '<button type="button" class="btn btn-default" onclick="cancelMarker()">Cancel</button>'+
                  '</div>'+
              '</div>' +
            '</form>' +
          '</div>'+
      '</div>'

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
  $("#name").parent().removeClass("has-error");
  $("#email").parent().removeClass("has-error");

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
          $("#name").parent().addClass("has-error");
          $('#name').attr("placeholder",response.name.toString());
        }
        if (typeof response.email != 'undefined') {
          $("#email").parent().addClass("has-error");
          $('#email').attr("placeholder",response.email.toString());
        }
      } else {
        cancelMarker()
        mode = 0
        $('#add-success-modal').modal({
          backdrop: false
        });
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
