import isStatelessComponent from './isStatelessComponent';

export default function ({ Plugin, types: t }) {
  return {
    visitor: {
      Program(path, state) {
        //look at plugin options, rip otu any false-y options, keep the truth-y.
        const truthyStateOpts = Object.keys(state.opts).reduce(function(prev, curr) {
                                  if (state.opts[curr]) prev[curr] = state.opts[curr];
                                  return prev;
                              }, {});
        //take truthy state opts object and turn it into an array of keys.
        const truthyOptKeys = Object.keys(truthyStateOpts);
        // On program start, do an explicit traversal up front for this plugin.
        path.traverse({
          ObjectProperty: {
            exit(path) {
              const node = path.node;
              if (node.computed || truthyOptKeys.indexOf(node.key.name) < 0) {
                return;
              }

              const parent = path.findParent((parent) => {
                if (parent.type !== 'CallExpression') {
                  return false;
                }

                return parent.get('callee').matchesPattern('React.createClass');
              });

              if (parent) {
                path.remove();
              }
            }
          },
          ClassProperty(path) {
            const {
              node,
              scope,
            } = path;

            if (truthyOptKeys.indexOf(node.key.name) >= 0) {
              let className = scope.block.id.name;
              let binding = scope.getBinding(className);
              let superClass = binding.path.get('superClass');

              if (superClass.matchesPattern('React.Component') || superClass.node.name === 'Component') {
                path.remove();
              } else if (superClass.node.name) { // Check for inheritance
                className = superClass.node.name;
                binding = scope.getBinding(className);
                superClass = binding.path.get('superClass');

                if (superClass.matchesPattern('React.Component') || superClass.node.name === 'Component') {
                  path.remove();
                }
              }
            }
          },
          AssignmentExpression(path) {
            const {
              node,
              scope,
            } = path;

            if (node.left.computed || !node.left.property || truthyOptKeys.indexOf(node.left.property.name) < 0) {
              return;
            }

            const className = node.left.object.name;
            const binding = scope.getBinding(className);

            if (!binding) {
              return;
            }

            if (binding.path.isClassDeclaration()) {
              const superClass = binding.path.get('superClass');
              if (superClass.matchesPattern('React.Component') || superClass.matchesPattern('Component')) {
                path.remove();
              }
            } else if (isStatelessComponent(binding.path)) {
              path.remove();
            }
          }
        });
      }
    }
  };
}
