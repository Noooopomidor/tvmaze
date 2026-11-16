import path from 'node:path'
import ts from 'typescript'
import { inTasks, taskModule } from './owners.mjs'

const scenarioName = (name) =>
  /^[a-z][a-zA-Z0-9]*$/.test(name) &&
  !/^use[A-Z]/.test(name) &&
  !/^(?:data|state|results|shows|products|settings|options)(?:$|[A-Z])/.test(
    name,
  )
const browserApis = new Set([
  'window',
  'document',
  'history',
  'location',
  'localStorage',
  'sessionStorage',
  'navigator',
  'DOMParser',
  'fetch',
])

export const checkTasks = (files) => {
  const errors = []
  for (const [file, text] of files) {
    if (
      !file.startsWith('src/') ||
      !inTasks(file) ||
      !/\.[cm]?[jt]sx?$/.test(file)
    )
      continue
    const root = file.split('/tasks/')[0]
    if (root !== 'src/app' && !root.endsWith('/logic')) {
      errors.push(
        `${file}: Tasks must be global app/tasks or local Component/logic/tasks`,
      )
    }
    const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true)
    let mainFunctions = 0
    const visit = (node) => {
      if (
        ts.isJsxElement(node) ||
        ts.isJsxSelfClosingElement(node) ||
        ts.isJsxFragment(node)
      ) {
        errors.push(`${file}: Task cannot contain JSX`)
      }
      if (ts.isCallExpression(node) || ts.isNewExpression(node)) {
        const expression = node.expression
        if (ts.isIdentifier(expression) && browserApis.has(expression.text)) {
          errors.push(
            `${file}: platform/transport operation ${expression.text} belongs in a service`,
          )
        }
      }
      if (
        ts.isPropertyAccessExpression(node) &&
        ts.isIdentifier(node.expression) &&
        browserApis.has(node.expression.text)
      )
        errors.push(`${file}: direct browser API belongs in a service`)
      ts.forEachChild(node, visit)
    }
    visit(ast)
    if (!taskModule(file).entry) continue
    for (const statement of ast.statements) {
      const exported = statement.modifiers?.some(
        (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
      )
      if (!exported) continue
      const declarations = ts.isVariableStatement(statement)
        ? statement.declarationList.declarations
        : []
      for (const declaration of declarations) {
        if (
          !declaration.initializer ||
          !ts.isArrowFunction(declaration.initializer)
        )
          continue
        mainFunctions += 1
        if (!scenarioName(declaration.name.getText(ast)))
          errors.push(
            `${file}: Task names use lowerCamelCase actions, not hooks/data nouns`,
          )
      }
    }
    if (mainFunctions !== 1 && path.posix.parse(file).name !== 'index') {
      errors.push(`${file}: a Task entry exports exactly one scenario function`)
    }
  }
  return errors
}
