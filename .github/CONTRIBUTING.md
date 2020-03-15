# How to contribute

We welcome participation in open project.  We want to make it as easy as
possible for people to work together, so please follow these guidelines to
prepare and submit a pull request.

## How to prepare

* You need a Github account. You can [create one](https://github.com/signup/free)
  for free.
* Submit an [Issue](https://github.com/tripleblind/mobileapp/issues) against
  the repo to describe the idea or problem if there is not one yet.
    * Describe a bug by including steps to reproduce and earliest version you
      know is affected.
    * Describe a new feature with as much detail as possible.
* Fork the repository on GitHub and clone locally (see how to [fork a repo](https://help.github.com/articles/fork-a-repo/)).

## Make Changes

  1. Create a branch based on the `develop` branch.  Name the branch in the
     format: "flast/description", where "flast" is your first initial + last
     name, and "description" is as simple description of the work being done.
     For example, if Steve Penrod wants to add a new icon a branch name could
     "spenrod/new-icon".
  2. Stick to the coding style and patterns that are used already.
  3. Document code!  Comments are good.  More comments are better.  :)
  4. Make commits as you desire.  Ultimately they will be squashed, so make
     notes to yourself.
  5. Once you have committed everything and are done with your branch, rebase
     your code against `develop` by:
      - Checkout the `develop` branch and make sure it is up-to-date.
      - Checkout your branch and rebase it against `develop`.
      - Resolve any conflicts locally.
      - Force your push since the historical base has changed.
      - Specific commands:
        ```
        git checkout develop
        git fetch
        git reset --hard origin/develop
        git checkout <your_branch_name>
        git rebase develop
        git push -f
        ```
  6. Finally [create a Pull Request (PR) on Github](https://help.github.com/articles/using-pull-requests/)
     for review and merging.

**Note**: Even if you have write access, do not work directly on `master` or
push directly to `develop`!  All work is done against `develop`, reviewed and
merged via PRs, and ultimately `develop` gets merged into `master` for tagged
code releases.

## Submit Changes

* Push your changes to a topic branch in your fork of the repository.
* Open a pull request to the original repository and choose the `develop`
    _Advanced users may install the `hub` gem and use the [`hub pull-request` command](https://github.com/defunkt/hub#git-pull-request)._
* If not done in commit messages (which you really should do), reference and
  update your issue with the code changes. But _please do not close the issue
  yourself_.
* A team member will review the pull request, request change or approve and
  merge into the `develop` branch.

# Additional Resources

* [General GitHub documentation](http://help.github.com/)
* [GitHub pull request documentation](https://help.github.com/articles/about-pull-requests/)
* [Read the Issue Guidelines by @necolas](https://github.com/necolas/issue-guidelines/blob/master/CONTRIBUTING.md) for more details

