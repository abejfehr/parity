var cookieManager = {
  //saves a cookie with the current level
  saveProgress: function() {
    var d = new Date();
    d.setTime(d.getTime()+(365*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = "parity_last_level=" + level.number + "; " + expires;
  },

  //gets the last level from a cookie
  loadProgress: function() {
    var name = "parity_last_level=";
    var cookieArray = document.cookie.split(';');
    var levelNo = -1;
    for(var i=0; i<cookieArray.length; ++i) {
      var cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) == 0) {
        levelNo = cookie.substring(name.length,cookie.length);
      }
    }

    levelManager.setLevel(levelNo);
  }
}

alert(cookieManager);