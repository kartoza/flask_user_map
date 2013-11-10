/***--------------- START OF MAP COMPONENTS-------------***/
function initializeBaseMap() {
  base_map = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}' +
      '.png', {
    attribution: '© <a href="http://www.openstreetmap.org" target="_parent">OpenStreetMap</a> and contributors, under an <a href="http://www.openstreetmap.org/copyright" target="_parent">open license</a>',
    maxZoom: 18
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
 * @param mode: ADD_USER_MODE or EDIT_USER_MODE
 */
function getUserForm(user, mode) {
  var form =
      '<div class="panel panel-default">' +
          '<div class="panel-heading">' +
          '<h3 class="panel-title">User Data</h3>' +
          '</div>' +
          '<div class="panel-body">' +
          '<form action ="" role = "form-horizontal" id="add_user" enctype="multipart/form-data">' +
          '<div class="form-group" >' +
          '<div class="input-group input-group-sm">' +
          '<span class="input-group-addon">Name</span>' +
          '<input type="text" class="form-control" placeholder="Required" id="name" name="name" required value="' + user['name'] + '" />' +
          '</div>' +
          '</div>';
  if (mode == EDIT_USER_MODE) {
    form += '<div class="form-group">' +
        '<div class="input-group input-group-sm">' +
        '<span class="input-group-addon">Email</span>' +
        '<input type="email" class="form-control" placeholder="Required"  id="email" name="email" required value="' + user['email'] + '" readonly/>' +
        '</div>' +
        '</div>';
  } else {
    form += '<div class="form-group">' +
        '<div class="input-group input-group-sm">' +
        '<span class="input-group-addon">Email</span>' +
        '<input type="email" class="form-control" placeholder="Required"  id="email" name="email" required value="' + user['email'] + '"/>' +
        '</div>' +
        '</div>';
  }

  form += '<div class="form-group">' +
          '<div class="input-group input-group-sm">' +
          '<span class="input-group-addon">Website</span>' +
          '<input type="url" class="form-control" placeholder="If filled, use http:// or https://." id="website" name="website" pattern="https?://.+" value="' + user['website'] + '"/>' +
          '</div>' +
          '</div>';

  if ((mode == ADD_USER_MODE) || (user['role'] == USER_ROLE)) {
    form += '<div class="form-group">' +
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
        '</div>';

  } else if (user['role'] == TRAINER_ROLE) {
    form += '<div class="form-group">' +
        '<label for="label-role">Role</label>' +
        '<div class="input-group input-group-sm">' +
        '<span class="input-group-addon">' +
        '<input type="radio" name="role" value="0">' +
        '</span>' +
        '<span class="form-control"><small>User</small></span>' +
        '<span class="input-group-addon">' +
        '<input type="radio" name="role" value="1" checked>' +
        '</span>' +
        '<span class="form-control"><small>Trainer</small></span>' +
        '<span class="input-group-addon">' +
        '<input type="radio" name="role" value="2">' +
        '</span>' +
        '<span class="form-control" ><small>Developer</small></span>' +
        '</div>' +
        '</div>';
  } else if (user['role'] == DEVELOPER_ROLE) {
    form += '<div class="form-group">' +
        '<label for="label-role">Role</label>' +
        '<div class="input-group input-group-sm">' +
        '<span class="input-group-addon">' +
        '<input type="radio" name="role" value="0">' +
        '</span>' +
        '<span class="form-control"><small>User</small></span>' +
        '<span class="input-group-addon">' +
        '<input type="radio" name="role" value="1">' +
        '</span>' +
        '<span class="form-control"><small>Trainer</small></span>' +
        '<span class="input-group-addon">' +
        '<input type="radio" name="role" value="2" checked>' +
        '</span>' +
        '<span class="form-control" ><small>Developer</small></span>' +
        '</div>' +
        '</div>';
  }

  if ((mode == ADD_USER_MODE) || (!user['email_updates'])) {
    form += '<div class="form-group">' +
        '<label for="label-email-updates">Email Updates</label>' +
        '<div class="input-group input-group-sm">' +
        '<span class="input-group-addon">' +
        '<input type="checkbox" id="email_updates" name="email_updates" value="Yes"/>' +
        '</span>' +
        '<span class="form-control">Receive project news and updates</span>' +
        '</div>' +
        '</div>';
  } else {
    form += '<div class="form-group">' +
        '<label for="label-email-updates">Email Updates</label>' +
        '<div class="input-group input-group-sm">' +
        '<span class="input-group-addon">' +
        '<input type="checkbox" id="email_updates" name="email_updates" value="Yes" checked/>' +
        '</span>' +
        '<span class="form-control">Receive project news and updates</span>' +
        '</div>' +
        '</div>';
  }
  form += '<div class="form-group">' +
      '<input style="display: none;" type="text" id="lat" name="lat" value="' + user['latitude'] + '" />' +
      '<input style="display: none;" type="text" id="lng" name="lng" value="' + user['longitude'] + '" />' +
      '</div>' +

      '<div class="form-group">' +
      '<div>';
  if (mode == ADD_USER_MODE) {
    form += '<button type="button" class="btn btn-primary" onclick="addUser()">Done!</button>  ' +
        '<button type="button" class="btn btn-default" onclick="cancelMarker()">Cancel</button>'
  } else if (mode == EDIT_USER_MODE) {
    form += '<button type="button" class="btn btn-primary" onclick="editUser()">Done!</button>  ' +
        '<button type="button" class="btn btn-default" onclick="cancelEditUser()">Cancel</button>'
  }
  form += '</div>' +
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
 * Get Popup containing user form from user
 * @param user: javascript associative array representing user
 * @param mode: ADD_USER_MODE or EDIT_USER_MODE
 * @returns L.popup()
 */
function getUserFormPopup(user, mode) {
  var form = getUserForm(user, mode);
  var popup = L.popup();
  popup.setContent(form);
  return popup;
}

/**
 * Get Popup containing user data
 * @param user: javascript associative array representing user
 * @returns HTML
 */
function getUserPopup(user) {
  var popup;
  if (user['website'] != "") {
    popup = "<span class='glyphicon glyphicon-user'></span> " +
        user['name'] + "</br><span class='glyphicon "
        + "glyphicon-home'></span>" +
        "<a href=" + user['website'] + " target='_blank'> Website</a>";
  } else {
    popup = "<span class='glyphicon glyphicon-user'></span> " +
        user['name'];
  }
  return popup;
}

/**
 * Add edited user to the respective layer
 * @param layer: layer which users added to
 * @param user: the user that will be added
 * @param popup_content: Content of the popup binding to the user marker
 */
function addEditedUser(user, layer, popup_content) {
  var role_icon = getUserIcon(user['role']);
  edited_user_marker = L.marker([user['latitude'], user['longitude']], {icon: role_icon });
  edited_user_marker.addTo(layer);
  edited_user_marker.bindPopup(popup_content).openPopup();
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
  var user = {'name': '', 'email': '', 'website': '', 'role': '', 'latitude': markerLocation.lat.toFixed(8), 'longitude': markerLocation.lng.toFixed(8)}
  var popup = getUserFormPopup(user, ADD_USER_MODE);
  marker_new_user.bindPopup(popup).openPopup()
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
          var add_success_title = "Information"
          var add_success_info =
                  "Thank you for adding yourself into our database! Please check your " +
                  "email to see the registration confirmation";
          showInformationModal(add_success_title, add_success_info);
        }
      }
    });
  }
}

function initializeEditedUser(user) {
  edited_user = user;
  edited_user_popup = getUserPopup(user);
  edited_user_form_popup = getUserFormPopup(user, EDIT_USER_MODE);

}

function editUser() {
  //Clear Form Message:
  $("#name").parent().removeClass("has-error");
  $("#email").parent().removeClass("has-error");

  var guid = edited_user['guid']
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
  var latitude = edited_user_marker.getLatLng().lat.toFixed(8);
  var longitude = edited_user_marker.getLatLng().lng.toFixed(8);

  var is_client_side_valid = validate_add_user_form(name, email, website);
  if (is_client_side_valid) {
    $.ajax({
      type: "POST",
      url: "/edit_user",
      data: {
        guid: guid,
        name: name,
        email: email,
        website: website,
        role: role,
        email_updates: email_updates,
        latitude: latitude,
        longitude: longitude
      },
      success: function (response) {
        edited_user_layer.clearLayers();
        initializeEditedUser(response)
        addEditedUser(edited_user, edited_user_layer, edited_user_popup);
        edited_user_marker.dragging.disable();
        activateDefaultState(); // Back to default state
        var info_title = 'Information';
        var info_content = 'You have successfully edited your data!';
        showInformationModal(info_title, info_content);
      }
    });
  }
}

/**
 * This method is fired when user click cancel button at edit user form
 */
function cancelEditUser() {
  // Set back the marker
  edited_user_marker.setLatLng([edited_user['latitude'], edited_user['longitude']]);
  // Close Form Popup
  edited_user_marker.closePopup();
  // Bind popup with another popup
  edited_user_marker.bindPopup(edited_user_popup).openPopup();
  // Activate Default State
  activateDefaultState();
  // Fit map to world extent
  map.fitWorld().zoomIn();
}

function deleteUser() {
    $.ajax({
      type: "POST",
      url: "/delete/"+edited_user['guid'],
      success: function(response) {
        $('#delete-success-modal').modal({
          backdrop: false
        });
      }
    });
}

function sendReminder() {
  $("#email_reminder").parent().removeClass("has-error");
  var email = $("#email_reminder").val();
  is_email_valid = isEmailSatisfied(email);
  if (is_email_valid) {
    $.ajax({
      type: "POST",
      url: "/reminder",
      data: {
        "email": email
      },
      success: function(response) {
        if (response.type.toString() == 'Error') {
          $("#email_reminder").parent().addClass("has-error");
          $('#email_reminder').attr("placeholder", 'Email is not registered in our database');
        } else if (response.type.toString() == 'Success') {
          $('#reminder-menu-modal').modal('hide');
          var info_title = "Information";
          var info_content =
              "Email is succesfully sent to you. Please check your email to " +
              "see the details."
          showInformationModal(info_title, info_content);
          activateDefaultState();
        }
      }
    });
  } else {
    $("#email_reminder").parent().addClass("has-error");
    $('#email_reminder').attr("placeholder", 'Email is not registered in our database');
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
