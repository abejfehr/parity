var Overlay = (function() {
  // Parts of the DOM
  var button;
  var overlay;

  // Other variables
  var active = false;

  // Handler for when the overlay button is pressed
  var pressButton = function() {
    if(active) {
      button.addClass('active'); //TODO: implement this properly
      mediator.publish('story_advance');
    }
  };

  // Renders the overlay
  var render = function(data) {
    overlay.fadeOut(options.fade, function() {
      mediator.publish('board_set_inactive');
      overlay.fadeIn(options.fade);
      active = true;

      var title   = data.title;
      var content = data.text;
      var action  = data.button;

      $('#overlay > h1').html(title);
      $('#overlay > #content').html(content);
      if(action) {
        // There's a very special case here if the game has been completed
        if(action == "%fb%") {
//          $('#holder').html('<a href="#">let me do it again.</a>');
        }
        else {
          button.show();
          button.html(action);
        }
      }
      else
        button.hide();
    });
  };

  // Fades out the overlay and sets it as inactive
  var setInactive = function() {
    overlay.fadeOut(options.fade);
    active = false;
  };

  var domReady = function() {
    button = $('#overlay > #holder > button');
    overlay = $('#overlay');

    // Event Bindings
    button.on('click', pressButton);
  };

  // The facade
  return {
    pressButton: pressButton,
    render: render,
    setInactive: setInactive,
    domReady: domReady
  };
}());

// Add the mediator to the module
mediator.installTo(Overlay);

// Subscribe to messages

// Listen for space and enter to forward the events to the button press
Overlay.subscribe('controls_key_space', Overlay.pressButton);
Overlay.subscribe('controls_key_enter', Overlay.pressButton);

// Listen for instruction to draw the overlay
Overlay.subscribe('overlay_render', Overlay.render);

// Listen for instruction to deactivate this overlay
Overlay.subscribe('overlay_set_inactive', Overlay.setInactive);

Overlay.subscribe('loader_dom_ready', Overlay.domReady);
