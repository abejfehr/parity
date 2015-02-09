var Keyboard = (function() {

  // Adds an event listener to the entire document
  document.addEventListener('keydown', function(event) {
    if(event.keyCode == 13) {
      mediator.publish('controls_key_enter');
    }
    else if(event.keyCode == 32) {
      mediator.publish('controls_key_space');
    }
    else if(event.keyCode == 37) {
      mediator.publish('controls_key_left');
    }
    else if(event.keyCode == 38) {
      mediator.publish('controls_key_up');
    }
    else if(event.keyCode == 39) {
      mediator.publish('controls_key_right');
    }
    else if(event.keyCode == 40) {
      mediator.publish('controls_key_down');
    }
    else if(event.keyCode == 82) {
      mediator.publish('controls_key_r');
    }
  });

  // This module doesn't need any public interface, it only publishes
  return { };
}());

// Add the mediator to the module
mediator.installTo(Keyboard);
