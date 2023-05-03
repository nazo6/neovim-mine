import * as path from 'path';
import { promises as fs } from 'fs';
import { execSync } from 'child_process';
import { glob } from 'glob';
import type { RepoInfo } from 'common/repo';
import type { RepoInfoWithTag, Tag, TagInfo } from '$lib/types/repo';

const IGNORED_CATEGORY: string[] = [
	'awesome-neovim',
	'table-of-contents',
	'readme.md',
	'requires-neovim-0.5',
	'plugin'
];
const IGNORED_TOPICS: string[] = ['neovim', 'nvim', 'vim', 'plugin', 'neovim-plugin', 'lua'];

export async function load() {
	const { repos, tagInfo } = await getRepos();
	return { repos, tagInfo };
}

async function getRepos(): Promise<{ repos: RepoInfoWithTag[]; tagInfo: TagInfo }> {
	let files = await glob(path.join(process.cwd(), '../data/data', '*/*/*.json'));
	if (files.length == 0) {
		execSync('git clone --depth 1 https://github.com/nazo6/neovim-mine-data data', {
			cwd: path.join(process.cwd(), '../')
		});

		files = await glob(path.join(process.cwd(), '../data/data', '*/*/*.json'));
	}
	const tagCount: Record<string, number> = {};
	const repos = (
		await Promise.all(
			files.flatMap(async (path) => {
				const fileStr = await fs.readFile(path, { encoding: 'utf8' });
				let repoInfo: RepoInfo;
				try {
					repoInfo = JSON.parse(fileStr) as RepoInfo;
				} catch (e) {
					console.log(path);
					throw e;
				}

				const repoTags: Tag[] = [];

				repoInfo.category.forEach((category) => {
					const categoryNormalized = category.map((c) => {
						let name = c.name.trim();
						name = name.replace(/\[(?<title>.*)\]/, '$<title>');
						name = name.toLowerCase();
						name = name.replaceAll(/ ?, ?/g, ',');
						name = name.replaceAll(/ ?\/ ?/g, ',');
						name = name.replaceAll(' ', '-');

						return { ...c, name };
					});
					const tagTmp: string[] = [];
					categoryNormalized.forEach((crr, i) => {
						const ignored = IGNORED_CATEGORY.some((c) => {
							return crr.name.includes(c);
						});
						if (ignored) return;

						if (i == 0) {
							crr.name = crr.name.replace('.md', '');
						}

						if (tagTmp[tagTmp.length - 1] == crr.name) {
							return;
						}

						tagTmp.push(crr.name);

						const tagStr = tagTmp.join('/');
						tagCount[tagStr] = (tagCount[tagStr] ?? 0) + 1;
						if (!repoTags.includes(tagStr)) {
							repoTags.push(tagStr);
						}
					});
				});

				if ('data' in repoInfo) {
					repoInfo.data.topics.forEach((topic) => {
						let name = topic.trim();
						name = name.toLowerCase();

						if (IGNORED_TOPICS.includes(name)) return;

						tagCount[name] = (tagCount[name] || 0) + 1;
						if (!repoTags.includes(name)) {
							repoTags.push(name);
						}
					});
				}

				return {
					...repoInfo,
					tag: repoTags
				};
			})
		)
	).filter((repo) => {
		if ('error' in repo) {
			return !(repo.error.reason == 'NOT_FOUND');
		}
		return true;
	});

	const tagInfo: TagInfo = Object.entries(tagCount).map(([tag, count]) => ({
		tag,
		count
	}));

	return { repos, tagInfo };
}
