import path from 'node:path'
import { componentFor } from './owners.mjs'

export const checkSharing = (graph, components) => {
  const errors = []
  for (const [directory, view] of components) {
    const parent = path.posix.dirname(directory)
    if (path.posix.basename(parent) !== 'components') continue
    const owners = new Set()
    for (const [source, edges] of graph) {
      if (edges.some(({ target, typeOnly }) => target === view && !typeOnly)) {
        const owner = componentFor(source, components)
        if (owner && owner !== directory) owners.add(owner)
      }
    }
    if (owners.size < 2) {
      errors.push(
        `${view}: shared component needs two real component consumers`,
      )
      continue
    }
    const nearest = [...components.keys()]
      .filter((candidate) =>
        [...owners].every(
          (owner) => owner === candidate || owner.startsWith(`${candidate}/`),
        ),
      )
      .sort((a, b) => b.length - a.length)[0]
    if (nearest !== path.posix.dirname(parent))
      errors.push(`${view}: use consumers' nearest common components/ folder`)
  }
  return errors
}
