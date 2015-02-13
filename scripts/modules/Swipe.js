var Swipe = (function() {

  var domReady = function() {
    // Adds an event listener to the entire document
    $('#swipeArea').swipe({
      //Generic swipe handler for all directions
      swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
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
       threshold: 0,
       allowPageScroll: "none"
    });
  };

  // This module doesn't need any public interface, it only publishes
  return {
    domReady: domReady
  };
}());

// Add the mediator to the module
mediator.installTo(Swipe);

Swipe.subscribe('loader_dom_ready', Swipe.domReady);