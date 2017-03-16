const RNC = require('react-native-css');
const nodePath = require('path');
const css = new RNC();

function startTransform(input) {
  return css.parseSync(input);
}

module.exports = ({ types : t }) => {
  return {
    visitor : {
      CallExpression(path) {
        if (path.node.callee.name === 'require') {
          const scssFile = path.node.arguments[0];

          const absolutePath = nodePath.resolve(nodePath.dirname(scssFile.value), nodePath.parse(scssFile.value).base);

          if (absolutePath.endsWith('scss')) {
            console.error(`Please use es6 module and not commonjs; import style from '${scssFile.value}' `);
          }
        }

      },
      ImportDeclaration(path, state) {

        const resolvePath = path.node.source.value;

        if (resolvePath.endsWith('scss')) {
          const importName = path.node.specifiers[0].local.name;
          const absolutePath = nodePath.resolve(nodePath.dirname(state.file.opts.filename), resolvePath);

          const css = startTransform(absolutePath);
          const astToObjectLiteralAst = (n) => {
            if (typeof n !== 'object' || n === null) {
              return t.stringLiteral(n);
            } else if (Array.isArray(n)) {
              return t.arrayExpression(n.map(astToObjectLiteralAst));
            }
            return t.objectExpression(Object.keys(n).map((key) => {
              if (key === 'start' || key === 'end') return;

              const value = n[key];

              return t.objectProperty(
                t.identifier(key),
                astToObjectLiteralAst(value),
                false

              );
            }).filter(Boolean));
          };

          if (css) {
            path.replaceWith(
              t.variableDeclaration('var', [
                t.variableDeclarator(
                  t.identifier(importName),
                  t.callExpression(
                    t.memberExpression(t.identifier('require(\'react-native\').StyleSheet'), t.identifier('create')),
                    [astToObjectLiteralAst(css)]
                  )
                )
              ])
            );
          }
        }
      }
    }
  };
};
