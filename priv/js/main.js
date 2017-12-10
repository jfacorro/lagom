var Main = function() {
  var self = this;
  var state  = {
    recorder: null,
    chunks: []
  };
  self.state = state;

  var init = function() {
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
    console.log(this.responseText);
    console.log(response);
    if(response.results) {
      var res = response.results[0];
      var alt = res.alternatives[0];
      var message = document.getElementById('message');
      message.innerHTML = alt.transcript;
    }
  };

  var recorder = function(stream) {
    var recorderOpts = {audioBitsPerSecond: 16000, mimeType: 'audio/webm'};
    state.recorder   = new MediaRecorder(stream, recorderOpts);

    state.recorder.ondataavailable = function(e) {
      state.chunks.push(e.data);
    };

    state.recorder.onstart = function(e) {
      state.chunks = [];
    };

    state.recorder.onstop = function(e) {
      var blob = new Blob(state.chunks, { 'type' : 'audio/webm' });
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/speech', true);
      xhr.onload = onSpeech;
      xhr.send(blob);

      console.log(blob);
    };
  };

  var control = function(stream) {
    var context  = new AudioContext();
    var source   = context.createMediaStreamSource(stream);
    var analyser = context.createAnalyser();
    analyser.fftSize = 1024;
    analyser.minDecibels = -50;

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
    analyser.fftSize = 2048;

    source.connect(analyser);

    new Visualize(analyser);
  };

  init();
};

window.onload = function() {
  new Main();
};
