/* gulpfile.js */

const uswds = require('@uswds/compile');

/**
 * USWDS version
 */

uswds.settings.version = 3;

/**
 * Path settings
 * Set as many as you need
 */

uswds.paths.dist.css = './dist/assets/uswds/css';
uswds.paths.dist.js = './dist/assets/uswds/js';
uswds.paths.dist.img = './dist/assets/uswds/img';
uswds.paths.dist.fonts = './dist/assets/uswds/fonts';
uswds.paths.dist.theme = './sass';

/**
 * Exports
 * Add as many as you need
 */

// Manual compile (for icons)
exports.compile = uswds.compile;

// Update USWDS
exports.updateUswds = uswds.updateUswds;

// Run always
exports.default = uswds.watch;

exports.copyAll = uswds.copyAll;
