var Window = (function() {

  // Adds an event listener to the entire document
  $(window).on('resize', function() {
      mediator.publish('window_resized');
  });

  // This module doesn't need any public interface, it only publishes
  return { }
}())

// Add the mediator to the module
mediator.installTo(Window);