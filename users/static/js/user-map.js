/**
 * Author: Akbar Gumbira (akbargumbira@gmail.com)
 * Description: This file contains methods related directly to user map
 */

/**
 * Add users to the respective layer based on user_role
 * @param layer: the layer that users will be added to
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
  function onEachFeature(feature, layer) {
    // Set the popup content if it does have the content
    if (feature.properties && feature.properties.popupContent) {
      layer.bindPopup(feature.properties.popupContent);
    }
  };
}

/**
 * Refresh user layer based on the role.
 * Each user who has the same role is grouped on the same layer.
 * @param role: Role of the users that its layer is wanted to be refreshed
 */
function refreshUserLayer(role) {
  var layer = getUserLayer(role);
  layer.clearLayers();
  addUsers(layer, role);
}

/**
 * AJAX Call to server side to add user.
 */
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

  var is_client_side_valid = validate_user_form(name, email, website);
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
            refreshUserLayer(USER_ROLE);
          } else if (role == TRAINER_ROLE.toString()) {
            refreshUserLayer(TRAINER_ROLE);
          } else if (role == DEVELOPER_ROLE.toString()) {
            refreshUserLayer(DEVELOPER_ROLE);
          }
          activateDefaultState(); // Back to default state
          var add_success_title = "Information"
          var add_success_info =
                  "Thank you for adding yourself into our database! " +
                  "Please check your email to see the registration " +
                  "confirmation";
          showInformationModal(add_success_title, add_success_info);
        }
      }
    });
  }
}

/**
 * Function when user clicks Cancel in Add User Form
 */
function cancelAddUser() {
  // Delete Marker
  cancelMarker();
  // Activate Default State
  activateDefaultState();
  // If estimated_location_circle exists, remove that circle first from map
  if (typeof estimated_location_circle != 'undefined') {
    map.removeLayer(estimated_location_circle);
  }

}
/**
 * Prepare user who will be edited.
 * @param user
 */
function initializeEditedUser(user, popup_content) {
  edited_user = user;
  edited_user_popup = popup_content
  edited_user_form_popup = getUserFormPopup(user, EDIT_USER_MODE);
}

/**
 * Add edited user to the respective layer
 * @param layer: the layer that users will be added to
 * @param user: the user that will be added
 * @param popup_content: Content of the popup that will be bind to the user marker
 */
function addEditedUser(user, layer, popup_content) {
  var role_icon = getUserIcon(user['role']);
  edited_user_marker = L.marker(
      [user['latitude'], user['longitude']],
      {icon: role_icon }
  );
  edited_user_marker.addTo(layer);
  edited_user_marker.bindPopup(popup_content).openPopup();
}

/**
 * AJAX call to server side to edit user.
 */
function editUser() {
  //Clear Form Message:
  $("#name").parent().removeClass("has-error");
  $("#email").parent().removeClass("has-error");

  var guid = edited_user['guid'];
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

  var is_client_side_valid = validate_user_form(name, email, website);
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
        initializeEditedUser(JSON.parse(response.edited_user), response.edited_user_popup);
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
 * This method is fired when user click cancel button at edit user form.
 */
function cancelEditUser() {
  // Set back the marker
  edited_user_marker.setLatLng(
      [edited_user['latitude'], edited_user['longitude']]
  );
  // Close Form Popup
  edited_user_marker.closePopup();
  // Bind popup with another popup
  edited_user_marker.bindPopup(edited_user_popup).openPopup();
  // Activate Default State
  activateDefaultState();
  // Fit map to world extent
  map.fitWorld().zoomIn();
}

/**
 * AJAX Call to server side to delete a user.
 */
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

/**
 * AJAX Call to server side. Used for sending reminder to user email.
 */
function sendReminder() {
  $("#email_reminder").parent().removeClass("has-error");
  var email = $("#email_reminder").val();
  var is_email_valid = isEmailSatisfied(email);
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
          $('#email_reminder')
              .attr("placeholder", 'Email is not registered in our database');
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
    $('#email_reminder')
        .attr("placeholder", 'Email is not registered in our database');
  }
}


/**
 * User form validation.
 * @param str_name
 * @param str_email
 * @param str_website
 * @returns {*}
 */
function validate_user_form(str_name, str_email, str_website) {
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
    $('#email')
        .attr("placeholder", 'Email is required and needs to be valid email');
  }
  if (!is_website_valid) {
    $("#website").parent().addClass("has-error");
    $('#website').attr("placeholder", 'Website needs to be valid URL ');
  }
  return is_all_valid;
}
