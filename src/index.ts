import * as Colors from 'https://deno.land/std/fmt/colors.ts'
import * as octokitRequest from 'https://cdn.skypack.dev/@octokit/request?dts';

// Fetch from args
const username = Deno.args[0]

// Exit out if username isn't given
if (username === undefined) {
    console.log("username arg undefined")
    Deno.exit()
}

function listOut(array:string[]) {
    // Iterate over a array and log the contents one by one
    for (let index = 0; index < array.length; index++) {
        console.log(array[index])
    }
}

// Base url
const baseUrl = "https://api.github.com"

// Fetch user info from github.com
const user = await octokitRequest.request(`get /users/${username}`, {baseUrl: baseUrl})

const color = Colors.blue

// Create a title
const title = `${color(username)}@${color(new URL(baseUrl).hostname)}`

// Calculate barrier size for title
let barrier = ""
for (let index = 0; index < `${username}@${new URL(baseUrl).hostname}`.length; index++) {
    barrier += `-`
}

listOut([title, barrier])

const points = {
    // Name not url
    "Name": user.data.name,
    // Remove protocols from url
    // "Blog": user.data.blog.replace(/(^\w+:|^)\/\//, ''),
    "Blog": user.data.blog,
    "Twitter": user.data.twitter_username,
    // Its public anyway
    "Location": user.data.location,
    "Followers": user.data.followers,
    "Repos": user.data.public_repos,
    "Gists": user.data.public_gists,
}

for (const [key, value] of Object.entries(points)) {
    if (value === null) { continue }
    console.log(`${color(key)}: ${value}`);
}
