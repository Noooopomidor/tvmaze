import { bindings, readyFlag, readyValue } from './bindings.mjs'
import { viewResult } from './render-expression.mjs'

const presenterCall = (node, parameter) => {
  if (
    node?.type !== 'CallExpression' ||
    node.callee.type !== 'Identifier' ||
    node.callee.name !== 'usePresenter'
  )
    return false
  return parameter
    ? node.arguments.length === 1 &&
        node.arguments[0].type === 'Identifier' &&
        node.arguments[0].name === parameter
    : node.arguments.length === 0
}

const earlyExit = (statement, names) => {
  let consequent = statement.consequent
  if (consequent?.type === 'BlockStatement' && consequent.body.length === 1)
    consequent = consequent.body[0]
  return (
    statement.type === 'IfStatement' &&
    !statement.alternate &&
    readyFlag(statement.test, names) &&
    consequent?.type === 'ReturnStatement' &&
    consequent.argument?.type === 'Literal' &&
    consequent.argument.value === null
  )
}

export const validViewBody = (component, usesPresenter, staticNames) => {
  if (component.async || component.generator || component.params.length > 1)
    return false
  const parameter = component.params[0]
  if (usesPresenter && parameter && parameter.type !== 'Identifier')
    return false
  const parameterNames = bindings(parameter)
  if (!parameterNames) return false
  const values = new Set(staticNames)
  const models = new Set()
  if (!usesPresenter)
    parameterNames.forEach((name) => {
      values.add(name)
      models.add(name)
    })
  if (component.body.type !== 'BlockStatement')
    return !usesPresenter && viewResult(component.body, values)
  const statements = component.body.body
  let calls = 0
  for (const statement of statements.slice(0, -1)) {
    if (statement.type === 'IfStatement') {
      if ((usesPresenter && calls !== 1) || !earlyExit(statement, values))
        return false
      continue
    }
    if (statement.type !== 'VariableDeclaration' || statement.kind !== 'const')
      return false
    for (const { id, init } of statement.declarations) {
      const names = bindings(id)
      if (!names || !init) return false
      if (usesPresenter && presenterCall(init, parameter?.name)) {
        if (++calls !== 1 || models.size) return false
        if (id.type === 'Identifier') models.add(id.name)
      } else if (
        !['Identifier', 'MemberExpression', 'ChainExpression'].includes(
          init.type,
        ) ||
        !readyValue(init, models)
      )
        return false
      for (const name of names) values.add(name)
    }
  }
  const last = statements.at(-1)
  return (
    calls === Number(usesPresenter) &&
    last?.type === 'ReturnStatement' &&
    viewResult(last.argument, values)
  )
}
