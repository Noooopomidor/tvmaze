import { checkBoundaries } from './boundaries.mjs'
import { checkCycles } from './cycles.mjs'
import { checkOtherLines, readFiles } from './files.mjs'
import { importGraph } from './imports.mjs'
import { componentsIn } from './owners.mjs'
import { publicTypeModules } from './public-types.mjs'
import { checkSharing } from './sharing.mjs'
import { checkStructure } from './structure.mjs'
import { checkTasks } from './tasks.mjs'
import { checkTransitive } from './transitive.mjs'
import { checkPresenterTransport } from './transport.mjs'

const files = readFiles(process.cwd())
const components = componentsIn(files)
const publicTypes = publicTypeModules(files)
const { graph, errors: importErrors } = importGraph(process.cwd(), files)
const errors = [
  ...checkOtherLines(files),
  ...checkStructure(files, components, publicTypes),
  ...checkTasks(files),
  ...importErrors,
  ...checkBoundaries(graph, components, publicTypes),
  ...checkSharing(graph, components),
  ...checkTransitive(graph, components),
  ...checkPresenterTransport(files, graph),
  ...checkCycles(graph),
]

if (errors.length) {
  console.error([...new Set(errors)].join('\n'))
  process.exitCode = 1
} else
  console.log(
    `Architecture checks passed: ${components.size} components, ${graph.size} source modules.`,
  )
