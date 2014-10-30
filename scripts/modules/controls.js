//define the module
var ControlModule = (function() {
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
  });
  return { }
}())

//add the mediator to the module
mediator.installTo(ControlModule);

//no messages to subscribe to