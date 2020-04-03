# How to contribute

We welcome participation in an open project. We want to make it as easy as possible for people to work together, so please follow these guidelines to prepare and submit a pull request.

## How to prepare

- You need a Github account. You can [create one](https://github.com/signup/free) for free.

- Submit an [Issue](https://github.com/tripleblindmarket/private-kit/issues) against the repo to describe the idea or problem if there is not one yet.

- Describe a bug by including steps to reproduce, and the earliest version you know is affected.

- Describe a new feature with as much detail as possible.

- Fork the repository on GitHub:

- Visit https://github.com/tripleblindmarket/private-kit

- Click on the "Fork" button in the upper-left corner.

- Clone the forked repository to your local machine:

```bash

cd ~ # get to your home directory or where ever you want to go

git clone https://github.com/YOURACCOUNT/

# set upstream against Private Kit repository
git remote add upstream https://github.com/tripleblindmarket/private-kit.git

```

(see also how to [fork a repo](https://help.github.com/articles/fork-a-repo/))

## Make Changes

1. Create a branch based on the `develop` branch on your forked repository. Name the branch something to reflect what you are doing. For example, if you want to add a new icon, a branch name you could use:

```bash
git checkout develop # you want to branch from the main 'develop' branch

git pull # make sure you have the latest code when you start the branch

git checkout -b "feature/new-icon" develop # new branch created!

"or"

git checkout -b "fix/new-icon" develop # new branch created!

"or"

git checkout -b "release/new-icon" develop # new branch created!
```

2. Stick to the coding style and patterns that are used already.

3. Document code! Comments are good. More comments are better. :)

4. Make commits as you desire. Ultimately they will be squashed, so make

notes to yourself. It's as simple as `git commit -m "commit message goes here"`!

5. Rebase your feature branch with upstream/develop to avoid any code conflicts:

```bash
# 1. Rebase Base(Private Kit) repository with fork repository - develop branch

git checkout develop # switch to base branch(local)

git fetch upstream # fetch latest commits from "Private kit" develop branch

git rebase upstream/develop # rebase code against your forked develop branch(local)

git push -f origin develop # push rebased code after resolving conflicts to forked develop branch(remote)

# 2. Rebase feature branch(local) with develop branch(local)

git checkout <feature-branch-name-you-created> # switch back to original feature branch(local) you are working

git rebase develop # now rebase your feature branch(local) against develop branch(local)

git push origin feature/<your-feature-branch-name> # after resolving all conflicts, push your new feature branch to the remote forked repository

# now your feature branch is ready for PR against Private Kit develop branch.
```

6. Start a PR to submit your changes back to the original project:

- Visit https://github.com/your-git-userid/private-kit/branches

- You should see the new branch that you recently created and pushed on this page. Example - feature/your-branch-name (similar to the image shown below).

  ![Image of Github branches](.github/.github/branches-page.png)

- Click on the "New pull request" button next to your new feature branch, and it should take you to open the pull request page (similar to the image shown below).

  ![Image of Github branches](.github/.github/pull-request-page.png)

- Verify following -

  - Base repository - tripleblindmarket/private-kit
  - Base branch - develop
  - Head repository - your-git-id/private-kit
  - Compare branch - feature/your-branch-name

- Provide a meaningful title and description to your PR, as shown in the above image.
- Provide Issue ID on PR description to link/close the issue upon PR merged.

## Helpful resources on Git

- Git commands:

```
git checkout develop

git fetch

git reset --hard origin/develop

git checkout <your_branch_name>

git rebase develop

git push -f
```

- Documentation on [create a Pull Request (PR) on Github](https://help.github.com/articles/using-pull-requests/) for review and merging.

**Note**: Even if you have write access, do not work directly on `master` or push directly to `develop`! All work is done against `develop` reviewed and merged via PRs, and ultimately `develop` gets merged into `master` for tagged code releases.

## Testing

This project utilizes the [Jest](https://jestjs.io/) testing framework to test the components.

### Commands

`yarn test` - Runs the test suite.

`yarn test -u` - Runs the test suite and updates any snapshots that need updating. Don't run this until you have determined that the snapshot failures are legitimate failures based on your changes.

### Adding new components/tests

When adding new components to the project, make sure to add at least snapshot test. The test files are located in the `__tests__` directory at the same level as the component you are testing. For instance, if you are adding a new view called `TestView` under the `views` directory, you would add a `TestView.spec.js` file in the `views/__tests__` directory.

After making your changes and adding a new test file, make sure to run `yarn test` to make sure you don't have any test failures.

### Snapshot failures

The most common failure you will most likely run into is a snapshot failure. [Snapshot testing](https://jestjs.io/docs/en/snapshot-testing) ensures that a component renders the same output after it has been modified. If you receive a snapshot failure, check the differences in the snapshot failure to make sure they are expected changes. If they are all expected changes then you just need to update the snapshot by running `yarn test -u`. This will update the snapshot file so you can commit the changes.

### Mocking modules

When writing tests for components that use installed packages, we usually don't want to rely on loading those packages in the testing environment. In those cases we can just mock the modules so they get stubbed out. There are two common ways to mock components:

- adding a mock to `jestSetupFile.js` in the root of the project. This is the common way to mock a module that uses a default export.

- adding a mock file to the `__mocks__` in the root of the project. This is the common way to mock a module that uses named exports or specific methods on the module.

## Submit Changes

- Push your changes to a topic branch in your fork of the repository.

- Open a pull request to the original repository and choose the `develop`

_Advanced users may install the `hub` gem and use the [`hub pull-request` command](https://github.com/defunkt/hub#git-pull-request)._

- If not done in commit messages (which you really should do), reference and

update your issue with the code changes. But \_please do not close the issue

yourself\_.

- A team member will review the pull request, request change or approve and

merge into the `develop` branch.

## Reviewing Pull Requests

- Open the PR on Github. At the top of the PR page is a number which identifies it -123 and the name of the author's branch -branch-name. Copy down both of these.

* Open git bash and ensure your working directory is clean by running `git status`

- Get a copy of the PR by typing `git fetch upstream pull/<id>/head:<new local branch>`. In this example you would type git fetch upstream pull/123/head:branch-name

* Now that you have a copy of the branch, switch to it using `git checkout branch-name`. Your directory will now be an exact copy of the PR. Be sure to tell the author about any bugs or suggestions, as you cannot add your own changes to a pull request directly.

- When you are done checking out their work, use `git checkout master` to return to your local version

### Git Aliases to help with pull request reviews

Aliases are shortcuts that you can define in git bash (or linux/mac) that reduces typing and minimizes errors. The following commands create two aliases, one for grabbing a PR and switching to that branch. The other one deletes the branch.

Copy/paste each line (one at a time) to gitbash or terminal window.

`git config --global --add alias.pr '!f() { git fetch -fu ${2:-upstream} refs/pull/$1/head:pr/$1 && git checkout pr/$1; }; f'`

and

`git config --global --add alias.pr-clean '!git checkout master ; git for-each-ref refs/heads/pr/* --format="%(refname)" | while read ref ; do branch=${ref#refs/heads/} ; git branch -D $branch ; done'`

Once created the aliases are used as shown below.

- To pull a pull request: `git pr <id>` to use the example above git pr 123

- To delete all the pull requests created locally: `git pr-clean`

# Additional Resources

- [General GitHub documentation](http://help.github.com/)

- [GitHub pull request documentation](https://help.github.com/articles/about-pull-requests/)

- [Read the Issue Guidelines by @necolas](https://github.com/necolas/issue-guidelines/blob/master/CONTRIBUTING.md) for more details
