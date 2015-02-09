// core.js

var mediator = (function() {
  var subscribe = function(channel, fn) {
    if(!mediator.channels[channel]) mediator.channels[channel] = [];
    mediator.channels[channel].push({ context: this, callback: fn });
    return this;
  },

  publish = function(channel) {
    if(!mediator.channels[channel]) return false;
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < mediator.channels[channel].length; i++) {
      var subscription = mediator.channels[channel][i];
      subscription.callback.apply(subscription.context, args);
    }
    return this;
  };

  return {
    channels: {},
    publish: publish,
    subscribe: subscribe,
    installTo: function(obj) {
      obj.subscribe = subscribe;
      obj.publish = publish;
    }
  };
}());

var options = {
    fade: 300, //the time in ms for the fade
    cookieName: 'parity_save_data'
  };

// Notify that the story is loaded
mediator.subscribe('story_story_loaded', function() {
  mediator.publish('loader_story_loaded');
});

// Start the game when the DOM is ready
$(document).ready(function() {
  mediator.publish('loader_dom_ready'); // Notify everyone we can work now
  mediator.publish('story_get_story');
});
