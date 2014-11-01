// overlay.js(OverlayModule)
var OverlayModule = (function() {
  // Parts of the DOM
  var button = $('#overlay > #holder > button');
  var overlay = $('#overlay');

  // Other variables
  var active = false;

  // Handler for when the overlay button is pressed
  var pressButton = function() {
    if(active) {
      button.addClass('active'); //TODO: implement this properly
      mediator.publish('story_advance');
    }
  }

  // Renders the overlay
  var render = function(data) {
    overlay.fadeOut(options['fade'], function() {
      mediator.publish('board_set_inactive');
      overlay.fadeIn(options['fade']);
      active = true;

      var title   = data.title;
      var content = data.text;
      var action  = data.button;

      $('#overlay > h1').html(title);
      $('#overlay > #content').html(content);
      if(action) {
        button.show();
        button.html(action);
      }
      else
        button.hide();
    })
  }

  // Fades out the overlay and sets it as inactive
  var setInactive = function() {
    overlay.fadeOut(options['fade']);
    active = false;
  }

  // Event Bindings
  button.on('click', pressButton);

  // The facade
  return {
    pressButton: pressButton,
    render: render,
    setInactive: setInactive
  }
}())

// Add the mediator to the module
mediator.installTo(OverlayModule);

// Subscribe to messages

// Listen for space and enter to forward the events to the button press
OverlayModule.subscribe('controls_key_space', OverlayModule.pressButton);
OverlayModule.subscribe('controls_key_enter', OverlayModule.pressButton);

// Listen for instruction to draw the overlay
OverlayModule.subscribe('overlay_render', OverlayModule.render);

// Listen for instruction to deactivate this overlay
OverlayModule.subscribe('overlay_set_inactive', OverlayModule.setInactive);