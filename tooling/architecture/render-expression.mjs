import { readyFlag, readyValue } from './bindings.mjs'

const mapExpression = (node, names) => {
  const { callee, arguments: args } = node
  if (
    callee.type !== 'MemberExpression' ||
    callee.computed ||
    callee.property.name !== 'map'
  )
    return false
  if (!readyValue(callee.object, names) || args.length !== 1) return false
  const callback = args[0]
  if (callback.type !== 'ArrowFunctionExpression' || callback.async)
    return false
  if (!callback.params.every((param) => param.type === 'Identifier'))
    return false
  const scoped = new Set([
    ...names,
    ...callback.params.map((param) => param.name),
  ])
  let result = callback.body
  if (result.type === 'BlockStatement') {
    if (result.body.length !== 1 || result.body[0].type !== 'ReturnStatement')
      return false
    result = result.body[0].argument
  }
  return (
    ['JSXElement', 'JSXFragment'].includes(result?.type) &&
    renderExpression(result, scoped)
  )
}

export const renderExpression = (node, names) => {
  if (!node || node.type === 'JSXEmptyExpression' || node.type === 'JSXText')
    return true
  if (readyValue(node, names)) return true
  if (node.type === 'JSXExpressionContainer')
    return renderExpression(node.expression, names)
  if (node.type === 'JSXFragment')
    return node.children.every((child) => renderExpression(child, names))
  if (node.type === 'JSXElement') {
    return (
      node.openingElement.attributes.every((attribute) =>
        attribute.type === 'JSXSpreadAttribute'
          ? readyValue(attribute.argument, names)
          : !attribute.value || renderExpression(attribute.value, names),
      ) && node.children.every((child) => renderExpression(child, names))
    )
  }
  if (node.type === 'ConditionalExpression') {
    return (
      readyFlag(node.test, names) &&
      renderExpression(node.consequent, names) &&
      renderExpression(node.alternate, names)
    )
  }
  if (node.type === 'LogicalExpression') {
    return readyFlag(node.left, names) && renderExpression(node.right, names)
  }
  return node.type === 'CallExpression' && mapExpression(node, names)
}

export const viewResult = (node, names) =>
  (node?.type === 'Literal' && node.value === null) ||
  (['JSXElement', 'JSXFragment'].includes(node?.type) &&
    renderExpression(node, names))
