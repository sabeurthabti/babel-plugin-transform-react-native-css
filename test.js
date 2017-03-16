const code = `
	import abc from './css/style.scss';
	const abcrequre = require('./css/style.scss');
	import style from './package';
	console.log(abc.body)
`;

const x = require('babel-core').transform(code, {
  presets : ['es2015'], 
  plugins : ['transform-object-rest-spread', './index.js']
});

console.log(x.code);