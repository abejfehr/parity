var StateData = (function() {

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
    var name = options.cookieName + '=';
    var cookieArray = document.cookie.split(';');
    var saveObject = {
      played_levels: [],
      visited_instructions: [],
      last_level: -1
    };
    for(var i=0; i<cookieArray.length; ++i) {
      var cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        saveObject = JSON.parse(cookie.substring(name.length,cookie.length));
        //alert(JSON.stringify(saveObject));
      }
    }

    return saveObject;
  };

  // Saves the level in the cookie and updates the URL
  var save = function(saveObject) {
    // Places the level number in a cookie
    var d = new Date();
    d.setTime(d.getTime()+(365*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = options.cookieName + '=' + JSON.stringify(saveObject) + "; " + expires;
  };

  // The public facade
  return {
    save: save,
    load: load
  };
}());

// Add the mediator to the module
mediator.installTo(StateData);

// Subscribe to messages

// Save the progress when asked
StateData.subscribe('cookie_data_save', function(saveObject) {
  StateData.save(saveObject);
  mediator.publish('cookie_data_save_complete');
});

// Load level progress when asked
StateData.subscribe('cookie_data_load', function() {
  mediator.publish('cookie_data_load_complete', StateData.load());
});
