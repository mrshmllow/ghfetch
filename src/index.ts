import * as Colors from 'https://deno.land/std/fmt/colors.ts'
import * as octokitRequest from 'https://cdn.skypack.dev/@octokit/request?dts';

// Fetch from args
const username = Deno.args[0]

// Base url
const baseUrl = "https://api.github.com"

// Fetch user info from github.com
const user = await octokitRequest.request(`get /users/${username}`, {baseUrl})

console.log(`${username}@${new URL(baseUrl).hostname}`)
