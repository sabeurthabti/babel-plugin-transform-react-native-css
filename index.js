const RNC = require('react-native-css');
const nodePath = require('path');
const css = new RNC();

function startTransform(input) {
  return css.parseSync(input);
}

module.exports = ({ types : t }) => {
  return {
    visitor : {
      ImportDeclaration(path, state) {

        const resolvePath = path.node.source.value;

        if (resolvePath.endsWith('css')) {
          const importName = path.node.specifiers[0].local.name;
          const name = resolvePath.replace(/\.\.\/|\.\//g, '').replace(/\//g, '_').split('.')[0];
          let absolutePath = nodePath.resolve(nodePath.dirname(state.file.opts.filename), resolvePath),
            relativePath = `${nodePath.dirname(absolutePath)}/_transformed/${name}.js`;
          const css = startTransform(absolutePath, nodePath.resolve(relativePath));

          if (css) {
            path.replaceWith(t.variableDeclaration('var', [
              t.variableDeclarator(
                t.identifier(importName),
                t.callExpression(
                  t.memberExpression(t.identifier('require(\'react-native\').StyleSheet'), t.identifier('ceate')),
                  [t.stringLiteral(JSON.stringify(css))]
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
