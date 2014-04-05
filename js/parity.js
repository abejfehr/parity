//
// Parity
// Author:  Abe Fehr
// Version: 0.1
//

$(document).ready(function() {

  //all the page objects
  var resetLink = $('#reset');
  var levelText = $('#level');
  var overlay   = $('#overlay');
  var button    = $('#overlay > button');
  var board     = $('#board');
  var cells = [];
  for(var i=0;i<4;++i) {
    cells.push([]);
    for(var j=0;j<4;++j) {
      cells[i].push($('td[data-x="' + i + '"][data-y="' + j + '"]'));
    }
  }

  //the bookmark in the story of the game
  var bookmark = 0;

  var options = {
    fade: 300
  }

  //where we'll store the current level
  var level;

  //where we'll store the instructions and the levels
  var story;

  $(document).keydown(function(e){
    if(story[bookmark].type == 'level') {
      if(e.keyCode == 37) {
        left();
        return false;
      }
      if(e.keyCode == 38) {
        up();
        return false;
      }
      if(e.keyCode == 39) {
        right();
        return false;
      }
      if(e.keyCode == 40) {
        down();
        return false;
      }
    }
    else if(story[bookmark].type == 'overlay') {
      if(e.keyCode == 13 || e.keyCode == 32) {
        $('#overlay > button').trigger('click');
      }
    }
  });



  function left() {
    if(level.selected.x > 0) {
      select(--level.selected.x, level.selected.y);
      update();
    }
  }



  function up() {
    if(level.selected.y > 0) {
      select(level.selected.x, --level.selected.y);
      update();
    }
  }



  function right() {
    if(level.selected.x < 3) {
      select(++level.selected.x, level.selected.y);
      update();
    }
  }



  function down() {
    if(level.selected.y < 3) {
      select(level.selected.x, ++level.selected.y);
      update();
    }
  }



  function select(x, y) {
    //increase the number in the selected cell
    cell(level.selected.x, level.selected.y, cell(level.selected.x, level.selected.y)+1);
  }



  // Function: update
  //
  // goes through the model(the story), draws the board accordingly,
  // and checks if it's a win scenario
  function update() {
    if(story[bookmark].type == 'level') {
      //go through the board and clear it of all the "selected" classes
      $('td.selected').removeClass('selected');

      cells[level.selected.x][level.selected.y].addClass('selected');

      //check if it's a win
      if(isWin()) {
        advanceStory();
      }
    }
  }



  // Function: loadScreen
  //
  // gets the level in the current page of the story, parses
  // it, and puts it in the grid
  function loadScreen() {
    if(story[bookmark].type == 'level') {
      level = story[bookmark];
      for(var i=0;i<story[bookmark].contents.length;++i) {
        cell(i%4,Math.floor(i/4),story[bookmark].contents[i]);
      }

      level.selected = story[bookmark].initialSelected;

      //fade in the level
      board.fadeIn(options['fade'], function() {
        //put the level number in the corner
        levelText.html("level " + level.number + "/" + numLevels());
      });
    }
    else if(story[bookmark].type == 'overlay') {
      //put the text from the thingy into the overlay
      var title   = story[bookmark].contents[0].title;
      var content = story[bookmark].contents[0].content;
      var butt    = story[bookmark].contents[0].button;

      $('#overlay > h1').html(title);
      $('#overlay > p').html(content);
      button.html(butt);

      overlay.fadeIn(options['fade']);
    }

    update();
  }



  function reset() {
    //
  }



  function isWin() {
    var value = cell(0,0);
    for(var i=0;i<4;++i) {
      for(var j=0;j<4;++j) {
        if(cell(i,j) != value)
          return false
      }
    }

    return true;
  }



  function cell(x, y, value) {
    //either gets the contents of x, y or sets them
    if(arguments.length==3) {
      cells[x][y].html(value);
    }
    else {
      //return the value
      return parseInt(cells[x][y].html());
    }
  }



  function start() {
    //put the level number in the corner
    levelText.html("level 0/" + numLevels());
    loadScreen(); //loads either the overlay or the bookmark, whatever is necessary
  }


  function fadeOut(callback) {
    board.fadeOut(options['fade']);
    overlay.fadeOut(options['fade'], callback);
  }


  function advanceStory() {
    if(++bookmark < story.length) {
      fadeOut(loadScreen);
    }
    else {
      //show the end
      end();
    }
  }



  //function: numLevels
  //
  //gets the number of levels in the story
  function numLevels() {
    //go through the stuff in the story
    var sum = 0;
    for(var i=0;i<story.length;++i) {
      if(story[i].type=='level') {
        ++sum;
      }
    }
    return sum;
  }

  button.click(function() {
    advanceStory();
  });

  function end() {
    alert('the end!');
  }

  $.getJSON('story.json', function(data) {
    story = data;
    start();
  });
});
