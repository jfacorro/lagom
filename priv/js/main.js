var Main = function() {
  var self = this;
  var state  = {
    recorder: null,
    chunks: []
  };
  self.state   = state;
  self.status  = null;
  self.message = null;
  self.bubble  = null;
  self.mime    = MediaRecorder.isTypeSupported('audio/webm')? 'audio/webm' : 'audio/ogg';

  var init = function() {
    self.status  = document.getElementById('status');
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

    state.recorder.ondataavailable = function(e) {
      state.chunks.push(e.data);
    };

    state.recorder.onstart = function(e) {
      state.chunks = [];
    };

    state.recorder.onstop = function(e) {
      bubble.innerHTML = "&nbsp;";
      bubble.className = "processing";

      var blob = new Blob(state.chunks, { 'type' : self.mime });
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/speech', true);
      xhr.onload = onSpeech;
      xhr.send(blob);

      console.log(blob);

      self.status.innerHTML = "Listening...";
    };
  };

  // Used to detect silence and when to start/stop recording
  var control = function(stream) {
    var context  = new AudioContext();
    var source   = context.createMediaStreamSource(stream);
    var analyser = context.createAnalyser();
    analyser.fftSize = 32;
    analyser.minDecibels = -40;

    source.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);
    const silenceDelay = 500;
    var silenceStart = performance.now();

    var detect = function(time) {
      requestAnimationFrame(detect);

      var isRecording = state.recorder.state == "recording";
      analyser.getByteFrequencyData(data);

      if (data.some(v => v)) {
        if (!isRecording) {
          state.recorder.start();
          self.status.innerHTML = "Recording...";
          console.log("started recording");
        }
        silenceStart = time;
      } else if (isRecording && time - silenceStart > silenceDelay){
        console.log("stopped recording");
        state.recorder.stop();
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
