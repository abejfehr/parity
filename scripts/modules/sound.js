var Sound = (function() {
  var MAX_VOLUME = 0.6
  var volume = 0;

  mediator.publish('sound_volume_changed', volume);

  var play = function(num) {
    var audio = new Audio(); // Create the HTML5 audio element
    var wave = new Riffwave();
    var data = [];
    var frequencies = [220,246.94,261.63,293.66,329.63,349.23,392,440,493.88,
    523.25,587.33,659.25,698.46,783.99,880,987.77,1046.50,1174.66,1318.51,
    1396.91,1567.98,1760,1975.53,2093,2349.32,2637.02,2793.83,3135.96,3520,
    3951.07];

    wave.header.sampleRate = 44100; // Set sample rate to 44KHz
    wave.header.numChannels = 1;

    // Cap the number so it's always within the frequency list
    num += frequencies.length/2;
    if(num > frequencies.length-1)
      num = frequencies.length-1;
    else if(num < 0)
      num = 0;

    var i = 0;
    while (i<100000) {
      var t = i/wave.header.sampleRate;
      data[i++] = 128+Math.round(127*Math.sin(frequencies[num]*t*2*Math.PI));
    }

    wave.make(data);
    audio.src = wave.dataURI;
    audio.volume = volume;
    fadeOut(audio, 250, 0, 1);

    // Play the sound
    audio.play();
  }

  var isMuted = function() {
    return !volume;
  }

  var toggleMute = function() {
    volume = (volume ? 0 : MAX_VOLUME);
    mediator.publish('sound_volume_changed', volume);
  }

  // The facade
  return {
    play:play,
    isMuted:isMuted,
    toggleMute:toggleMute
  }
}())

// Add the mediator to the module
mediator.installTo(Sound);

// Subscribe to messages

Sound.subscribe('sound_play_tone', Sound.play);
Sound.subscribe('sound_toggle_mute', Sound.toggleMute);