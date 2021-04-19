import * as Colors from 'https://deno.land/std@0.93.0/fmt/colors.ts'
import { getImageStrings } from "https://x.nest.land/terminal_images@3.0.0/mod.ts"
import { Command } from "https://deno.land/x/cliffy@v0.18.2/command/mod.ts"
import { Image } from 'https://deno.land/x/imagescript@1.2.0/mod.ts'
import ky from 'https://cdn.skypack.dev/ky?dts';

const { options } = await new Command()
    .version("1.0.0")
    .option("-u, --username <string>", "Set the username of the user you want to query.")
    .option("-b, --base-url <string>", "Set the base github api url.", { default: "https://api.github.com" })
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
                Twitter: `@${parsed.twitter_username}`,
                avatarUrl: parsed.avatar_url
            }
        } catch(err) {
            // They arent logged into GH
            console.log(`${Colors.red("gh returned non-json.")}\n${Colors.yellow("TIP: You can just use --username=[USERNAME] to fix this error")}`)
            console.log(err)
            Deno.exit()
        }
    } catch(err) {
        // gh isn't installed
        console.log(`${Colors.red("No username was given, and gh is not installed (or we dont have permission to use it)")}\n${Colors.yellow("If it is installed, you didn't run me with --allow-run ?")}\n${Colors.yellow("TIP: You can just use --username=[USERNAME] to fix this error")}`)
        console.log(err)
        Deno.exit()
    }
} else {
    // Use ky if username isn't given
    const response = await ky.get(`${options.baseUrl}/users/${options.username}`)
    const data = await response.json();

    user = {
        Login: data.login,
        Blog: data.blog,
        Followers: data.followers,
        Gists: data.public_gists,
        Location: data.location,
        Repos: data.public_repos,
        Twitter: `@${data.twitter_username}`,
        avatarUrl: data.avatar_url
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


// Download image to memory
const response = await ky.get(user.avatarUrl).blob()

// Edit image to be round
const image = await Image.decode(new Uint8Array(await response.arrayBuffer()))
image.roundCorners(245)

// Generate image ascii
const ascii = await getImageStrings({ rawFile: await image.encode(), width: 35 })

// Split image ascii into a string[]
const splitAscii = ascii[0].split(/\r\n|\n\r|\n|\r/)

// Spacing between the image and the text
const spacing = "    "

// Get a array of keys of the object
const userKeys = Object.keys(user)

// Iterate user keys for some filtering
for (let index = 0; index < userKeys.length; index++) {
    // Remove empty points
    if (user[userKeys[index]] === null || user[userKeys[index]] === "" || user[userKeys[index]] === "@null") {
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
