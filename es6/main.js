// es6 module syntax
import * as Prism from 'prismjs';
import * as WC from 'waves-basic-controllers';

// shared context
var ctx = new AudioContext();

// --------------------------------------------
// tremolo example
// --------------------------------------------
(function() {

  const defaultFrequency = 300;
  const defaultLfoFrequency = 4;
  const defaultDepth = 0.2;

  // 2. create source
  const sine = ctx.createOscillator();
  sine.type = 'sine';
  sine.frequency.value = defaultFrequency;

  // 3. frequency modulation
  const lfo = ctx.createOscillator();
  lfo.frequency.value = defaultLfoFrequency;
  lfo.type = 'sine';
  // frequency modulation amplitude
  const depth = ctx.createGain();
  depth.gain.value = defaultDepth;

  //
  const amplitude = ctx.createGain();
  amplitude.gain.value = 0.8;

  const master = ctx.createGain();
  master.gain.value = 0;

  // create graph
  lfo.connect(depth);
  depth.connect(amplitude.gain);

  sine.connect(amplitude);
  amplitude.connect(master);
  master.connect(ctx.destination);

  // start
  const now = ctx.currentTime;
  sine.start(now);
  lfo.start(now);

  new WC.Toggle('start / stop', false, '#tremolo-controllers', function(flag) {
    const now = ctx.currentTime;
    master.gain.value = flag ? 1 : 0;
  });

  new WC.Slider('sine frequency', 20, 1000, 1, defaultFrequency, 'Hz', 'large', '#tremolo-controllers', function(value) {
    sine.frequency.setValueAtTime(value, ctx.currentTime);
  });

  new WC.Slider('mod frequency', 0, 100, 0.1, defaultLfoFrequency, 'Hz', 'large', '#tremolo-controllers', function(value) {
    lfo.frequency.setValueAtTime(value, ctx.currentTime);
  });

  new WC.Slider('mod depth', 0, 1, 0.01, defaultDepth, '.', 'large', '#tremolo-controllers', function(value) {
    depth.gain.setValueAtTime(value, ctx.currentTime);
  });

}());


