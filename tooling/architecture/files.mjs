import fs from 'node:fs'
import path from 'node:path'

const ignored = new Set(['node_modules', 'dist', '.git', '.idea', '.vscode'])
const source = /\.(?:[cm]?[jt]sx?|css|scss|less|html|ya?ml)$/

export const readFiles = (root, directory = root, files = new Map()) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink() || ignored.has(entry.name)) continue
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) readFiles(root, absolute, files)
    else if (source.test(entry.name)) {
      files.set(
        path.relative(root, absolute).split(path.sep).join('/'),
        fs.readFileSync(absolute, 'utf8'),
      )
    }
  }
  return files
}

export const physicalLines = (text) =>
  text ? text.split(/\r\n|\r|\n/).length - Number(/(?:\r|\n)$/.test(text)) : 0

export const checkOtherLines = (files) =>
  [...files]
    .filter(
      ([file, text]) => !/\.tsx?$/.test(file) && physicalLines(text) > 120,
    )
    .map(
      ([file, text]) =>
        `${file}: ${physicalLines(text)} physical lines; maximum is 120`,
    )
