/***--------------- START OF MAP COMPONENTS-------------***/
function initializeBaseMap() {
  base_map = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}' +
      '.png', {
    attribution: '© <a href="http://www.openstreetmap.org" target="_parent">OpenStreetMap</a> and contributors, under an <a href="http://www.openstreetmap.org/copyright" target="_parent">open license</a>',
    maxZoom: 18
  });
}

/**
 * Initialize Data Privacy Control on the bottom left of the map
 */
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

/**
 * Initialize User Menu Control on the top left of the map.
 * @param options: Visibility of each component. False if hidden, True if visible. If None, then it will be hidden
 *
 * There are 3 menus on this control:
 * 1. add-user-menu
 * 2. edit-user-menu
 * 3. delete-user-menu
 * 4. download-menu
 * 5. reminder-menu
 *
 * Usage: initializeUserMenuControl({"add-user-menu": true, "download-menu": true}) to show add-user-menu and download-menu
 */
function initializeUserMenuControl(options) {
  // User Menu Control: Add User, Delete User
  user_menu_control = L.Control.extend({
    options: {
      position: 'topleft'
    },
    onAdd: function (map) {
      // Set HTML and CSS for it
      var user_menu_container = L.DomUtil.create('div',
          'user_menu_control btn-group-vertical');
      if (options['add-user-menu']) {
        user_menu_container.innerHTML +=
            "<button type='button' class='btn btn-default btn-sm user-menu-control' id='add-user-button' onclick='onAddUserButtonClick()' data-toggle='tooltip' data-original-title='Add me to map!'>" +
            "<span class='glyphicon glyphicon-user'></span>" +
            "</button>";
        onAddUserButtonClick = function () {
          if (current_mode != ADD_USER_MODE) {
            activateAddUserState();
        }
      };
      }
      if (options['edit-user-menu']) {
        user_menu_container.innerHTML +=
            "<button type='button' class='btn btn-default btn-sm user-menu-control' id='edit-user-button' onclick='onEditUserButtonClick()' data-toggle='tooltip' data-original-title='Edit my data!'>" +
            "<span class='glyphicon glyphicon-pencil'></span>" +
            "</button>";
        onEditUserButtonClick = function () {
          alert("It's not yet implemented!");
      };
      }
      if (options['delete-user-menu']) {
        user_menu_container.innerHTML +=
            "<button type='button' class='btn btn-default btn-sm user-menu-control' id='edit-user-button' onclick='onDeleteUserButtonClick()' data-toggle='tooltip' data-original-title='Delete me from the map!'>" +
            "<span class='glyphicon glyphicon-trash'></span>" +
            "</button>";
        onDeleteUserButtonClick = function () {
          alert("It's not yet implemented!");
        };
      }
      if (options['download-menu']) {
        user_menu_container.innerHTML +=
            "<button type='button' class='btn btn-default btn-sm user-menu-control' id='download-button' onclick='onDownloadButtonClick()' data-toggle='tooltip' data-original-title='Download all users as CSV file!'>" +
            "<span class='glyphicon glyphicon-download-alt'></span>" +
            "</button>";
        onDownloadButtonClick = function () {
          if (current_mode != DOWNLOAD_MODE) {
            activateDownloadState();
          }
        };
      }
      if (options['reminder-menu']) {
        user_menu_container.innerHTML +=
            "<button type='button' class='btn btn-default btn-sm user-menu-control' id='reminder-button' onclick='onReminderButtonClick()' data-toggle='tooltip' data-original-title='Forgot your edit link? Resend me an email!'>" +
            "<span class='glyphicon glyphicon-question-sign'></span>" +
            "</button>";
         onReminderButtonClick = function () {
           alert("It's not yet implemented!");
         };
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

/**
 * Initialize all icons that needed and set the icon image path
 */
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
/**
 * Activate Default State
 */
function activateDefaultState() {
  current_mode = DEFAULT_MODE; // Change mode to default
  map.off('click', onMapClick); // Stop onMapclick listener
  $('#map').removeAttr('style'); // Remove all dynamic style to default one
  $('#delete-user-button').removeClass('active');
  $('#add-user-button').removeClass('active');
  $('#download-button').removeClass('active');
}

/**
 * Activate Add User State. The state when user click 'Add Me' button
 */
function activateAddUserState() {
  // Reset to Default State first
  activateDefaultState();
  // Set current mode to add user mode
  current_mode = ADD_USER_MODE;
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

/**
 * Activate Download State. The state when user click download data button
 */
function activateDownloadState() {
  // Reset to Default State first
  activateDefaultState();
  // Set mode to delete user mode
  current_mode = DOWNLOAD_MODE;
  // Set css button to active
  $('#download-button').addClass('active');
  //Process here:
  window.open('/download', '_self');
  activateDefaultState();
}
/***-------------------- END OF STATE CONTROL -------------------------**/


/***------------------ START OF LAYER MANAGEMENT --------------------***/
/**
 * Return user icon based on user role
 * @param user_role: a role
 */
function getUserIcon(user_role) {
  var role_icon;
  if (user_role == USER_ROLE) {
    role_icon = user_icon;
  } else if (user_role == TRAINER_ROLE) {
    role_icon = trainer_icon;
  } else if (user_role == DEVELOPER_ROLE) {
    role_icon = developer_icon;
  }
  return role_icon;
}

/**
 * Return user form based on user attribute
 * @param user: associative array containing each value of user attribute
 */
function getUserForm(user) {
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
          '<input type="text" class="form-control" placeholder="Required" id="name" name="name" required value="'+  user['name'] +'" />' +
          '</div>' +
          '</div>' +

          '<div class="form-group">' +
          '<div class="input-group input-group-sm">' +
          '<span class="input-group-addon">Email</span>' +
          '<input type="email" class="form-control" placeholder="Required"  id="email" name="email" required value="'+ user['email'] +'"/>' +
          '</div>' +
          '</div>' +

          '<div class="form-group">' +
          '<div class="input-group input-group-sm">' +
          '<span class="input-group-addon">Website</span>' +
          '<input type="url" class="form-control" placeholder="If filled, use http:// or https://." id="website" name="website" pattern="https?://.+" value="'+ user['website'] +'"/>' +
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
          '<input style="display: none;" type="text" id="lat" name="lat" value="' + user['latitude'] + '" />' +
          '<input style="display: none;" type="text" id="lng" name="lng" value="' + user['longitude'] + '" />' +
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

  return form;
}

/**
 * Add users to the respective layer based on user_role
 * @param layer: layer which users added to
 * @param user_role: the role of users that will be added
 */
function addUsers(layer, user_role) {
  $.ajax({
    type: "POST",
    url: "/users.json",
    dataType: 'json',
    data: {
      user_role: user_role
    },
    success: function (response) {
      var role_icon = getUserIcon(user_role);
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
/**
 * Add edited user to the respective layer
 * @param layer: layer which users added to
 * @param user: the user that will be added
 */
function addEditedUser(user, layer) {
  var form = getUserForm(user);
  var role_icon = getUserIcon(user['role']);
  L.marker([user['latitude'], user['longitude']], {icon: role_icon }).addTo(layer).bindPopup(form).openPopup();
}


/**
 * Listener when each feature is added to the map regarding to a layer.
 * @param feature
 * @param layer
 */
function onEachFeature(feature, layer) {
  // Set the popup content if it does have it.
  if (feature.properties && feature.properties.popupContent) {
    layer.bindPopup(feature.properties.popupContent);
  }
}

function refreshUserLayer() {
  users_layer.clearLayers();
  addUsers(users_layer, USER_ROLE);
}


function refreshTrainerLayer() {
  trainers_layer.clearLayers();
  addUsers(trainers_layer, TRAINER_ROLE);
}

function refreshDeveloperLayer() {
  developers_layer.clearLayers();
  addUsers(developers_layer, DEVELOPER_ROLE);
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
  var user = {'name': '', 'email': '', 'website': '', 'role': '', 'latitude': markerLocation.lat.toFixed(6), 'longitude': markerLocation.lng.toFixed(6)}
  var form = getUserForm(user);
  marker_new_user.bindPopup(form).openPopup()
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
          if (role == USER_ROLE.toString()) {
            refreshUserLayer();
          } else if (role == TRAINER_ROLE.toString()) {
            refreshTrainerLayer();
          } else if (role == DEVELOPER_ROLE.toString()) {
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
/***------------------ END OF LAYER MANAGEMENT --------------------***/


/***-----------------START OF FORM VALIDATION ---------------------***/
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
/***-----------------END OF FORM VALIDATION ---------------------***/
