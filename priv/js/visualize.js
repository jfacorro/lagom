var Visualize = function(analyser) {
  var self = this;
  var canvas = document.getElementById('visualize');
  var context = canvas.getContext("2d");

  var bufferSize = analyser.frequencyBinCount;

  var data = new Uint8Array(bufferSize);

  var draw = function() {
    var width  = canvas.width;
    var height = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(data);

    context.fillStyle = 'rgb(51, 51, 51)';
    context.fillRect(0, 0, width, height);

    context.lineWidth = 2;
    context.strokeStyle = 'rgb(255, 255, 255)';

    context.beginPath();

    var sliceWidth = width * 1.0 / bufferSize;
    var x = 0;


    for(var i = 0; i < bufferSize; i++) {

      var v = data[i] / 128.0;
      var y = v * height/2;

      if(i === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }

      x += sliceWidth;
    }

    context.lineTo(canvas.width, canvas.height/2);
    context.stroke();
  };

  draw();
};
