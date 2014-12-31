var Window = (function() {

  // Adds an event listener to the entire document
  $(window).on('resize', function() {
    mediator.publish('window_resized');
  });

  $(window).on('load', function() {
    mediator.publish('window_loaded');
  });

  if(window.navigator.userAgent.indexOf('iPhone') != -1) {
    if(!window.navigator.standalone)
      $('#title').fadeOut(options['fade']);
  }

  // This module doesn't need any public interface, it only publishes
  return { }
}())

// Add the mediator to the module
mediator.installTo(Window);