const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 86400 }); // Cache for 24 hours

module.exports = cache;