var arguments = process.argv.slice(2);

function moduleAvailable(name) {
	try {
		require.resolve(name);
		return true;
	} catch (e) {}
	return false;
}

if (!arguments.length) {
	console.log('Need a GITHUB repo URL problem URL; eg. https://github.com/anubhavsrivastava/leetcodeJS ');
	process.exit(0);
}

var repoURL = arguments[0];
repoURL = repoURL.replace('https://github.com/', '');

let repoArr = repoURL.split('/');

let badgeURL = `https://img.shields.io/github/stars/${repoArr[0]}/${repoArr[1]}.svg?label=&style=social`;
let content = `[![Repo Star](${badgeURL})](${arguments[0]})`;

console.log('Badge Url: ', content);

//Copying the result functionality would be only available if you choose to install package in this folder
if (moduleAvailable('clipboardy')) {
	// yeah we've got it!
	const clipboardy = require('clipboardy');
	clipboardy.writeSync(content);
}
