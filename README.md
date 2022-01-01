# Git Dirs

> Run git commands in all git subdirectories

```none
          _   _                 _   _
   __ _  (_) | |_            __| | (_)  _ __   ___
  / _` | | | | __|  _____   / _` | | | | '__| / __|
 | (_| | | | | |_  |_____| | (_| | | | | |    \__ \
  \__, | |_|  \__|          \__,_| |_| |_|    |___/
  |___/
```

```bash
npx git-dirs status
```

## Usage

```bash
$ npx git-dirs help

# Usage: git-dirs [options] [command]
#
# Options:
#   -V, --version     output the version number
#   -h, --help        display help for command
#
# Commands:
#   status [options]  show the working tree status
#   help [command]    display help for command
```

### Status

```bash
$ npx git-dirs status

# show the working tree status
#
# Options:
#   -d, --dir <path>    path other than current directory
#   -a, --show-all      show all repo statuses
#   -s, --sort <order>  sort order (choices: "status", "alpha", default: "status")
#   -h, --help          display help for command
```


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

* Automate Deploy w/ Github Actions
* Params, pass in dir to override (defaults to `./`)
* Exec Child
* Speed up npx download time
  * Remove dependencies
  * Bundle Code
  * Don't ship anything client doesn't need
* Incremental progress updates


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




## Commands

```bash
git-fe status [-s] [--filter dirty] [--sort status|alpha]
git-fe fetch
git-fe pull
git-fe checkout main
git-fe prune
git-fe clean -dX --dry-run
git-fe clean -dX

git-fe xargs <whatever>
```


## Prior Art


### Stack Overflow

* [Run git pull over all subdirectories](https://stackoverflow.com/q/3497123/1366033) (296 ⬆️)
* [How can I view all the git repositories on my machine?](https://stackoverflow.com/q/2020812/1366033) (148 ⬆️)
* [Managing many git repositories](https://stackoverflow.com/q/816619/1366033) (97 ⬆️)
* [Find all uncommitted locals repos in a directory tree](https://stackoverflow.com/q/961101/1366033) (26 ⬆️)
* [How to git pull for multiple repos on windows?](https://stackoverflow.com/q/24223630/1366033) (23 ⬆️)
* [Is there any way to list all git repositories in terminal?](https://stackoverflow.com/q/5101485/1366033) (18 ⬆️)
* [Git Status Across Multiple Repositories on a Mac](https://stackoverflow.com/q/2765253/1366033) (18 ⬆️)
* [How to check the status of all git repositories at once?](https://stackoverflow.com/q/24352701/1366033) (9 ⬆️)
* [Is it possible to do Git status for all repos in subfolders?](https://stackoverflow.com/q/24390040/1366033) (5 ⬆️)
* [Is there any functionality in git to check multiple git repos under a directory?](https://stackoverflow.com/q/7604960/1366033) (2 ⬆️)
* [How do I loop through all of my Git repositories and update them?](https://stackoverflow.com/q/31994427/1366033) (6 ⬆️)

### Native

* [git for-each-repo](https://git-scm.com/docs/git-for-each-repo) - Run a Git command on a list of repositories

### Tools

* [git-xargs](https://github.com/gruntwork-io/git-xargs) (520 ⭐) - An open source tool to update multiple GitHub repos
* [multi-git-status](https://github.com/fboender/multi-git-status) (332 ⭐) - Show uncommitted, untracked and unpushed changes for multiple Git repos
* [git-repo-updater](https://github.com/earwig/git-repo-updater) (676 ⭐) - A console script that allows you to easily update multiple git repositories at once
* [git-summary](https://github.com/MirkoLedda/git-summary) (73 ⭐) - Summarizes multiple git repository status within a directory
* [git-status-all](https://github.com/reednj/git-status-all) (32 ⭐) - Get the status of all git repositories in a directory
* [Check git status of multiple repos](https://gist.github.com/mzabriskie/6631607) (91 ⭐) - Run git status on each repo under the specified directory

### NPM

* [gal](https://www.npmjs.com/package/gal)
* [gitall](https://www.npmjs.com/package/gitall)
* [git-all](https://www.npmjs.com/package/git-all)
* [git-all-branches](https://www.npmjs.com/package/git-all-branches)
* [git-push-all](https://www.npmjs.com/package/git-push-all)
* [git-pull-all](https://www.npmjs.com/package/git-pull-all)
* [get-git-status](https://www.npmjs.com/package/get-git-status)
