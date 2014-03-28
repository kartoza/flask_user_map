/**
 * Author: Akbar Gumbira (akbargumbira@gmail.com)
 * Description:
 * This file contains methods related directly to user map.
 * It follows Airbnb Javascript style guide (https://github.com/airbnb/javascript)
 * and JSDoc for the documentation.
 */

/**
 * ALL THE CONSTANTS
 * @const {int} DEFAULT_MODE The default state of the apps.
 * @const {int} ADD_USER_MODE The state when user clicks add user menu button.
 * @const {int} EDIT_USER_MODE The state when user clicks edit user menu button.
 * @const {int} DELETE_USER_MODE The state when user clicks delete user menu btn.
 * @const {int} DOWNLOAD_MODE The state when user clicks download user list btn.
 * @const {int} REMINDER_MODE The state when user clicks reminder button.
 * @const {int} USER_ROLE The number representation for user role.
 * @const {int} TRAINER_ROLE The number representation for trainer role.
 * @const {int} DEVELOPER_ROLE The number representation for developer role.
 */
var DEFAULT_MODE = 0;
var ADD_USER_MODE = 1;
var EDIT_USER_MODE = 2;
var DELETE_USER_MODE = 3;
var DOWNLOAD_MODE = 4;
var REMINDER_MODE = 5
var ADD_EVENT_MODE = 6;
var USER_ROLE = 0;
var TRAINER_ROLE = 1;
var DEVELOPER_ROLE = 2;

/**
 * Add users to the respective layer based on user_role.
 * @param {object} layer The layer that users will be added to.
 * @param {int} user_role The role of users that will be added.
 * @name L The Class from Leaflet.
 * @property geoJson Property of L class.
 * @property users Property of response object.
 * @function addTo add child element to the map.
 * @property properties Property of a feature.
 * @property popupContent Property of properties.
 * @function bindPopup Bind popup to marker
 */
function addUsers(layer, user_role) {
  $.ajax({
    type: 'POST',
    url: '/users.json',
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
  }
}

/**
 * Refresh user layer based on the role.
 * Each user who has the same role is grouped on the same layer.
 * @param {int} role The role of the users that its layer is wanted to be refreshed.
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
  // Get the input by jQuery Selector
  var $name_input = $('#name');
  var $email_input = $('#email');
  var $website_input = $('#website');

  //Clear Form Message:
  $name_input.parent().removeClass('has-error');
  $email_input.parent().removeClass('has-error');

  var name = $name_input.val();
  var email = $email_input.val();
  var website = $website_input.val();
  var role = $('input:radio[name=role]:checked').val();

  var $email_updates_input = $('#email_updates');
  var email_updates;
  if ($email_updates_input.is(':checked')) {
    email_updates = 'true';
  } else {
    email_updates = 'false';
  }

  var latitude = $('#lat').val();
  var longitude = $('#lng').val();

  var is_client_side_valid = validate_user_form(name, email, website);
  if (is_client_side_valid) {
    $.ajax({
      type: 'POST',
      url: '/add_user',
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
            $name_input.parent().addClass('has-error');
            $name_input.attr('placeholder', response.name.toString());

          }
          if (typeof response.email != 'undefined') {
            $email_input.parent().addClass('has-error');
            $email_input.attr('placeholder', response.email.toString());
          }
        } else {
          //Clear marker
          cancelMarker(marker_new_user);
          // Refresh Layer according to role
          if (role == USER_ROLE.toString()) {
            refreshUserLayer(USER_ROLE);
          } else if (role == TRAINER_ROLE.toString()) {
            refreshUserLayer(TRAINER_ROLE);
          } else if (role == DEVELOPER_ROLE.toString()) {
            refreshUserLayer(DEVELOPER_ROLE);
          }
          activateDefaultState(); // Back to default state
          var add_success_title = 'Information';
          var add_success_info =
                  'Thank you for adding yourself into our database! ' +
                  'Please check your email to see the registration ' +
                  'confirmation';
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
  cancelMarker(marker_new_user);
  // Activate Default State
  activateDefaultState();
}

/**
 * Prepare user who will be edited.
 * @param {object} user The user who will be edited.
 * @param {string} popup_content Popup content of the this edited user marker.
 */
function initializeEditedUser(user, popup_content) {
  edited_user = user;
  edited_user_popup = popup_content;
  edited_user_form_popup = getUserFormPopup(user, EDIT_USER_MODE);
}

/**
 * Add edited user to the respective layer.
 * @param {object} layer The layer that users will be added to.
 * @param {object} user The user that will be added.
 * @param {string} popup_content The content of the popup that will be bind to the user marker.
 * @property marker
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
 * @name edited_user_layer Global variable of a layer of edited user.
 * @property getLatLng Method to get Latitude and Longitude from a marker.
 * @property edited_user Global variable of a user who will be edited
 * @property edited_user_popup Global variable of a user popup content
 * @property dragging Property of a marker to set drag option.
 */
function editUser() {
  var name_input = $('#name');
  var email_input = $('#email');
  //Clear Form Message:
  name_input.parent().removeClass('has-error');
  email_input.parent().removeClass('has-error');

  var guid = edited_user['guid'];
  var name = name_input.val();
  var email = email_input.val();
  var website = $('#website').val();
  var role = $('input:radio[name=role]:checked').val();
  var email_updates;
  if ($('#email_updates').is(':checked')) {
    email_updates = 'true';
  } else {
    email_updates = 'false';
  }
  var latitude = edited_user_marker.getLatLng().lat.toFixed(8);
  var longitude = edited_user_marker.getLatLng().lng.toFixed(8);

  var is_client_side_valid = validate_user_form(name, email, website);
  if (is_client_side_valid) {
    $.ajax({
      type: 'POST',
      url: '/edit_user',
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
        activateDefaultState();
        var info_title = 'Information';
        var info_content = 'You have successfully edited your data!';
        showInformationModal(info_title, info_content);
      }
    });
  }
}

/**
 * This method is fired when user click cancel button at edit user form.
 * @name map Global variable of the map.
 * @property openPopup Method of a popup to open it.
 * @property closePopup Method of a popup to close it.
 * @property fitWorld Method from the L.map.
 * @property zoomIn Method from fitWorld.
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
    type: 'POST',
    url: '/delete/'+edited_user['guid'],
    success: function() {
      $('#delete-success-modal').modal({
        backdrop: false
      });
    }
  });
}

/**
 * AJAX Call to server side. Used for sending reminder to user email.
 * @property modal Bootstrap modal.
 */
function sendReminder() {
  var $email_reminder_input = $("#email_reminder");
  $email_reminder_input.parent().removeClass("has-error");
  var email = $email_reminder_input.val();

  var is_email_valid = isEmailSatisfied(email);
  if (is_email_valid) {
    $.ajax({
      type: 'POST',
      url: '/reminder',
      data: {
        "email": email
      },
      success: function(response) {
        if (response.type.toString() == 'Error') {
          $email_reminder_input.parent().addClass('has-error');
          $email_reminder_input.attr('placeholder', 'Email is not registered in our database');
        } else if (response.type.toString() == 'Success') {
          $('#reminder-menu-modal').modal('hide');
          var info_title = "Information";
          var info_content =
              'Email is succesfully sent to you. Please check your email to ' +
              'see the details.';
          showInformationModal(info_title, info_content);
          activateDefaultState();
        }
      }
    });
  } else {
    $email_reminder_input.parent().addClass('has-error');
    $email_reminder_input.attr('placeholder', 'Email is not registered in our database');
  }
}


/**
 * User form validation.
 * @param {string} str_name The name value.
 * @param {string} str_email The email value.
 * @param {string} str_website The website value.
 * @returns {boolean} is_all_valid The validity value of submitted user form.
 */
function validate_user_form(str_name, str_email, str_website) {
  var is_name_valid, is_email_valid, is_website_valid, is_all_valid;
  if (typeof document.createElement('input').checkValidity == 'function') {
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
    var $name_input = $('#name');
    $name_input.parent().addClass('has-error');
    $name_input.attr('placeholder', 'Name is required');
  }
  if (!is_email_valid) {
    var $email_input = $('#email');
    $email_input.parent().addClass('has-error');
    $email_input.attr('placeholder', 'Email is required and needs to be valid email');
  }
  if (!is_website_valid) {
    var $website_input =$("#website");
    $website_input.parent().addClass('has-error');
    $website_input.attr('placeholder', 'Website needs to be a valid URL');
  }
  return is_all_valid;
}


/**
 * AJAX call to server side to add event
 */
function addEvent() {
  // Get JQuery Object
  var $event_name_input = $('#event-name');
  var $event_organizer_input = $('#event-organizer');
  var $event_presenter_input = $('#event-presenter');

  // Clear Form message from previous validation
  $event_name_input.parent().removeClass('has-error');
  $event_organizer_input.parent().removeClass('has-error');
  $event_presenter_input.parent().removeClass('has-error');

  // Get the Value of all form
  var event_name = $event_name_input.val();
  var event_type = $('select[name=event-type] option:selected').val();
  var event_organizer = $event_organizer_input.val();
  var event_presenter = $event_presenter_input.val();
  var event_contact_email = $('#event-contact-email').val();
  var event_date = $('#event-date').val();
  var event_number_participant = $('#event-number-participant').val();
  var event_description = $('#event-description').val();
  var event_latitude = $('#event-latitude').val();
  var event_longitude = $('#event-longitude').val();

  var is_client_side_valid = validate_event_form(
      event_name, event_type, event_organizer, event_presenter,
      event_contact_email, event_date, event_number_participant,
      event_description);
  if (is_client_side_valid) {
    // TODO
  }

  // Delete Marker
  cancelMarker(marker_new_event);
  // Activate Default State
  activateDefaultState();
}

/**
 * Function when user clicks Cancel in Add Event form
 */
function cancelAddEvent() {
  // Delete Marker
  cancelMarker(marker_new_event);
  // Activate Default State
  activateDefaultState();
}

/**
 * Event form validation.
 * @param {string} str_name The event name value.
 * @param {string} str_type The event type value.
 * @param {string} str_organizer The event organizer value.
 * @param {string} str_presenter The event presenter value.
 * @param {string} str_contact_email The event's contact email value.
 * @param {string} str_date The event date value.
 * @param {string} str_number_participant The number of participant of the event.
 * @param {string} str_description The event's description.
 * @returns {boolean} is_all_valid The validity value of submitted event form.
 */
function validate_event_form(str_name, str_type, str_organizer, str_presenter, str_contact_email, str_date, str_number_participant, str_description) {
    // TODO
  var is_name_valid, is_type_valid, is_organizer_valid, is_presenter_valid,
      is_contact_email_valid, is_date_valid, is_number_participant_valid,
      is_description_valid, is_all_valid;
  if (typeof document.createElement('input').checkValidity == 'function') {
    // This browser support HTML5 Validation
    // Validate All by HTML5:
    is_name_valid = document.getElementById('event-name').checkValidity();
    is_organizer_valid = document.getElementById('event-organizer').checkValidity();
    is_presenter_valid = document.getElementById('event-presenter').checkValidity()
  } else {
    is_name_valid = isRequiredSatistied(str_name);
    is_organizer_valid = isRequiredSatistied(str_organizer);
    is_presenter_valid = isRequiredSatistied(str_presenter);
  }

  is_all_valid = is_name_valid && is_organizer_valid && is_presenter_valid;
  if (!is_name_valid) {
    var $event_name_input = $('#event-name');
    $event_name_input.parent().addClass('has-error');
    $event_name_input.attr('placeholder', 'Event name is required');
  }

  if (!is_organizer_valid) {
    var $event_organizer_input = $('#event-organizer');
    $event_organizer_input.parent().addClass('has-error');
    $event_organizer_input.attr('placeholder', 'Event organizer is required');
  }

  if (!is_presenter_valid) {
    var $event_presenter_input = $('#event-presenter');
    $event_presenter_input.parent().addClass('has-error');
    $event_presenter_input.attr('placeholder', 'Event presenter is required');
  }

  return is_all_valid;
}
