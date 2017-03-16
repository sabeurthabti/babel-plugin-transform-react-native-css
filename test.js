const code = `
	import abc from './css/style.scss.js';
	import style from './package';
	console.log(abc.body)
`;

const x = require('babel-core').transform(code, {
  plugins : ['./index.js']
});

console.log(x.code);