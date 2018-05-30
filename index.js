const lambdalocal = require('lambda-local');
const payload = {};
lambdalocal
  .execute({ event: payload, lambdaPath: 'getCities.js', timeoutMs: 3000 })
  .then(function(done) {
    console.log(done);
  });
