var Main = function() {
  var self = this;
  var state  = {
    recorder: null
  };
  self.state   = state;
  self.message = null;
  self.bubble  = null;
  self.mime    = MediaRecorder.isTypeSupported('audio/webm')? 'audio/webm' : 'audio/ogg';

  var init = function() {
    self.message = document.getElementById('message');
    self.bubble  = document.getElementById('bubble');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia supported.');
      navigator.mediaDevices.getUserMedia({audio: true, video: false})
        .then(onSuccess)
        .catch(onError);
    } else {
      console.log('getUserMedia not supported on your browser!');
    };
  };

  var onSuccess = function(stream) {
    recorder(stream);
    control(stream);
    visualize(stream);
  };

  var onError = function(err) {
    console.log('The following error occured: ' + err);
  };

  var onSpeech = function() {
    var response = JSON.parse(this.responseText);
    console.log(response);

    if(response.human) {
      message.innerHTML = response.human;
    } else {
      message.innerHTML = "-";
    }

    bubble.className = "";
    bubble.innerHTML = response.robot;
  };

  // Creates a recorder
  var recorder = function(stream) {
    var recorderOpts = {audioBitsPerSecond: 16000, mimeType: self.mime};
    state.recorder   = new MediaRecorder(stream, recorderOpts);

    var non_silence = 0;
    var chunks = [];

    state.recorder.registerSound = function() {
      non_silence++;
    };

    state.recorder.hasSound = function() {
      return non_silence > 0;
    };

    state.recorder.restart = function() {
      if(state.recorder.state == 'recording') {
        state.recorder.stop();
      }
      state.recorder.start();
    };

    state.recorder.ondataavailable = function(e) {
      chunks.push(e.data);
    };

    state.recorder.onstart = function(e) {
      non_silence = 0;
      chunks = [];
    };

    state.recorder.onstop = function(e) {
      if(state.recorder.hasSound()) {
        bubble.innerHTML = "&nbsp;";
        bubble.className = "processing";

        var blob = new Blob(chunks, { 'type' : self.mime });
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/speech', true);
        xhr.onload = onSpeech;
        xhr.send(blob);

        console.log("Sending utterance");
      }
    };
  };

  // Used to detect silence and when to start/stop recording
  var control = function(stream) {
    var context  = new AudioContext();
    var source   = context.createMediaStreamSource(stream);
    var analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    analyser.minDecibels = -40;

    source.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);
    const silenceDelay = 1000;
    var silenceStart = performance.now();

    var isSilence = function(data) {
      return !data.some(v => v);
    };

    var isLongSilence = function (now, start) {
      return (now - start) > silenceDelay;
    };

    var detect = function(time) {
      requestAnimationFrame(detect);

      analyser.getByteFrequencyData(data);

      if (isSilence(data)) {
        if(isLongSilence(time, silenceStart)) {
          console.log("restart recording");
          state.recorder.restart();
          silenceStart = time;
        }
      } else {
        console.log("sound registered");
        state.recorder.registerSound();
        silenceStart = time;
      }
    };

    detect();
  };

  var visualize = function(stream) {
    var context  = new AudioContext();
    var source   = context.createMediaStreamSource(stream);
    var analyser = context.createAnalyser();
    analyser.fftSize = 1024;

    source.connect(analyser);

    new Visualize(analyser);
  };

  init();
};

window.onload = function() {
  new Main();
};
