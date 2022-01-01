# Git For Each

> Run git commands in all git subdirectories



## Features

* Git Status
  * sort alpha, sort by status
* Checkout Main
  * whatever default branch is
* Pull Remote
* Fetch
* Delete Unnecessary Branches

* Run in a folder, use sub-directories
* Point to a folder?
* For Each Folder in Dir

## Todo

* Typescript
* Package Project
* Automate Deploy w/ Github Actions
* CLI
* Chalk
* Params, pass in dir to override (defaults to `./`)
* Exec Child
* Speed up npx download time
  * Remove dependencies
  * Bundle Code
  * Don't ship anything client doesn't need
* Fix `RangeError [ERR_CHILD_PROCESS_STDIO_MAXBUFFER]: stdout maxBuffer length exceeded`
* Incremental progress updates
* Remove tsconfig.json


## Commands

```bash
git-fe status -s
git-fe status [-s] [--filter dirty] [--sort status|alpha]
git-fe fetch
git-fe pull
git-fe checkout main
git-fe prune
git-fe clean -dX --dry-run
git-fe clean -dX

git-fe xargs <whatever>
```

## Possible Names

* git-each
* git-for-each
* git-fe
* git-dir

## Prior Art

### NPM

* [gal](https://www.npmjs.com/package/gal)
* [gitall](https://www.npmjs.com/package/gitall)
* [git-all](https://www.npmjs.com/package/git-all)
* [git-all-branches](https://www.npmjs.com/package/git-all-branches)
* [git-push-all](https://www.npmjs.com/package/git-push-all)
* [git-pull-all](https://www.npmjs.com/package/git-pull-all)
* [get-git-status](https://www.npmjs.com/package/get-git-status)

### Stack Overflow

* [Run git pull over all subdirectories](https://stackoverflow.com/q/3497123/1366033) - 296 ⬆️
* [Managing many git repositories](https://stackoverflow.com/q/816619/1366033) - 97 ⬆️
* [Find all uncommitted locals repos in a directory tree](https://stackoverflow.com/q/961101/1366033) - 26 ⬆️
* [Is there any way to list all git repositories in terminal?](https://stackoverflow.com/q/5101485/1366033) - 18 ⬆️
* [Git Status Across Multiple Repositories on a Mac](https://stackoverflow.com/q/2765253/1366033) - 18 ⬆️
* [How to check the status of all git repositories at once?](https://stackoverflow.com/q/24352701/1366033) - 9 ⬆️
* [Is it possible to do Git status for all repos in subfolders?](https://stackoverflow.com/q/24390040/1366033) - 5 ⬆️
* [Is there any functionality in git to check multiple git repos under a directory?](https://stackoverflow.com/q/7604960/1366033) - 2 ⬆️
* [How do I loop through all of my Git repositories and update them?](https://stackoverflow.com/q/31994427/1366033) - 6 ⬆️
* [How can I view all the git repositories on my machine?](https://stackoverflow.com/q/2020812/1366033) - 148 ⬆️
* [How to git pull for multiple repos on windows?](https://stackoverflow.com/q/24223630/1366033) - 23 ⬆️

### Tools

* [git for-each-repo](https://git-scm.com/docs/git-for-each-repo) - Run a Git command on a list of repositories
* [multi-git-status](https://github.com/fboender/multi-git-status) - Show uncommitted, untracked and unpushed changes for multiple Git repos
* [git-xargs](https://blog.gruntwork.io/introducing-git-xargs-an-open-source-tool-to-update-multiple-github-repos-753f9f3675ec) - An open source tool to update multiple GitHub repos
* [git-repo-updater](https://github.com/earwig/git-repo-updater) - A console script that allows you to easily update multiple git repositories at once
* [Check git status of multiple repos](https://gist.github.com/mzabriskie/6631607)
* [git-summary](https://github.com/MirkoLedda/git-summary) - Summarizes multiple git repository status within a directory

## Node Wrapper for Git

* [Has anyone implemented a git clone or interface library using nodejs?](https://stackoverflow.com/q/5955891/1366033)

* [simple-git](https://www.npmjs.com/package/simple-git)
  * [steveukx/git-js](https://github.com/steveukx/git-js)
* [git-wrapper](https://www.npmjs.com/package/git-wrapper)
  * [pvorb/node-git-wrapper](https://github.com/pvorb/node-git-wrapper)
* [gift-wrapper](https://www.npmjs.com/package/gift-wrapper)
  * [zpbappi/gift-wrapper](https://github.com/zpbappi/gift-wrapper)
* [gift](https://www.npmjs.com/package/gift)
  * [notatestuser/gift](https://github.com/notatestuser/gift)
* [Install NodeGit](https://www.nodegit.org/)
  * [nodegit/nodegit: Native Node bindings to Git.](https://github.com/nodegit/nodegit)


## Status

* Sort
  * By Status
    * Clean
    * Ahead
    * Behind
    * Dirty
  * Alphabetically
  * Filter
    * Not Clean


