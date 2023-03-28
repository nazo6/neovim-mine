import type { PageServerLoad } from './$types';

import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs/promises';
import { glob } from 'glob';
import type { RepoBasicInfo, RepoErrorInfo, RepoAdvancedInfo } from 'common/repo';

type RepoJson = RepoBasicInfo | (RepoBasicInfo & (RepoAdvancedInfo | RepoErrorInfo));

export const load: PageServerLoad = async () => {
	const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
	const dataDir = path.join(__dirname, '../../../data/data');
	const repoData = await glob(path.join(dataDir, '*/*/*.json'));
	const repos = await Promise.all(
		repoData.map(async (file) => {
			return JSON.parse(await fs.readFile(file, { encoding: 'utf8' })) as RepoJson;
		})
	);

	return {
		repos
	};
};
