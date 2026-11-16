import path from 'node:path'

export const publicRoots = [
  'tasks',
  'services',
  'store',
  'navigation',
  'ui-kit',
].map((name) => `src/app/${name}/`)
export const isPublicArea = (file) =>
  publicRoots.some((root) => file.startsWith(root))
export const inUiKit = (file) => file.startsWith('src/app/ui-kit/')
export const inTasks = (file) => file.includes('/tasks/')
export const inLogic = (file) => file.includes('/logic/')

export const componentsIn = (files) =>
  new Map(
    [...files.keys()]
      .filter(
        (file) =>
          file.startsWith('src/') &&
          /\.tsx$/.test(file) &&
          file !== 'src/main.tsx',
      )
      .map((file) => [path.posix.dirname(file), file]),
  )

export const componentFor = (file, components) =>
  [...components.keys()]
    .filter(
      (directory) =>
        file.startsWith(`${directory}/`) &&
        !(directory === 'src/app' && isPublicArea(file)),
    )
    .sort((a, b) => b.length - a.length)[0]

export const canUseView = (source, target, components) => {
  if (target === 'src/app/App.tsx') return source === 'src/main.tsx'
  if (inUiKit(target)) return true
  const directory = path.posix.dirname(target)
  const parent = path.posix.dirname(directory)
  if (path.posix.basename(parent) === 'components') {
    const owner = path.posix.dirname(parent)
    return source.startsWith(`${owner}/`) && !isPublicArea(source)
  }
  return componentFor(source, components) === parent
}

export const taskModule = (file) => {
  const marker = file.indexOf('/tasks/')
  if (marker === -1) return null
  const root = file.slice(0, marker + '/tasks/'.length)
  const [first, ...rest] = file.slice(root.length).split('/')
  if (!rest.length) return { boundary: file, entry: true }
  const name = path.posix.basename(file, path.posix.extname(file))
  return {
    boundary: `${root}${first}/`,
    entry: name === first || name === 'index',
  }
}
