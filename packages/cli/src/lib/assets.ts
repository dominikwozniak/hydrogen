import {fileExists, readFile, writeFile} from '@shopify/cli-kit/node/fs';
import {joinPath} from '@shopify/cli-kit/node/path';
import {renderConfirmationPrompt} from '@shopify/cli-kit/node/ui';
import {
  readAndParsePackageJson,
  writePackageJSON,
  type PackageJson as _PackageJson,
} from '@shopify/cli-kit/node/node-package-manager';
import {getAssetDir} from './build.js';

export function copyAssets(
  feature: 'tailwind',
  assets: Record<string, string>,
  rootDirectory: string,
  replacer = (content: string, filename: string) => content,
) {
  const setupAssetsPath = getAssetDir(feature);

  return Promise.all(
    Object.entries(assets).map(async ([source, destination]) => {
      const content = await readFile(joinPath(setupAssetsPath, source));
      await writeFile(
        joinPath(rootDirectory, destination),
        replacer(content, source),
      );
    }),
  );
}

export async function canWriteFiles(
  assetMap: Record<string, string>,
  directory: string,
  force: boolean,
) {
  const fileExistPromises = Object.values(assetMap).map((file) =>
    fileExists(joinPath(directory, file)).then((exists) =>
      exists ? file : null,
    ),
  );

  const existingFiles = (await Promise.all(fileExistPromises)).filter(
    Boolean,
  ) as string[];

  if (existingFiles.length > 0) {
    if (!force) {
      const overwrite = await renderConfirmationPrompt({
        message: `Some files already exist (${existingFiles.join(
          ', ',
        )}). Overwrite?`,
        defaultValue: false,
      });

      if (!overwrite) {
        return false;
      }
    }
  }

  return true;
}

type PackageJson = _PackageJson & {
  peerDependencies?: _PackageJson['dependencies'];
};

const MANAGED_PACKAGE_JSON_KEYS = Object.freeze([
  'dependencies',
  'devDependencies',
  'peerDependencies',
] as const);

type ManagedKey = (typeof MANAGED_PACKAGE_JSON_KEYS)[number];

export async function mergePackageJson(feature: string, projectDir: string) {
  const targetPkgJson: PackageJson = await readAndParsePackageJson(
    joinPath(projectDir, 'package.json'),
  );
  const sourcePkgJson: PackageJson = await readAndParsePackageJson(
    joinPath(getAssetDir(feature), 'package.json'),
  );

  const unmanagedKeys = Object.keys(sourcePkgJson).filter(
    (key) => !MANAGED_PACKAGE_JSON_KEYS.includes(key as ManagedKey),
  ) as Exclude<keyof PackageJson, ManagedKey>[];

  for (const key of unmanagedKeys) {
    const sourceValue = sourcePkgJson[key];
    const targetValue = targetPkgJson[key];

    const newValue =
      Array.isArray(sourceValue) && Array.isArray(targetValue)
        ? [...targetValue, ...sourceValue]
        : typeof sourceValue === 'object' && typeof targetValue === 'object'
        ? {...targetValue, ...sourceValue}
        : sourceValue;

    targetPkgJson[key] = newValue as any;
  }

  for (const key of MANAGED_PACKAGE_JSON_KEYS) {
    if (sourcePkgJson[key]) {
      targetPkgJson[key] = [
        ...new Set([
          ...Object.keys(targetPkgJson[key] ?? {}),
          ...Object.keys(sourcePkgJson[key] ?? {}),
        ]),
      ]
        .sort()
        .reduce((acc, dep) => {
          acc[dep] = (sourcePkgJson[key]?.[dep] ?? targetPkgJson[key]?.[dep])!;
          return acc;
        }, {} as Record<string, string>);
    }
  }

  await writePackageJSON(projectDir, targetPkgJson);
}
