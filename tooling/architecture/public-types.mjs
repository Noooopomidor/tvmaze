import ts from 'typescript'

export const publicTypeModules = (files) => {
  const modules = new Set()
  for (const [file, text] of files) {
    if (!file.startsWith('src/') || !/\.[cm]?ts$/.test(file)) continue
    const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true)
    let exported = false
    const typeNames = new Set(
      ast.statements
        .filter(
          (node) =>
            ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node),
        )
        .map((node) => node.name.text),
    )
    const onlyTypes = ast.statements.every((node) => {
      if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
        if (
          node.modifiers?.some(
            (item) => item.kind === ts.SyntaxKind.ExportKeyword,
          )
        )
          exported = true
        return true
      }
      if (ts.isImportDeclaration(node)) {
        const clause = node.importClause
        return (
          clause?.isTypeOnly ||
          (!clause?.name &&
            clause?.namedBindings?.elements?.every((item) => item.isTypeOnly))
        )
      }
      if (ts.isExportDeclaration(node)) {
        const elements = node.exportClause?.elements
        const typeOnly =
          node.isTypeOnly ||
          elements?.every(
            (item) =>
              item.isTypeOnly ||
              (!node.moduleSpecifier &&
                typeNames.has(item.propertyName?.text ?? item.name.text)),
          )
        if (typeOnly) exported = true
        return typeOnly
      }
      return ts.isEmptyStatement(node)
    })
    if (onlyTypes && exported) modules.add(file)
  }
  return modules
}
