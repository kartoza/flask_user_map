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
