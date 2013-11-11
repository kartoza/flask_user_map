/**
 * Author: Akbar Gumbira (akbargumbira@gmail.com)
 * Description: This file contains all utilities function for user map.
 */

/**
 * Open an information modal. There is only one modal to use for showing information
 * This function should be used if there is no other spesific behaviour about the modal.
 * Element #information_modal is declared in base.html
 * @param info_title: Title of the modal (usually set as 'Information')
 * @param info_content: The content of information
 */
function showInformationModal(info_title, info_content) {
  var information_modal = $('#information-modal');
  information_modal.find(".modal-title").html(info_title);
  information_modal.find("#info_content").html(info_content);
  information_modal.modal({
    backdrop: false
  });
}

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
 * Get User Layer that has been declared based on the role.
 * @param role: User role
 */
function getUserLayer(role) {
  var layer;
  if (role == USER_ROLE) {
    layer = users_layer;
  } else if (role == TRAINER_ROLE) {
    layer = trainers_layer;
  } else if (role == DEVELOPER_ROLE) {
    layer = developers_layer;
  }
  return layer;
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
          '<input type="text" class="form-control" placeholder="Required" id="name" name="name" required value="' + ((mode == EDIT_USER_MODE)?user['name']:'') + '" />' +
          '</div>' +
          '</div>' +

          '<div class="form-group">' +
          '<div class="input-group input-group-sm">' +
          '<span class="input-group-addon">Email</span>' +
          '<input type="email" class="form-control" placeholder="Required"  id="email" name="email" required value="' + ((mode == EDIT_USER_MODE)? user['email']:'') + '" '+ ((mode == EDIT_USER_MODE)? 'readonly':'') +'>' +
          '</div>' +
          '</div>' +

          '<div class="form-group">' +
          '<div class="input-group input-group-sm">' +
          '<span class="input-group-addon">Website</span>' +
          '<input type="url" class="form-control" placeholder="If filled, use http:// or https://." id="website" name="website" pattern="https?://.+" value="' + ((mode == EDIT_USER_MODE)? user['website']:'') + '"/>' +
          '</div>' +
          '</div>' +

          '<div class="form-group">' +
          '<label for="label-role">Role</label>' +
          '<div class="input-group input-group-sm">' +
          '<span class="input-group-addon">' +
          '<input type="radio" name="role" value="0" '+ ((mode == ADD_USER_MODE) || (user['role'] == USER_ROLE)? 'checked':'') +'>' +
          '</span>' +
          '<span class="form-control"><small>User</small></span>' +
          '<span class="input-group-addon">' +
          '<input type="radio" name="role" value="1" '+ ((mode == EDIT_USER_MODE) && (user['role'] == TRAINER_ROLE)? 'checked':'') +'>' +
          '</span>' +
          '<span class="form-control"><small>Trainer</small></span>' +
          '<span class="input-group-addon">' +
          '<input type="radio" name="role" value="2" '+ ((mode == EDIT_USER_MODE) && (user['role'] == DEVELOPER_ROLE)? 'checked':'') +'>' +
          '</span>' +
          '<span class="form-control" ><small>Developer</small></span>' +
          '</div>' +
          '</div>' +

          '<div class="form-group">' +
          '<label for="label-email-updates">Email Updates</label>' +
          '<div class="input-group input-group-sm">' +
          '<span class="input-group-addon">' +
          '<input type="checkbox" id="email_updates" name="email_updates" value="Yes" '+ ((mode == EDIT_USER_MODE) && (user['email_updates'])? 'checked':'') +'>' +
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

          '<button type="button" class="btn btn-primary" onclick="'+ ((mode == ADD_USER_MODE)?'addUser()':'editUser()') +'">Done!</button>  ' +
          '<button type="button" class="btn btn-default" onclick="'+ ((mode == ADD_USER_MODE)?'cancelMarker()':'cancelEditUser()') +'">Cancel</button>' +

          '</div>' +
          '</div>' +
          '</form>' +
          '</div>' +
          '</div>';
  return form;
}

/**
 * Get Popup containing user form
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
