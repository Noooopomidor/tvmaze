export const checkCycles = (graph) => {
  const errors = []
  const visited = new Set()
  const active = []
  const visit = (file) => {
    const index = active.indexOf(file)
    if (index !== -1) {
      errors.push(
        `Import cycle: ${[...active.slice(index), file].join(' -> ')}`,
      )
      return
    }
    if (visited.has(file)) return
    visited.add(file)
    active.push(file)
    for (const { target } of graph.get(file) ?? []) if (target) visit(target)
    active.pop()
  }
  for (const file of graph.keys()) visit(file)
  return errors
}
