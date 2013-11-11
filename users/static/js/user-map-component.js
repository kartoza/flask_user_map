/**
 * Author: Akbar Gumbira (akbargumbira@gmail.com)
 * Description: This file contains all the function to prepare map components
 */

/**
 * Create basemap instance to be used.
 * @returns {*}
 */
function createBasemap() {
  var base_map = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}' +
      '.png', {
    attribution: '© <a href="http://www.openstreetmap.org" target="_parent">OpenStreetMap</a> and contributors, under an <a href="http://www.openstreetmap.org/copyright" target="_parent">open license</a>',
    maxZoom: 18
  });
  return base_map;
}

/**
 * Create IconMarkerBase that will be used for icon marker.
 * @returns {void|b.extend|*|x.extend}
 */
function createIconMarkerBase() {
  var IconMarkerBase = L.Icon.extend({
    options: {
      shadowUrl: '/static/img/shadow-icon.png',
      iconSize: [19, 32],
      shadowSize: [42, 35],
      iconAnchor: [12, 32],
      shadowAnchor: [12, 32],
      popupAnchor: [-2, -32]
    }
  });
  return IconMarkerBase;
}

/**
 * Create all icons that are used.
 * @returns {{user_icon: IconMarkerBase, trainer_icon: IconMarkerBase, developer_icon: IconMarkerBase}}
 */
function createAllIcons() {
  var IconMarkerBase = createIconMarkerBase();
  var user_icon = new IconMarkerBase({iconUrl: '/static/img/user-icon.png'});
  var trainer_icon = new IconMarkerBase({iconUrl: '/static/img/trainer-icon.png'});
  var developer_icon = new IconMarkerBase({iconUrl: '/static/img/developer-icon.png'});
  var all_icons = {
    user_icon: user_icon,
    trainer_icon: trainer_icon,
    developer_icon: developer_icon
  };
  return all_icons;
}

/**
 * Create Data Privacy Control instance on the bottom left of the map.
 * @returns {void|b.extend|*|x.extend}
 */
function createDataPrivacyControl() {
  var control = L.Control.extend({
    options: {
      position: 'bottomleft'
    },
    onAdd: function () {
      var data_privacy_container = L.DomUtil.create('div',
          'leaflet-control-attribution');
      var data_privacy_title = "Data Privacy";
      var data_privacy_content =
          "The data you enter on this site may be visible to others. We " +
              "suggest that you approximate your physical location to the nearest " +
              "town or major center. Parts of your data will be made available for " +
              "others to download and use. We will <strong>not</strong> share:</br>" +
              "<ul> " +
              "<li>your email address</li>" +
              "<li>your unique identifier used to edit your record</li>" +
              "</ul>" +
              "If you would like your data removed from this site, please refer to " +
              "the confirmation email we sent you when you added yourself for " +
              "instructions.";
      onDataPrivacyClick = function () {
        showInformationModal(data_privacy_title, data_privacy_content);
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
  return control;
}

/**
 * Create User Menu Control on the top left of the map.
 * @param options: Visibility of each component. False if hidden, True if visible. If None, then it will be hidden.
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
function createUserMenuControl(options) {
  var control = L.Control.extend({
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
          if (current_mode != EDIT_USER_MODE) {
            activateEditUserState();
          }
        };
      }
      if (options['delete-user-menu']) {
        user_menu_container.innerHTML +=
            "<button type='button' class='btn btn-default btn-sm user-menu-control' id='delete-user-button' onclick='onDeleteUserButtonClick()' data-toggle='tooltip' data-original-title='Delete me from the map!'>" +
                "<span class='glyphicon glyphicon-trash'></span>" +
                "</button>";
        onDeleteUserButtonClick = function () {
          if (current_mode != DELETE_USER_MODE) {
            activateDeleteUserState();
          }
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
          if (current_mode != REMINDER_MODE) {
            activateReminderState();
          }
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
  return control;
}

/**
 * Listener to geolocation. Called when location is found.
 * NOTE:
 * Bind label to circle/circle marker is not working.
 * See the issue here: https://github.com/Leaflet/Leaflet.label/issues/31
 * @param e
 */
function onLocationFound(e) {
  var radius = e.accuracy / 2;
  var label = "You are within " + radius + " meters from this point";
  // If estimated_location_circle exists, remove that circle first from map
  if (typeof estimated_location_circle != 'undefined') {
    map.removeLayer(estimated_location_circle);
  }
  estimated_location_circle = L.circle(e.latlng, radius, {clickable: false, fillOpacity: 0.1});
  estimated_location_circle.bindLabel(label, {noHide: true}).addTo(map);
}

/**
 * Listener when map is clicked.
 * @param e
 */
function onMapClick(e) {
  // Clear the un-saved clicked marker
  if (marker_new_user != null) {
    cancelMarker();
  }
  //Get new marker
  var markerLocation = e.latlng;
  marker_new_user = L.marker(markerLocation);
  map.addLayer(marker_new_user);
  var user = {'latitude': markerLocation.lat.toFixed(8), 'longitude': markerLocation.lng.toFixed(8)}
  var popup = getUserFormPopup(user, ADD_USER_MODE);
  marker_new_user.bindPopup(popup).openPopup()
}

/**
 * Cancel new user marker from the map.
 */
function cancelMarker() {
  map.removeLayer(marker_new_user);
}
