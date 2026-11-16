import path from 'node:path'
import ts from 'typescript'

export const sourceImports = (file, text) => {
  const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true)
  const imports = []
  const visit = (node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier
    ) {
      const clause = node.importClause
      const elements =
        clause?.namedBindings?.elements ?? node.exportClause?.elements
      const typeOnly =
        node.isTypeOnly ||
        clause?.isTypeOnly ||
        (elements?.length &&
          elements.every((item) => item.isTypeOnly) &&
          !clause?.name)
      imports.push({
        specifier: node.moduleSpecifier.text,
        typeOnly: Boolean(typeOnly),
        reexport: ts.isExportDeclaration(node),
      })
    }
    if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference)
    ) {
      imports.push({
        specifier: node.moduleReference.expression?.text,
        typeOnly: node.isTypeOnly,
      })
    }
    if (ts.isImportTypeNode(node)) {
      imports.push({ specifier: node.argument.literal?.text, typeOnly: true })
    }
    if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        node.expression.getText(ast) === 'require')
    ) {
      const argument = node.arguments[0]
      imports.push({
        specifier:
          argument && ts.isStringLiteral(argument) ? argument.text : null,
        typeOnly: false,
      })
    }
    ts.forEachChild(node, visit)
  }
  visit(ast)
  return imports
}

export const importGraph = (root, files) => {
  const config = ts.readConfigFile(
    path.join(root, 'tsconfig.app.json'),
    ts.sys.readFile,
  )
  const { options } = ts.parseJsonConfigFileContent(
    config.config ?? {},
    ts.sys,
    root,
  )
  const graph = new Map()
  const errors = []
  for (const [file, text] of files) {
    if (!file.startsWith('src/') || !/\.[cm]?[jt]sx?$/.test(file)) continue
    const edges = []
    for (const imported of sourceImports(file, text)) {
      if (!imported.specifier) {
        errors.push(`${file}: computed module paths cannot be checked`)
        continue
      }
      const resolved = ts.resolveModuleName(
        imported.specifier,
        path.join(root, file),
        options,
        ts.sys,
      ).resolvedModule
      const modulePath = resolved?.resolvedFileName.split(path.sep).join('/')
      const externalName = modulePath?.match(
        /\/node_modules\/((?:@[^/]+\/)?[^/]+)/,
      )?.[1]
      const packageName =
        resolved?.packageId?.name ?? externalName ?? imported.specifier
      let target =
        resolved && !resolved.isExternalLibraryImport && !externalName
          ? path
              .relative(root, resolved.resolvedFileName)
              .split(path.sep)
              .join('/')
          : null
      if (!target && imported.specifier.startsWith('.')) {
        const base = path.posix.normalize(
          path.posix.join(path.posix.dirname(file), imported.specifier),
        )
        target = [
          base,
          `${base}.ts`,
          `${base}.tsx`,
          `${base}.js`,
          `${base}/index.ts`,
        ].find((candidate) => files.has(candidate))
        if (!target)
          errors.push(`${file}: unresolved local import ${imported.specifier}`)
      }
      if (target && !files.has(target))
        errors.push(`${file}: import leaves checked source tree: ${target}`)
      edges.push({ ...imported, packageName, target })
    }
    graph.set(file, edges)
  }
  return { graph, errors }
}
