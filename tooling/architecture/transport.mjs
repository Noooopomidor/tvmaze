import ts from 'typescript'
import { inTasks } from './owners.mjs'

const networkNames = new Set([
  'fetch',
  'XMLHttpRequest',
  'WebSocket',
  'EventSource',
])
const networkPackages =
  /^(?:(?:node:)?https?$|axios|ky|got|undici|node-fetch|graphql-request)(?:\/|$)/

const hasTransport = (file, text) => {
  const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true)
  const options = { noLib: true, noResolve: true }
  const host = ts.createCompilerHost(options)
  host.getSourceFile = (name) => (name === file ? ast : undefined)
  const checker = ts.createProgram([file], options, host).getTypeChecker()
  let found = false
  const visit = (node) => {
    const globalReference =
      ts.isIdentifier(node) &&
      networkNames.has(node.text) &&
      !checker.getSymbolAtLocation(node)?.declarations?.length &&
      (!ts.isPropertyAccessExpression(node.parent) ||
        node.parent.expression === node)
    const globalMember =
      ts.isPropertyAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      !checker.getSymbolAtLocation(node.expression)?.declarations?.length &&
      ['globalThis', 'window'].includes(node.expression.text) &&
      networkNames.has(node.name.text)
    if (
      (globalReference || globalMember) &&
      !ts.isPropertyAssignment(node.parent) &&
      !ts.isPropertySignature(node.parent) &&
      !ts.isTypeNode(node.parent)
    )
      found = true
    ts.forEachChild(node, visit)
  }
  visit(ast)
  return found
}

export const checkPresenterTransport = (files, graph) => {
  const transports = new Set(
    [...files]
      .filter(
        ([file, text]) =>
          /\.[cm]?[jt]sx?$/.test(file) && hasTransport(file, text),
      )
      .map(([file]) => file),
  )
  const errors = []
  for (const start of graph.keys()) {
    if (!start.endsWith('/logic/usePresenter.ts')) continue
    const visited = new Set()
    const visit = (source) => {
      if (visited.has(source) || inTasks(source)) return
      visited.add(source)
      if (transports.has(source))
        errors.push(
          `${start}: API transport belongs in a service via Task: ${source}`,
        )
      for (const edge of graph.get(source) ?? []) {
        if (edge.typeOnly) continue
        if (networkPackages.test(edge.packageName ?? edge.specifier))
          errors.push(
            `${start}: HTTP client requires a Task boundary: ${edge.specifier}`,
          )
        if (edge.target) visit(edge.target)
      }
    }
    visit(start)
  }
  return errors
}
