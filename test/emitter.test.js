const EventEmitter = require('events');

class Emt extends EventEmitter {}
const e = new Emt();

let i = 0;

e.on('increment', () => {
  if (i === 10) {
    console.log('finished');
  }
});

setInterval(() => {
  i += 1;
  e.emit('increment');
  console.log(i);
}, 400);
