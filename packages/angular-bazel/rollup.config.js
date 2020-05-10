const node = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

module.exports = {
  plugins: [
    node({
      mainFields: ['browser', 'es2015', 'module', 'jsnext:main', 'main'],
    }),
    commonjs(),
  ],

  // https://stackoverflow.com/a/43556986/8586803
  onwarn: function (warning) {
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    console.warn(warning.message);
  },
};
