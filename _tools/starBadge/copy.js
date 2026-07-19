const { execSync } = require('child_process');

function copyToClipboard(content) {
	try {
		if (process.platform === 'darwin') {
			execSync('pbcopy', { input: content });
		} else if (process.platform === 'win32') {
			execSync('clip', { input: content });
		} else if (process.platform === 'linux') {
			execSync('xclip -selection clipboard', { input: content });
		}
	} catch (e) {
		// Silently fail if native clipboard tools are unavailable
	}
}

module.exports = copyToClipboard;
