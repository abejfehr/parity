var Window = (function() {

  // Adds an event listener to the entire document
  $(window).on('resize', function() {
    mediator.publish('window_resized');
  });

  $(window).on('load', function() {
    mediator.publish('window_loaded');
  });

  if(window.navigator.userAgent.indexOf('iPhone') != -1) {
    /*if(!window.navigator.standalone)*/
      /*$('#title').fadeOut(options['fade']);*/
      /* I used to have this here to be playable in the regular browser for
      iPhone, but have since decided to remove it. We'll see if I put it in the
      release */
  }

  // This module doesn't need any public interface, it only publishes
  return { };
}());

// Add the mediator to the module
mediator.installTo(Window);