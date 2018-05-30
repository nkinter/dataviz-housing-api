const lambdalocal = require('lambda-local');
const payload = {
    metric: 'inventory',
    city: 'Charlotte,NC'};
lambdalocal
  .execute({ event: payload, lambdaPath: 'querypg.js', timeoutMs: 3000 })
  .then(function(done) {
    console.log(done);
  });
