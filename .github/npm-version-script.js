#!/bin/env node

/**
 * This scripts queries the npm registry to pull out the latest version for a given tag.
 */

const assert = require('node:assert')
const child_process = require('node:child_process')
const fs = require('node:fs')
const process = require('node:process')

const BRANCH_VERSION_PATTERN = /^([A-Z]+)-(\d+\.\d+\.\d+)$/i

// Load the contents of the package.json file
const packageJSON = JSON.parse(fs.readFileSync('package.json', 'utf8'))

const refArgument = process.argv[2]
const tagArgument = process.argv[3] || 'latest'

if (!refArgument) {
  console.error('ref argument is missing')
  console.error('Usage: npm-version-script.js <ref> [tag]')
  process.exit(1)
}

/**
 * Queries the NPM registry for the latest version for the provided base version and tag.
 * If the tag is latest, then the base version is returned if it exists. For other tags, the latest
 * version found for that base version and tag is returned.
 * @param baseVersion The base version to query for, e.g. 2.0.0
 * @param tag The tag to query for, e.g. beta or latest
 * @returns {string} Returns the version, or '' if not found
 */
function getTagVersionFromNpm(baseVersion, tag) {
  try {
    return JSON.parse(child_process.execSync(`npm info ${packageJSON.name} versions --json`).toString('utf8').trim())
      .filter(v => tag === 'latest' ? v === baseVersion : v.startsWith(`${baseVersion}-${tag}.`)) // find all published versions for this base version and tag
      .reduce((_, current) => current, '') // choose the last as they're sorted in ascending order, or '' if there are none
  } catch (e) {
    console.error(`Failed to query the npm registry for the latest version for tag: ${tag}`, e)
    // throw e;
    return ''
  }
}

function desiredTargetVersion(ref) {
  // ref is a GitHub action ref string
  if (ref.startsWith('refs/pull/')) {
    throw new Error('The version script was executed inside a PR!')
  }

  assert(ref.startsWith('refs/heads/'))
  const branchName = ref.slice('refs/heads/'.length)

  const results = branchName.match(BRANCH_VERSION_PATTERN)
  if (results !== null) {
    if (results[1] !== tagArgument) {
      console.warn(`The base branch name (${results[1]}) differs from the tag name ${tagArgument}`)
    }

    return results[2]
  }

  throw new Error(`Malformed branch name for ref: ${ref}. Can't derive the base version. Use a branch name like: beta-x.x.x or alpha-x.x.x`)
}

// derive the base version from the branch ref
const baseVersion = desiredTargetVersion(refArgument)

// query the npm registry for the latest version of the provided tag name
const latestReleasedVersion = getTagVersionFromNpm(baseVersion, tagArgument) // e.g. 0.7.0-beta.12

let publishTag

if (latestReleasedVersion) {
  console.warn(`Latest published version for ${baseVersion} with tag ${tagArgument} is ${latestReleasedVersion}`)
  publishTag = latestReleasedVersion // set this released beta or alpha to be incremented
} else {
  console.warn(`No published versions for ${baseVersion} with tag ${tagArgument}`)
  publishTag = baseVersion // start off with a new beta or alpha version
}

if (packageJSON.version !== publishTag) {
  // report the change for CI
  console.warn(`Changing version in package.json from ${packageJSON.version} to ${publishTag}`)

  // save the package.json
  packageJSON.version = publishTag
  fs.writeFileSync('package.json', JSON.stringify(packageJSON, null, 2))

  // perform the same change to the package-lock.json
  const packageLockJSON = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'))
  packageLockJSON.version = publishTag
  fs.writeFileSync('package-lock.json', JSON.stringify(packageLockJSON, null, 2))
} else {
  console.warn(`Leaving version in package.json at ${packageJSON.version}`)
}
