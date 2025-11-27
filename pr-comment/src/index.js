import { getInput, setFailed } from '@actions/core';
import { getOctokit, context as _context } from '@actions/github';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    const artifactUrl = getInput('artifact-url', { required: true });
    const prNumber = getInput('pr-number', { required: true });

    const token = process.env.GITHUB_TOKEN;
    const octokit = getOctokit(token);
    const context = _context;
    const commitUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${context.sha}`;
    const prettyDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const shortSha = context.sha.slice(0, 7);

    const message = `
### New development build available!

#${prNumber} | [\`${shortSha}\`](${commitUrl}) | ${prettyDate}

**Download build:** ${artifactUrl}

---

Happy hacking!
    `;

    await octokit.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: prNumber,
      body: message,
    });

    console.log(`Successfully posted comment to PR #${prNumber}`);
  } catch (error) {
    setFailed(`Failed to post comment: ${error.message}`);
  }
}

console.warn(
  'This branch (main) is deprecated and will be removed in the future. Please use a versioned branch like v1 instead.',
);
run();
