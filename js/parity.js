//
// Parity
// Author:  Abe Fehr
// Version: 0.1
//

var level = 0;

var levels = [
  {
    contents: [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ]
  }
]

loadLevel();
/*

STEPS
=====
* keep track of what "level" we're on
* at the beginning of the game, show the instructions
 (and maybe give the option to skip)
* show the level, and maybe the level stores what instructions come before it...
* are the levels stored as objects?
*/

function loadLevel() {
  //get the current level, parse it, and put it in the boxes
  for(var i=0;i<levels[level].contents.length;++i){
    cell(i%4,Math.floor(i/4),levels[level].contents[i]);
  }
  $('#level').html("level " + level);
}

function levelFinished() {
  //checks to see if the level is finished
}

function cell(x, y, value) {
  //either gets the contents of x, y or sets them
  if(arguments.length==3) {
    $('td[data-x="' + x + '"][data-y="' + y + '"]').html(value);
  }
  else {
    //return the value
    return $('td[data-x="' + x + '"][data-y="' + y + '"]').html();
  }
}
