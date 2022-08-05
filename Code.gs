/**
 * To Install: Share with a new user as editor. They must open the script, click
 * "Deploy > Test Deployment > Install"
 */

/**
 * The maximum number of characters that can fit in the cat image.
 */
var MAX_MESSAGE_LENGTH = 40;

/**
 * Callback for rendering the homepage card.
 * @return {CardService.Card} The card to show to the user.
 */
function onHomepage(e) {
  console.log(e);
  var hour = Number(Utilities.formatDate(new Date(), e.userTimezone.id, 'H'));
  var message;
  if (hour >= 6 && hour < 12) {
    message = 'Good morning';
  } else if (hour >= 12 && hour < 18) {
    message = 'Good afternoon';
  } else {
    message = 'Good night';
  }
  message += ' ' + e.hostApp;
  return createCatCard(message, true);
}

/**
 * Creates a card with an image of a cat, overlayed with the text.
 * @param {String} text The text to overlay on the image.
 * @param {Boolean} isHomepage True if the card created here is a homepage;
 *      false otherwise. Defaults to false.
 * @return {CardService.Card} The assembled card.
 */
function createCatCard(text, isHomepage) {
  // Explicitly set the value of isHomepage as false if null or undefined.
  if (!isHomepage) {
    isHomepage = false;
  }


  // Use the "Cat as a service" API to get the cat image. Add a "time" URL
  // parameter to act as a cache buster.
  var now = new Date();
  // Replace formward slashes in the text, as they break the CataaS API.
  var caption = text.replace(/\//g, ' ');
  Logger.log(caption + " " + text);
  var imageUrl =
      Utilities.formatString('https://cataas.com/cat/says/%s?time=%s',
          encodeURIComponent(caption), now.getTime());
  var image = CardService.newImage()
      .setImageUrl(imageUrl)
      .setAltText('Meow')

  // Create a button that changes the cat image when pressed.
  // Note: Action parameter keys and values must be strings.
  var action = CardService.newAction()
      .setFunctionName('onChangeCat')
      .setParameters({text: text, isHomepage: isHomepage.toString()});
  var button = CardService.newTextButton()
      .setText('Create Program Folders Here')
      .setOnClickAction(action)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  var buttonSet = CardService.newButtonSet()
      .addButton(button);

  // Create a footer to be shown at the bottom.
  var footer = CardService.newFixedFooter()
      .setPrimaryButton(CardService.newTextButton()
          .setText('Powered by cataas.com')
          .setOpenLink(CardService.newOpenLink()
              .setUrl('https://cataas.com')));

  // Assemble the widgets and return the card.
  var section = CardService.newCardSection()
      .addWidget(image)
      .addWidget(buttonSet);
  var card = CardService.newCardBuilder()
      .addSection(section)
      .setFixedFooter(footer);

  if (!isHomepage) {
    // Create the header shown when the card is minimized,
    // but only when this card is a contextual card. Peek headers
    // are never used by non-contexual cards like homepages.
    var peekHeader = CardService.newCardHeader()
      .setTitle('Contextual Cat')
      .setImageUrl('https://www.gstatic.com/images/icons/material/system/1x/pets_black_48dp.png')
      .setSubtitle(text);
    card.setPeekCardHeader(peekHeader)
  }

  return card.build();
}

/**
 * Callback for the "Change cat" button.
 * @param {Object} e The event object, documented {@link
 *     https://developers.google.com/gmail/add-ons/concepts/actions#action_event_objects
 *     here}.
 * @return {CardService.ActionResponse} The action response to apply.
 */
function onChangeCat(e) {
  // Get the text that was shown in the current cat image. This was passed as a
  // parameter on the Action set for the button.
  var text = e.parameters.text;

  // The isHomepage parameter is passed as a string, so convert to a Boolean.
  var isHomepage = e.parameters.isHomepage === 'true';

  // Create a new card with the same text.
  var card = createCatCard(text, isHomepage);

  // Create an action response that instructs the add-on to replace
  // the current card with the new one.
  var navigation = CardService.newNavigation()
      .updateCard(card);
  var actionResponse = CardService.newActionResponseBuilder()
      .setNavigation(navigation);
  return actionResponse.build();
}

/**
 * Truncate a message to fit in the cat image.
 * @param {string} message The message to truncate.
 * @return {string} The truncated message.
 */
function truncate(message) {
  if (message.length > MAX_MESSAGE_LENGTH) {
    message = message.slice(0, MAX_MESSAGE_LENGTH);
    message = message.slice(0, message.lastIndexOf(' ')) + '...';
  }
  return message;
}


/**
 * Callback for rendering the card for specific Drive items.
 * @param {Object} e The event object.
 * @return {CardService.Card} The card to show to the user.
 */
function onDriveItemsSelected(e) {
  Logger.log(e);
  let newFold = [];
  newFold[0] = ['1. Award and Mods'];
  newFold[1] = ['2. AOR Certs and 3. Designation Letter'];
  newFold[2] = ['4. Substantial Involvement', 
      'A. Implementation Plans (see 8.A)', 
      'B. Key Personnel',
      'C. Collaboration (not used)',
      'D. Construction',
      'E. Branding and Marking Plan', 
      'Z. Buy-in Documentation'];
  newFold[3] = ['5. Security Requirements (not used)'];
  newFold[4] = ['6. Financial Management',
      'A. Cost share monitoring',
      'B. Pipeline',
      'C. Accruals',
      'D. Payment Request (not used)',
      'E. Financial Status Reports',
      'F. Deobligation and Closeout',
      'G. Tax Exemption Monitoring',
      'H. Forward Funding Compliance',
      'Z. Detailed Budgets'];
  newFold[5] = ['7. Special Duties',
      'A. Subaward Approvals',
      'B. International Travel Approvals',
      'C. ASIST Admin Support Staff Approvals',
      'D. Other'];
  newFold[6] = ['8. Plans/Reports',
      'A. Annual Work Plans',
      'B. Progress Reports',
      'C. Site Visit Reports',
      'D. Monitoring and Evaluation'];
  newFold[7] = ['9. All Other Correspondence'];
  newFold[8] = ['10. Other'];
  newFold[9] = ['11. Environmental Compliance'];
  newFold[10] = ['12. Key Administrative Documentation',
      'A. MOU',
      'B. Meeting Minutes',
      'C. Important Correspondence',
      'D. Approvals',
      'E. Inventory',
      'F. Other Documents'];
  newFold[11] = ['RFA and Prior to Award',
      '1. Activity Design and RFA',
      '2. Applications and Selection Documents (links only)'];
  newFold[12] = ['Technical Reports'];
  newFold[13] = ['Mission and Internal Engagement'];
  newFold[14] = ['External Engagement'];

  let items = e.drive.selectedItems;
  if (items.length != 1 || items[0].mimeType != 'application/vnd.google-apps.folder') {
    return createCatCard("Please select a single folder \n to place the new folders");
    
  }

  Logger.log(items[0].id);
  let i = newFold.length-1;
  while (i >= 0) {
    let newId = Drive.Files.insert({
      "title": newFold[i][0],
      "mimeType": "application/vnd.google-apps.folder",
      "parents": [
        {
          "id": items[0].id
        }
      ]},null,{
      "supportsAllDrives": "true"
    }).id;
    
    let j = newFold[i].length-1;
    while (j >= 1) {
      Drive.Files.insert({
        "title": newFold[i][j],
        "mimeType": "application/vnd.google-apps.folder",
        "parents": [
          {
            "id": newId,
          }
        ]},null,{
        "supportsAllDrives": true
      });
      j--;
    }
    i--;
  }
  //DriveApp.createFolder("Invoices");
 

  return createCatCard("Program Folders Created!");
}
