import path from 'node:path'
import { validViewBody } from './view-body.mjs'

export default {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      shape:
        'View may declare one component, imports and types only; its Presenter must be ./logic/usePresenter.',
      body: 'View may only call its own Presenter once, read ready values and return JSX/null, or render ready props without a Presenter.',
    },
  },
  create: (context) => {
    const filename = context.filename.replaceAll('\\', '/')
    if (/(?:^|\/)src\/main\.tsx$/.test(filename)) return {}
    if (!/\.tsx$/.test(filename)) {
      const report = (node) => context.report({ node, messageId: 'shape' })
      return { JSXElement: report, JSXFragment: report }
    }
    return {
      'Program:exit': (program) => {
        const expected = path.basename(filename, '.tsx')
        let component
        let usesPresenter = false
        let invalid = false
        const staticNames = []
        for (const statement of program.body) {
          if (statement.type === 'ImportDeclaration') {
            if (/\.(?:css|scss|less)$/.test(statement.source.value)) {
              staticNames.push(
                ...statement.specifiers.map((item) => item.local.name),
              )
            }
            for (const specifier of statement.specifiers) {
              if (specifier.local.name === 'usePresenter') {
                if (
                  !/^\.\/logic\/usePresenter(?:\.ts)?$/.test(
                    statement.source.value,
                  ) ||
                  usesPresenter
                )
                  invalid = true
                usesPresenter = true
              }
            }
            continue
          }
          if (statement.type === 'ExportAllDeclaration') invalid = true
          if (
            statement.type === 'ExportNamedDeclaration' &&
            !statement.declaration
          ) {
            if (
              statement.exportKind !== 'type' &&
              statement.specifiers.some(
                (item) =>
                  item.exportKind !== 'type' && item.local.name !== expected,
              )
            )
              invalid = true
            continue
          }
          const node = statement.type.startsWith('Export')
            ? statement.declaration
            : statement
          if (
            ['TSTypeAliasDeclaration', 'TSInterfaceDeclaration'].includes(
              node?.type,
            )
          )
            continue
          if (node?.type === 'Identifier' && node.name === expected) continue
          const variable =
            node?.type === 'VariableDeclaration' &&
            node.declarations.length === 1
              ? node.declarations[0]
              : null
          if (
            !variable ||
            variable.id.name !== expected ||
            variable.init?.type !== 'ArrowFunctionExpression' ||
            component
          )
            invalid = true
          else component = variable.init
        }
        if (invalid || !component)
          context.report({ node: program, messageId: 'shape' })
        else if (!validViewBody(component, usesPresenter, staticNames)) {
          context.report({ node: component, messageId: 'body' })
        }
      },
    }
  },
}
