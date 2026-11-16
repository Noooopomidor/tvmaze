export const bindings = (pattern) => {
  if (!pattern) return []
  if (pattern.type === 'Identifier') return [pattern.name]
  if (pattern.type === 'RestElement') return bindings(pattern.argument)
  if (
    pattern.type === 'AssignmentPattern' &&
    ['Literal', 'Identifier'].includes(pattern.right.type)
  ) {
    return bindings(pattern.left)
  }
  if (pattern.type !== 'ObjectPattern') return null
  const result = []
  for (const property of pattern.properties) {
    if (
      property.computed ||
      !['Property', 'RestElement'].includes(property.type)
    )
      return null
    const names = bindings(
      property.type === 'Property' ? property.value : property.argument,
    )
    if (!names) return null
    result.push(...names)
  }
  return result
}

export const readyValue = (node, names) => {
  if (!node) return false
  if (node.type === 'Literal') return true
  if (node.type === 'Identifier')
    return names.has(node.name) || node.name === 'undefined'
  if (node.type === 'ChainExpression') return readyValue(node.expression, names)
  return (
    node.type === 'MemberExpression' &&
    readyValue(node.object, names) &&
    (!node.computed || node.property.type === 'Literal')
  )
}

export const readyFlag = (node, names) =>
  readyValue(node, names) ||
  (node?.type === 'UnaryExpression' &&
    node.operator === '!' &&
    readyValue(node.argument, names))
