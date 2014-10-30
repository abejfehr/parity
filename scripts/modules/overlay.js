//define the module
var OverlayModule = (function() {
  var button      = $('#overlay > #holder > button');
  var overlay     = $('#overlay');

  var pressButton = function() {
    button.addClass('active'); //doesn't seem to work right now

    //advance the story, after fading out
    mediator.publish('story_advance');
  }

  button.on('click', pressButton);

  var render = function(data) {
    overlay.fadeOut(options['fade'], function() {
      overlay.fadeIn(options['fade']);

      //put the text from the thingy into the overlay
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

  return {
    pressButton: pressButton,
    render: render
  }
}())

//add the mediator to the module
mediator.installTo(OverlayModule);

//subscribe to messages
OverlayModule.subscribe('controls_key_space', OverlayModule.pressButton);
OverlayModule.subscribe('controls_key_enter', OverlayModule.pressButton);
OverlayModule.subscribe('overlay_render', OverlayModule.render);