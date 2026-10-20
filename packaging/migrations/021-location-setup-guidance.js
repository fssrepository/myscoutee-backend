// Correct the packaged landing/setup guides through the existing default/custom
// catalog policy. Historical migration inputs and operator choices stay intact.
const fs = require('fs');
const source = fs.readFileSync(process.env.MYSCOUTEE_MIGRATION_DIRECTORY
    + '/017-release-catalog-refresh.js', 'utf8');
const executionFile = process.env.MYSCOUTEE_MIGRATION_DIRECTORY + '/.running-location-guide-refresh.js';
fs.writeFileSync(executionFile, '{\n' + source + '\n}', {mode: 0o600});
try { load(executionFile); }
finally { fs.unlinkSync(executionFile); }
