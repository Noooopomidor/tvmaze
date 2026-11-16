import {
  canUseView,
  componentFor,
  inLogic,
  inTasks,
  inUiKit,
  taskModule,
} from './owners.mjs'

export const forbiddenTaskPackage =
  /^(?:react(?:$|[-/])|@types\/react(?:$|[-/])|@(?:remix-run|tanstack)\/.*(?:react|router)|next(?:\/|$))/

export const checkBoundaries = (graph, components, publicTypes = new Set()) => {
  const errors = []
  for (const [source, imports] of graph) {
    const owner = componentFor(source, components)
    const isView = components.get(owner) === source
    const presenter = source.endsWith('/logic/usePresenter.ts')
    for (const edge of imports) {
      const { target, specifier, packageName, typeOnly, reexport } = edge
      if (
        inTasks(source) &&
        forbiddenTaskPackage.test(packageName ?? specifier)
      )
        errors.push(
          `${source}: Task cannot depend on React/router: ${specifier}`,
        )
      if (!target) continue
      const targetOwner = componentFor(target, components)
      const targetView = components.get(targetOwner) === target
      const targetTask = taskModule(target)
      const ownTask = taskModule(source)
      if (
        /^src\/app\/(?:store|services)\//.test(source) &&
        (targetView || inLogic(target) || inUiKit(target))
      ) {
        errors.push(
          `${source}: infrastructure cannot depend on component UI/logic: ${target}`,
        )
      }
      if (
        targetTask &&
        !targetTask.entry &&
        (ownTask?.boundary !== targetTask.boundary ||
          (ownTask.entry && reexport && !typeOnly))
      ) {
        errors.push(`${source}: private Task helper import ${target}`)
      }
      if (inUiKit(source) && !inUiKit(target))
        errors.push(`${source}: UI kit imports application module ${target}`)
      if (
        inTasks(source) &&
        (targetView ||
          inUiKit(target) ||
          target.endsWith('/usePresenter.ts') ||
          target.includes('/navigation/'))
      )
        errors.push(`${source}: Task imports UI/navigation ${target}`)
      if (targetOwner && targetOwner !== owner) {
        const publicType = publicTypes.has(target) && typeOnly
        if (!targetView && !publicType)
          errors.push(`${source}: private component module import ${target}`)
        if (targetView && !canUseView(source, target, components))
          errors.push(
            `${source}: private component outside owner scope ${target}`,
          )
      }
      if (presenter && (targetView || target.endsWith('/usePresenter.ts'))) {
        errors.push(
          `${source}: Presenter cannot import a View or another Presenter: ${target}`,
        )
      }
      if (
        isView &&
        !typeOnly &&
        !targetView &&
        target !== `${owner}/logic/usePresenter.ts` &&
        !/\.(?:css|scss|less)$/.test(target)
      )
        errors.push(`${source}: forbidden View dependency ${target}`)
      if (inLogic(target) && targetOwner !== owner)
        errors.push(`${source}: logic is private: ${target}`)
    }
  }
  return errors
}
