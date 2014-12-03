var Swipe = (function() {

  // Adds an event listener to the entire document
  $('#board').swipe( {
    //Generic swipe handler for all directions
    swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
      if(direction == 'left')
        mediator.publish('swipe_left_board');
      else if(direction == 'right')
        mediator.publish('swipe_right_board');
      else if(direction == 'up')
        mediator.publish('swipe_up_board');
      else if(direction == 'down')
        mediator.publish('swipe_down_board');
    },
    //Default is 75px, set to 0 for demo so any distance triggers swipe
     threshold:0
  });

  // This module doesn't need any public interface, it only publishes
  return { }
}())

// Add the mediator to the module
mediator.installTo(Swipe);