# Development

These notes are reminders to myself about how to do certain things.

## Releasing a New Version

1. Create a new branch.
2. Change the version in `package.json`.
3. Update `CHANGELOG.md`. Move any entries in the `Unreleased` section into a
   new section for the new version. Update the links at the bottom.
4. Create a pull request to make sure CI passes.
5. Merge the pull request.
6. Switch to the `main` branch locally and pull to make sure it's up to date.
7. Create a new, signed tag with something like `git tag -s v1.2.3`.
8. Push the tag with `git push --tags`.
9. The CD GitHub Action should automatically create a new GitHub release.
10. Update the release's description with the changelog text.
11. Run `./dev sh` and then `npm login` and `npm publish` within the shell.
    Don't use `yarn publish` because Yarn collects the one-time password for 2FA
    before the `prepublishOnly` command runs, so the password expires by the
    time Yarn sends it to npm.
