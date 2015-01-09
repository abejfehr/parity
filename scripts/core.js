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
  }


//load the loader, the only thing that needs to be loaded here
require(['modules/Loader'], function() {
  mediator.publish('loader_load_modules');
});
