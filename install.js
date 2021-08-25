#! /usr/bin/env node

/**
 * boilerplate プロジェクトを指定のディレクトリ以下にコピーして制作、
 * 開発準備を整える
 *
 * この際、不要なファイルは除外しておく
 *
 * Usage: insall.js <project>
 */

const { argv } = require('process')
const path = require('path')

const fse = require('fs-extra')
const glob = require('glob')
const editJsonFile = require('edit-json-file')

/**
 * @returns {Array}
 */
const excludeGlobs = [
  '.git/*',
  '.husky/*',
  '*.tgz',
  'bin/*',
  'node_modules/*',
  'node_modules/.*',
  'vendor/*'
]

/**
 * @returns {Array}
 */
const excludePaths = [
  '.git',
  '.husky',
  'bin',
  'node_modules',
  'vendor',
  'LICENSE',
  'README.md'
]

/**
 * @returns {Array}
 */
function excludeFiles () {
  const paths = excludePaths.map((dir) => path.join(__dirname, dir))
  const files = excludeGlobs.map((file) => glob.sync(path.join(__dirname, file)))

  const excludes = paths.concat(files).flat()
  excludes.unshift(__filename)

  return excludes
}

/**
 * @param {string} src
 * @param {string} dest
 * @returns {boolean}
 */
function doUnlessExcluded (src, dest) {
  return !excludeFiles().includes(src)
}

/**
 * @param {Array} argv
 * @returns {string}
 */
function parseArg (argv) {
  const args = [...argv]
  if (args[2]) {
    return args[2]
  } else {
    throw new Error(`project name ( and/or directory name ) not specified.

Usage: create-cc-jlmf <project>
`)
  }
}

/**
 * @returns {void}
 */
function modifyPackageJson () {
  const json = editJsonFile(path.join(__dirname, 'package.json'))

  json.unset('name')
  json.unset('description')
  json.unset('version')
  json.unset('dependencies')
  json.unset('bin')
  json.unset('main')
  json.save()
}

/**
 * @returns {void}
 */
function main () {
  const target = parseArg(argv)

  modifyPackageJson()
  fse.copySync(__dirname, target, { filter: doUnlessExcluded })
}

main()