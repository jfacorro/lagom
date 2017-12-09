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
      navigator.mediaDevices.getUserMedia ({audio: true})
        .then(onSuccess)
        .catch(onError);
    } else {
      console.log('getUserMedia not supported on your browser!');
    };
  };

  var onSuccess = function(stream) {
    initRecorder(stream);
    initControl(stream);
  };

  var onError = function(err) {
    console.log('The following error occured: ' + err);
  };

  var initControl = function(stream) {
    var context  = new AudioContext();
    var source   = context.createMediaStreamSource(stream);
    var analyser = context.createAnalyser();
    analyser.fftSize = 2048;

    source.connect(analyser);

    new Visualize(analyser);
  };

  var initRecorder = function(stream) {
    state.recorder = new MediaRecorder(stream);
    state.recorder.ondataavailable = function(e) {
      state.chunks.push(e.data);
    };

    state.recorder.start();
  };

  init();
};

window.onload = function() {
  new Main();
};
