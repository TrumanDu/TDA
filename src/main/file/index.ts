import { mkdir } from 'fs';
import fs from 'fs-extra';
import path from 'path';

const isDirectory = (dirPath: string): boolean => {
  try {
    return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
  } catch (_) {
    return false;
  }
};

type TreeData = {
  label: string;
  value: string;
  key: string;
  isDir: boolean;
  children?: TreeData[] | undefined;
};

export const readFileTree = (pathname: string) => {
  const absPath = path.dirname(pathname);

  if (!isDirectory(absPath)) {
    return Promise.reject(new Error(`[ERROR] ${pathname} not a directory.`));
  }

  const files = fs.readdirSync(pathname, {
    encoding: 'utf-8',
    withFileTypes: true,
  });

  const treeData: TreeData[] = [];

  files.forEach((dirent) => {
    const filename = dirent.name;
    const fileDir = path.join(pathname, filename);
    if (dirent.isDirectory()) {
      treeData.push({
        label: filename,
        value: fileDir,
        key: fileDir,
        isDir: true,
        children: readFileTree(fileDir),
      });
    } else {
      treeData.push({
        label: filename,
        value: fileDir,
        key: fileDir,
        isDir: false,
      });
    }
  });

  return treeData;
};

export const writeFile = (
  pathname: string,
  content: any,
  extension: any,
  options = 'utf-8'
) => {
  if (!pathname) {
    return Promise.reject(new Error('[ERROR] Cannot save file without path.'));
  }
  pathname =
    !extension || pathname.endsWith(extension)
      ? pathname
      : `${pathname}${extension}`;

  return fs.outputFile(pathname, content, options);
};

export const createDir = async (pathname: string) => {
  if (!fs.existsSync(pathname)) {
    await fs.mkdirSync(pathname);
  }
};

export const newFile = (pathname: string, fileType: string): boolean => {
  const templateName = 'Untitled';
  let name = path.join(pathname, `${templateName}.${fileType}`);
  if (!fs.existsSync(name)) {
    fs.createFileSync(name);
    return true;
  }

  for (let index = 1; index < 65535; index += 1) {
    name = path.join(pathname, `${templateName}(${index}).${fileType}`);
    if (!fs.existsSync(name)) {
      fs.createFileSync(name);
      return true;
    }
  }

  return false;
};
export const newDirectory = (pathname: string): boolean => {
  const templateName = 'Untitled Folder';
  let name = path.join(pathname, templateName);
  if (!fs.existsSync(name)) {
    fs.mkdirSync(name);
    return true;
  }

  for (let index = 1; index < 65535; index += 1) {
    name = path.join(pathname, `${templateName}(${index})`);
    if (!fs.existsSync(name)) {
      fs.mkdirSync(name);
      return true;
    }
  }

  return false;
};
