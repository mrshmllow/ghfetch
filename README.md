# neogithub
 
GhFetch is a command-line tool to fetch information about your github account written in TypeScript with deno.

## Installation

### Installing with deno (Recommended)

#### Dependacies:
 - [Deno](https://deno.land/#installation)

... and nothing else!

#### Good tools to have:
 - [The github CLI](https://cli.github.com/)

RECOMMENEDED: run `gh auth login` and login. This is because `ghfetch` takes advantage of the [`gh api`](https://cli.github.com/manual/gh_api) command to provide a out-of-the-box experience.
(If you dont want to let `ghfetch` call github on your behalf, you can always use the `--username` flag + dont provide `--allow-run` with deno.)

#### Install

`$ deno install --unstable --allow-net --allow-run https://raw.githubusercontent.com/bwac2517/ghfetch/main/ghfetch.ts` will install the latest stable version.

Check out the permission section for more info.

## Permissions

The recommeneded [permissions](https://deno.land/manual@v1.9.0/getting_started/permissions) are: `--allow-net`, `--allow-run`.

`ghfetch` won't work without `--allow-net` and it won't be able to access your `gh` install without `--allow-run`.

`ghfetch` also requires `--unstable`.
