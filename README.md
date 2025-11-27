> [!CAUTION]
> This branch is deprecated and will be removed in the future.
>
> Please use a versioned branch like [v1](https://github.com/4mbl/bedrock-actions/tree/v1) instead.

## Tips

## `.github/dependabot.yml`

```yaml
version: 2

updates:
  - package-ecosystem: 'github-actions'
    directory: '/'
    schedule:
      interval: 'weekly'
```

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
        uses: 4mbl/bedrock-actions/bundle-addon@main
        with:
          pack-name: ${{ env.PACK_NAME }}
          directory: './*'

      - name: Upload pack as artifact
        id: upload-pack
        uses: 4mbl/bedrock-actions/upload-pack@main
        with:
          pack-name: ${{ env.PACK_NAME }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Comment to PR with download link
        uses: 4mbl/bedrock-actions/pr-comment@main
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
        uses: 4mbl/bedrock-actions/bundle-addon@main
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
