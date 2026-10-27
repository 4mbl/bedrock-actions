# 4mbl/bedrock-actions

## Tips

- Setup Dependabot or similar tool to automatically update GitHub Actions.

  ```yaml
  # `.github/dependabot.yml`
  version: 2

  updates:
  - package-ecosystem: 'github-actions'
      directory: '/'
      schedule:
      interval: 'weekly'
  ```

- Pin action and workflow versions to specific commit SHAs.

  ```yaml
   - name: Checkout repository
       uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0
  ```

  You can do this easily with [`pinact`](https://github.com/suzuki-shunsuke/pinact). Just set the specifier to a major version like `actions/checkout@v5`, and execute `pinact run` to pin to the version hash. You can then use dependabot to update the action periodically.

## Versioning

Each workflow and action has its own version tags. Workflow component prefixes match their filenames. Actions use their directory paths with `/` replaced by `-`. New tags are only created when the related workflow or action is changed

Tags use `<component>/vYY.M.N` format: a two-digit year, an unpadded month, and a release number starting at `0` each month. For example, `upload-pack/v26.10.0` is the first October 2026 release of `upload-pack`.

## Examples

### `.github/workflows/pr-comment.yml`

```yaml
name: Pull Request Build Comment

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: write
  packages: write
  issues: write
  pull-requests: write

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      PACK_NAME: 'my-pack.mcpack'
    steps:
      - uses: actions/checkout@v5

      - name: Create pack
        uses: 4mbl/bedrock-actions/bundle-addon@<sha> # bundle-addon/v26.10.0
        with:
          pack-name: ${{ env.PACK_NAME }}
          directory: './*'

      - name: Upload pack as artifact
        id: upload-pack
        uses: 4mbl/bedrock-actions/upload-pack@<sha> # upload-pack/v26.10.0
        with:
          pack-name: ${{ env.PACK_NAME }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Comment to PR with download link
        uses: 4mbl/bedrock-actions/pr-comment@<sha> # pr-comment/v26.10.0
        with:
          artifact-url: ${{ steps.upload-pack.outputs.artifact-url }}
          pr-number: ${{ github.event.pull_request.number }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### `.github/workflows/release-pack.yml`

```yaml
name: Release Pack

on:
  release:
    types: [created]

permissions:
  contents: write
  packages: write

jobs:
  upload:
    runs-on: ubuntu-latest
    env:
      PACK_NAME: 'my-pack.mcpack'
    name: Zip and Upload
    steps:
      - uses: actions/checkout@v5

      - name: Create pack
        uses: 4mbl/bedrock-actions/bundle-addon@<sha> # bundle-addon/v26.10.0
        with:
          pack-name: ${{ env.PACK_NAME }}
          directory: './*'

      - name: Upload to release
        uses: svenstaro/upload-release-action@v2
        with:
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          file: ${{ env.PACK_NAME }}
          asset_name: ${{ env.PACK_NAME }}
          tag: ${{ github.ref }}
          overwrite: true
```
