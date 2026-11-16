import { forbiddenTaskPackage } from './boundaries.mjs'
import { inLogic, inTasks, inUiKit } from './owners.mjs'

export const checkTransitive = (graph, components) => {
  const errors = []
  const views = new Set(components.values())
  for (const start of graph.keys()) {
    const presenter = start.endsWith('/usePresenter.ts')
    const task = inTasks(start)
    const service = /^src\/app\/services\//.test(start)
    if (!presenter && !task && !service) continue
    const visited = new Set([start])
    const visit = (source) => {
      for (const edge of graph.get(source) ?? []) {
        const { target, typeOnly, specifier, packageName } = edge
        if (task && forbiddenTaskPackage.test(packageName ?? specifier)) {
          errors.push(
            `${start}: forbidden Task React/router dependency via ${source}: ${specifier}`,
          )
        }
        if (typeOnly || !target || visited.has(target)) continue
        visited.add(target)
        const forbidden =
          views.has(target) ||
          (presenter && target.endsWith('/usePresenter.ts')) ||
          ((task || service) && inLogic(target)) ||
          (task && (inUiKit(target) || target.includes('/navigation/')))
        if (forbidden)
          errors.push(
            `${start}: forbidden transitive dependency via ${source}: ${specifier}`,
          )
        else visit(target)
      }
    }
    visit(start)
  }
  return errors
}
