//define the module
var CookieDataModule = (function() {

  var load = function() {
    //put the level number in the corner
//    levelLink.html('level 0/' + numLevels()); TODO: re-add this somewhere

    /*
    * at this point, the level must be loaded.
    *
    * it can either be loaded from the anchor in the url
    * or the last level from the cookie...so which do we
    * choose? first we'll check to see if there's an anchor,
    * and we'll actually save THAT level in the cookie.
    *
    * if there is no anchor, just load whatever is in the
    * cookie.
    */
    var levelNo = window.location.hash.substring(1);

    if(levelNo) {
      return levelNo;
    }
    else {
      var name = "parity_last_level=";
      var cookieArray = document.cookie.split(';');
      var levelNo = -1;
      for(var i=0; i<cookieArray.length; ++i) {
        var cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) == 0) {
          levelNo = cookie.substring(name.length,cookie.length);
        }
      }
      return levelNo;
    }
    return -1;
  }

  return {
    save: function(levelNo) {
      var d = new Date();
      d.setTime(d.getTime()+(365*24*60*60*1000));
      var expires = "expires="+d.toGMTString();
      document.cookie = "parity_last_level=" + levelNo + "; " + expires;
    },
    load: load
  }
}())

//add the mediator to the module
mediator.installTo(CookieDataModule);

//subscribe to messages
CookieDataModule.subscribe('cookie_data_save', function(levelNo) {
  CookieDataModule.save(levelNo);
  mediator.publish('cookie_data_save_complete');
});

CookieDataModule.subscribe('cookie_data_load', function() {
  mediator.publish('cookie_data_load_complete', CookieDataModule.load());
});
