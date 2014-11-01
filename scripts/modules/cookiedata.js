// cookiedata.js(CookieDataModule)

var CookieDataModule = (function() {

  // Loads the appropriate level from the cookie/anchor
  var load = function() {
   /*
    * The level can either be loaded from the anchor in the url or the last
    * level from the cookie...so which do we choose? First we'll check to see if
    * there's an anchor. If there's already a cookie with a level value, we have
    * to be sure that the level value in the cookie is *higher* than the one in
    * the hash, to be sure that the user isn't trying to cheat and visit unseen
    * levels
    *
    * If there is no anchor, just load whatever is in the cookie.
    *
    * If there is no cookie, start at the beginning.
    */
    var name = "parity_save_data=";
    var cookieArray = document.cookie.split(';');
    var saveObject = { level: -1, visited_instructions: [] }
    for(var i=0; i<cookieArray.length; ++i) {
      var cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) == 0) {
        saveObject = JSON.parse(cookie.substring(name.length,cookie.length));
      }
    }

    var hash = parseInt(window.location.hash.substring(1));
    if(hash && hash <= saveObject.level) {
      saveObject.level = hash;
    }

    return saveObject;
  }

  // Saves the level in the cookie and updates the URL
  var save = function(saveObject) {
    // Places the level number in a cookie
    var d = new Date();
    d.setTime(d.getTime()+(365*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = "parity_save_data=" + JSON.stringify(saveObject) + "; " + expires;

    // Updates the hash with the level number
    document.location.hash = "#" + saveObject.level;
  }

  // The public facade
  return {
    save: save,
    load: load
  }
}())

// Add the mediator to the module
mediator.installTo(CookieDataModule);

// Subscribe to messages

// Save the progress when asked
CookieDataModule.subscribe('cookie_data_save', function(saveObject) {
  CookieDataModule.save(saveObject);
  mediator.publish('cookie_data_save_complete');
});

// Load level progress when asked
CookieDataModule.subscribe('cookie_data_load', function() {
  mediator.publish('cookie_data_load_complete', CookieDataModule.load());
});
