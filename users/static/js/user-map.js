/***--------------- START OF MAP COMPONENTS-------------***/
function initializeBaseMap() {
  base_map = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}' +
      '.png', {
    attribution: '© <a href="http://www.openstreetmap.org" target="_parent">OpenStreetMap</a> and contributors, under an <a href="http://www.openstreetmap.org/copyright" target="_parent">open license</a>',
    maxZoom: 18
  });
}

function initializeDataPrivacyControl() {
  data_privacy_control = L.Control.extend({
    options: {
      position: 'bottomleft'
    },
    onAdd: function (map) {
      var data_privacy_container = L.DomUtil.create('div',
          'leaflet-control-attribution');
      onDataPrivacyClick = function () {
        $('#data-privacy-modal').modal({
          backdrop: false
        });
      }
      data_privacy_container.innerHTML += "<a onclick='onDataPrivacyClick()'>Data Privacy</a>"

      //Prevent firing drag and onClickMap event when clicking this control
      var stop = L.DomEvent.stopPropagation;
      L.DomEvent
          .on(data_privacy_container, 'click', stop)
          .on(data_privacy_container, 'mousedown', stop)
          .on(data_privacy_container, 'dblclick', stop)
          .on(data_privacy_container, 'click', L.DomEvent.preventDefault);
      return data_privacy_container;
    }
  });
}

function initializeUserMenuControl() {
  // User Menu Control: Add User, Delete User
  user_menu_control = L.Control.extend({
    options: {
      position: 'topleft'
    },
    onAdd: function (map) {
      var user_menu_container = L.DomUtil.create('div',
          'user_menu_control');
      user_menu_container.innerHTML +=
          "<div class='btn-group-vertical'>" +
              "<button type='button' class='btn btn-default btn-sm user-menu-control' id='add-user-button' onclick='onAddMeButtonClick()' data-toggle='tooltip' data-original-title='Add me to map!'>" +
              "<span class='glyphicon glyphicon-user'></span>" +
              "</button>" +
              "<button type='button' class='btn btn-default btn-sm user-menu-control' id='delete-user-button' onclick='onDeleteMeButtonClick()' data-toggle='tooltip' data-original-title='Delete me from map!'>" +
              "<span class='glyphicon glyphicon-trash'></span>" +
              "</button>" +
              "<button type='button' class='btn btn-default btn-sm user-menu-control' id='download-button' onclick='onDownloadButtonClick()' data-toggle='tooltip' data-original-title='Download all users!'>" +
              "<span class='glyphicon glyphicon-download-alt'></span>" +
              "</button>" +
              "</div>"

      onAddMeButtonClick = function () {
        if (mode != 1) {
          activateAddUserState();
        }
      }

      onDeleteMeButtonClick = function () {
        if (mode != 2) {
          activateDeleteUserState();
        }
      }

      onDownloadButtonClick = function () {
        if (mode != 3) {
          activateDownloadState();
        }
      }

      //Prevent firing drag and onClickMap event when clicking this control
      var stop = L.DomEvent.stopPropagation;
      L.DomEvent
          .on(user_menu_container, 'click', stop)
          .on(user_menu_container, 'mousedown', stop)
          .on(user_menu_container, 'dblclick', stop)
          .on(user_menu_container, 'click', L.DomEvent.preventDefault);
      return user_menu_container
    }
  });
}

function initializeControls() {
  initializeDataPrivacyControl();
  initializeUserMenuControl();
}

function initializeIcons() {
  IconMarker = L.Icon.extend({
    options: {
      shadowUrl: '/static/img/shadow-icon.png',
      iconSize: [19, 32],
      shadowSize: [42, 35],
      iconAnchor: [12, 32],
      shadowAnchor: [12, 32],
      popupAnchor: [-2, -32]
    }
  });

  user_icon = new IconMarker({iconUrl: '/static/img/user-icon.png'});
  trainer_icon = new IconMarker({iconUrl: '/static/img/trainer-icon.png'});
  developer_icon = new IconMarker({iconUrl: '/static/img/developer-icon.png'});
}
/***---------- END OF MAP COMPONENTS------------------- ***/


/***-------------------- START OF STATE CONTROL----------------------- **/
function activateDefaultState() {
  mode = 0; // Change mode to default
  map.off('click', onMapClick); // Stop onMapclick listener
  $('#map').removeAttr('style'); // Remove all dynamic style to default one
  $('#delete-user-button').removeClass('active');
  $('#add-user-button').removeClass('active');
  $('#download-button').removeClass('active');
}

function activateAddUserState() {
  // Reset to Default State first
  activateDefaultState();
  // Set mode to add user mode
  mode = 1;
  // Set css button to active
  $('#add-user-button').addClass('active');
  //Process here:
  // Change cursor to crosshair
  $('#map').css('cursor', 'crosshair');
  // When location is found, do onLocationFoud
  map.on('locationfound', onLocationFound)
  // Locate map to location found
  map.locate({setView: true, maxZoom: 16});
  //Set Listener map onClick
  map.on('click', onMapClick)
}

function activateDeleteUserState() {
  // Reset to Default State first
  activateDefaultState();
  // Set mode to delete user mode
  mode = 2;
  // Set css button to active
  $('#delete-user-button').addClass('active');
  //Process here:
  alert("It's not implemented yet!");
  activateDefaultState();
}

function activateDownloadState() {
  // Reset to Default State first
  activateDefaultState();
  // Set mode to delete user mode
  mode = 3;
  // Set css button to active
  $('#download-button').addClass('active');
  //Process here:
  window.open('/download', '_self');
  activateDefaultState();
}

/***-------------------- END OF STATE CONTROL -------------------------**/

function onEachFeature(feature, layer) {
  // does this feature have a property named popupContent?
  if (feature.properties && feature.properties.popupContent) {
    layer.bindPopup(feature.properties.popupContent);
  }
}

function addUsers(layer, user_type) {
  $.ajax({
    type: "POST",
    url: "/users.json",
    dataType: 'json',
    data: {
      user_type: user_type
    },
    success: function (response) {
      var role_icon;
      if (user_type == 0) {
        role_icon = user_icon;
      } else if (user_type == 1) {
        role_icon = trainer_icon;
      } else if (user_type == 2) {
        role_icon = developer_icon;
      }
      L.geoJson(
          response.users,
          {
            onEachFeature: onEachFeature,
            pointToLayer: function (feature, latlng) {
              return L.marker(latlng, {icon: role_icon });
            }
          }).addTo(layer);
    }
  });
}

function refreshUserLayer() {
  users_layer.clearLayers();
  addUsers(users_layer, 0);
}

function refreshTrainerLayer() {
  trainers_layer.clearLayers();
  addUsers(trainers_layer, 1);
}

function refreshDeveloperLayer() {
  developers_layer.clearLayers();
  addUsers(developers_layer, 2)
}

function onLocationFound(e) {
  var radius = e.accuracy / 2;
  var label = "You are within " + radius + " meters from this point";
  // If estimated_location_circle exists, remove that circle first from map
  if (typeof estimated_location_circle != 'undefined') {
    map.removeLayer(estimated_location_circle);
  }
  estimated_location_circle = L.circle(e.latlng, radius, {clickable: false, fillOpacity: 0.1});
  estimated_location_circle.bindLabel(label, {noHide: true, direction: 'auto'}).addTo(map).showLabel();
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
          '</div>' +
          '<div class="panel-body">' +
          '<form action ="" role = "form-horizontal" id="add_user" enctype="multipart/form-data">' +
          '<div class="form-group" >' +
          '<div class="input-group input-group-sm">' +
          '<span class="input-group-addon">Name</span>' +
          '<input type="text" class="form-control" placeholder="Required" id="name" name="name" required/>' +
          '</div>' +
          '</div>' +

          '<div class="form-group">' +
          '<div class="input-group input-group-sm">' +
          '<span class="input-group-addon">Email</span>' +
          '<input type="email" class="form-control" placeholder="Required"  id="email" name="email" required/>' +
          '</div>' +
          '</div>' +

          '<div class="form-group">' +
          '<div class="input-group input-group-sm">' +
          '<span class="input-group-addon">Website</span>' +
          '<input type="url" class="form-control" placeholder="If filled, use http:// or https://." id="website" name="website" value="" pattern="https?://.+"/>' +
          '</div>' +
          '</div>' +

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
          '</div>' +

          '<div class="form-group">' +
          '<label for="label-email-updates">Email Updates</label>' +
          '<div class="input-group input-group-sm">' +
          '<span class="input-group-addon">' +
          '<input type="checkbox" id="email_updates" name="email_updates" value="Yes"/>' +
          '</span>' +
          '<span class="form-control">Receive project news and updates</span>' +
          '</div>' +
          '</div>' +

          '<div class="form-group">' +
          '<input style="display: none;" type="text" id="lat" name="lat" value="' + markerLocation.lat.toFixed(6) + '" />' +
          '<input style="display: none;" type="text" id="lng" name="lng" value="' + markerLocation.lng.toFixed(6) + '" />' +
          '</div>' +

          '<div class="form-group">' +
          '<div>' +
          '<button type="button" class="btn btn-primary" onclick="addUser()">Done!</button>  ' +
          '<button type="button" class="btn btn-default" onclick="cancelMarker()">Cancel</button>' +
          '</div>' +
          '</div>' +
          '</form>' +
          '</div>' +
          '</div>';
  marker_new_user.bindPopup(form).openPopup()
}

function validate_add_user_form(str_name, str_email, str_website) {
  var is_name_valid, is_email_valid, is_website_valid, is_all_valid;
  if (typeof document.createElement("input").checkValidity == "function") {
    // This browser support HTML5 Validation
    // Validate All by HTML5:
    is_name_valid = document.getElementById('name').checkValidity();
    is_email_valid = document.getElementById('email').checkValidity();
    is_website_valid = document.getElementById('website').checkValidity();
  } else {
    // This browser doesn't support HTML5 Validation. Use JS Validation instead
    is_name_valid = isRequiredSatistied(str_name);
    is_email_valid = isRequiredSatistied(str_email) && isEmailSatisfied(str_email);
    if (isRequiredSatistied(str_website)) {
      is_website_valid = isURLSatisfied(str_website);
    } else {
      is_website_valid = true;
    }
  }

  is_all_valid = is_name_valid && is_email_valid && is_website_valid;
  if (!is_name_valid) {
    $("#name").parent().addClass("has-error");
    $('#name').attr("placeholder", 'Name is required');
  }
  if (!is_email_valid) {
    $("#email").parent().addClass("has-error");
    $('#email').attr("placeholder", 'Email is required and needs to be valid email');
  }
  if (!is_website_valid) {
    $("#website").parent().addClass("has-error");
    $('#website').attr("placeholder", 'Website needs to be valid URL ');
  }
  return is_all_valid;
}

function addUser() {
  //Clear Form Message:
  $("#name").parent().removeClass("has-error");
  $("#email").parent().removeClass("has-error");

  var name = $("#name").val();
  var email = $("#email").val();
  var website = $("#website").val();
  var role = $('input:radio[name=role]:checked').val();
  var email_updates;
  if ($('#email_updates').is(':checked')) {
    email_updates = "true";
  } else {
    email_updates = "false";
  }
  var latitude = $("#lat").val();
  var longitude = $("#lng").val();

  var is_client_side_valid = validate_add_user_form(name, email, website);
  if (is_client_side_valid) {
    $.ajax({
      type: "POST",
      url: "/add_user",
      data: {
        name: name,
        email: email,
        website: website,
        role: role,
        email_updates: email_updates,
        latitude: latitude,
        longitude: longitude
      },
      success: function (response) {
        if (response.type.toString() == 'Error') {
          if (typeof response.name != 'undefined') {
            $("#name").parent().addClass("has-error");
            $('#name').attr("placeholder", response.name.toString());

          }
          if (typeof response.email != 'undefined') {
            $("#email").parent().addClass("has-error");
            $('#email').attr("placeholder", response.email.toString());
          }
        } else {
          //Clear marker
          cancelMarker();
          // Refresh Layer according to role
          if (role == '0') {
            refreshUserLayer();
          } else if (role == '1') {
            refreshTrainerLayer();
          } else if (role == '2') {
            refreshDeveloperLayer();
          }
          activateDefaultState(); // Back to default state
          $('#add-success-modal').modal({
            backdrop: false
          });
        }
      }
    });
  }
}

function cancelMarker() {
  map.removeLayer(marker_new_user);
}
