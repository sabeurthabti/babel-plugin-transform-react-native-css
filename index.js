const RNC = require('react-native-css');
const css = new RNC();

function startTransform(input) {
  return css.parseSync(input);
}

module.exports = ({ types : t }) => {
  return {
    visitor : {
      ImportDeclaration(path) {

        const resolvePath = path.node.source.value;

        console.log(resolvePath);
        if (resolvePath.endsWith('scss')) {
          const importName = path.node.specifiers[0].local.name;
          const css = startTransform(resolvePath);

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
