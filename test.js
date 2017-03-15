const code = `
	import abc from './style.scss';
	import style from './package';
	console.log(abc.body)
`;

const x = require('babel-core').transform(code, {
  plugins : ['./rnc-transform.js']
});

console.log(x.code);