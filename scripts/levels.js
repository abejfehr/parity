var levelManager = {
  //sets the current level to whatever
  setLevel: function(n) {
    //now we just need to make sure it exists
    var bookmarkNo = getBookmarkOfLevel(n)

    if(bookmarkNo != -1) {
      bookmark = bookmarkNo;

      //hide the overlay
      overlay.hide();
    }
  },

  //gets the bookmark number for a level number
  //input:   -the level number
  //returns: -the bookmark number
  function getBookmarkOfLevel(n) {
    for(var i = 0; i < story.length; ++i) {
      if(story[i].number == n) {
        return i;
      }
    }
    return -1;
}}