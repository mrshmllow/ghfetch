import * as Colors from 'https://deno.land/std/fmt/colors.ts'
import * as octokitRequest from 'https://cdn.skypack.dev/@octokit/request?dts'
import { getImageStrings } from "https://x.nest.land/terminal_images@3.0.0/mod.ts"
import { Command } from "https://deno.land/x/cliffy/command/mod.ts"

const { options } = await new Command()
    .option("-u, --username", "Set the username of the user you want to query.")
    .option("-b, --base-url", "Set the base api url.", { default: "https://api.github.com" })
    .parse(Deno.args);

let user

// Fetch user info from the internet
if (options.username === undefined) {
    // Try to grab from `gh` tool
    try {
        const p = Deno.run({cmd: ["gh", "api", "user"], stdout: "piped", stderr: "piped"})

        const output = await p.output() // "piped" must be set
        const outStr = new TextDecoder().decode(output);

        p.close()
        
        try {
            const parsed = JSON.parse(outStr)
            user = {
                Login: parsed.login,
                Blog: parsed.blog,
                Followers: parsed.followers,
                Gists: parsed.public_gists,
                Location: parsed.location,
                Repos: parsed.public_repos,
                Twitter: parsed.twitter_username,
                avatarUrl: parsed.avatar_url
            }
        } catch(err) {
            // They arent logged into GH
            console.log(`${Colors.red("gh returned non-json.")}\n${Colors.yellow("Did you mean to use --username ?")}`)
            console.log(err)
            Deno.exit()
        }
    } catch(err) {
        // gh isn't installed
        console.log(`${Colors.red("No username was given, and gh is not installed (or we dont have permission to use it)")}\n${Colors.yellow("Did you mean to use --username ?")}`)
        console.log(err)
        Deno.exit()
    }
} else {
    // Use octokitRequest if username isn't given
    const response = await octokitRequest.request(`get /users/${options.username}`, {baseUrl: options.baseUrl})
    user = {
        Login: response.data.login,
        Blog: response.data.blog,
        Followers: response.data.followers,
        Gists: response.data.public_gists,
        Location: response.data.location,
        Repos: response.data.public_repos,
        Twitter: response.data.twitter_username,
        avatarUrl: response.data.avatar_url
    }
}

const color = Colors.brightBlue

// Create a title
const title = `${color(user.Login)}@${color(new URL(options.baseUrl).hostname)}`

// Calculate barrier size for title
let barrier = ""
// Start at 1
for (let index = 1; index < `${options.username}@${new URL(options.baseUrl).hostname}`.length; index++) {
    barrier += `-`
}

// Generate image ascii
const ascii = await getImageStrings({ path: user.avatarUrl, width: 35 })

const splitAscii = ascii[0].split(/\r\n|\n\r|\n|\r/)
const spacing = "    "
const userKeys = Object.keys(user)

// Iterate user keys for some filtering
for (let index = 0; index < userKeys.length; index++) {
    // Remove empty points
    if (user[userKeys[index]] === null || user[userKeys[index]] === "") {
        userKeys.splice(index, 1)
    }
}

for (let index = 0; index < splitAscii.length; index++) {
    const element = splitAscii[index]
    if (index === 0) { console.log(`${element}${spacing}${title}`); continue }
    if (index === 1) { console.log(`${element}${spacing}${barrier}`); continue }

    if (userKeys.length > index - 2) {
        // Dont show avatarUrl
        if (userKeys[index - 2] !== "avatarUrl") {
            console.log(`${element}${spacing}${color(userKeys[index - 2])}: ${user[userKeys[index - 2]]}`)
            continue
        }
    }
    console.log(element)
}
