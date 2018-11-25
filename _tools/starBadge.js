var arguments = process.argv.slice(2);
if (!arguments.length) {
	console.log('Need a GITHUB repo URL problem URL; eg. https://github.com/anubhavsrivastava/leetcodeJS ');
	process.exit(0);
}
let leetCodeProblemURL = arguments[0];

var repoURL = arguments[0];
repoURL = repoURL.replace('https://github.com/', '');

let repoArr = repoURL.split('/');

let badgeURL = `https://img.shields.io/github/stars/${repoArr[0]}/${repoArr[1]}.svg?label=&style=social`;
let content = `[![Repo Star](${badgeURL})](${arguments[0]})`;

console.log('Badge Url: ', content);
