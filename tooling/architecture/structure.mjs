import path from 'node:path'
import ts from 'typescript'
import { componentFor, inLogic, isPublicArea } from './owners.mjs'

const emptyPresenter = (text) => {
  const source = ts.createSourceFile(
    'usePresenter.ts',
    text,
    ts.ScriptTarget.Latest,
    true,
  )
  let useful = false
  const visit = (node) => {
    if (
      ts.isCallExpression(node) ||
      ts.isBinaryExpression(node) ||
      ts.isConditionalExpression(node) ||
      ts.isTemplateExpression(node) ||
      ts.isIfStatement(node) ||
      ts.isPrefixUnaryExpression(node) ||
      ts.isAwaitExpression(node)
    )
      useful = true
    ts.forEachChild(node, visit)
  }
  visit(source)
  return !useful
}

export const checkStructure = (files, components, publicTypes = new Set()) => {
  const errors = []
  const seen = new Set()
  for (const view of [...files.keys()].filter(
    (file) =>
      file.startsWith('src/') &&
      file.endsWith('.tsx') &&
      file !== 'src/main.tsx',
  )) {
    const directory = path.posix.dirname(view)
    if (seen.has(directory))
      errors.push(`${view}: multiple component files share one folder`)
    seen.add(directory)
    const expected =
      directory === 'src/app' ? 'App' : path.posix.basename(directory)
    if (path.posix.basename(view, '.tsx') !== expected)
      errors.push(`${view}: component requires its own named folder`)
    const presenter = `${directory}/logic/usePresenter.ts`
    if (files.has(presenter) && emptyPresenter(files.get(presenter))) {
      errors.push(
        `${presenter}: props-only forwarding does not require a Presenter`,
      )
    }
  }
  for (const file of files.keys()) {
    if (!file.startsWith('src/')) continue
    const oldFolder = file
      .split('/')
      .slice(0, -1)
      .find(
        (folder) =>
          /^(?:logic|tasks)$/i.test(folder) && folder !== folder.toLowerCase(),
      )
    if (oldFolder)
      errors.push(
        `${file}: architecture folder ${oldFolder} must use lowercase`,
      )
    const owner = componentFor(file, components)
    if (
      /\/usePresenter\.[cm]?[jt]sx?$/.test(file) &&
      (!inLogic(file) || !owner || file !== `${owner}/logic/usePresenter.ts`)
    )
      errors.push(`${file}: Presenter must be in its own component logic/`)
    if (inLogic(file) && !owner)
      errors.push(`${file}: logic requires a component owner`)
    if (!owner || components.get(owner) === file || inLogic(file)) continue
    if (owner === 'src/app' && isPublicArea(file)) continue
    if (/\.[cm]?[jt]s$/.test(file) && !publicTypes.has(file)) {
      errors.push(`${file}: component helpers and hooks belong in logic/`)
    }
  }
  return errors
}
