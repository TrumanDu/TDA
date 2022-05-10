/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const readMindMapFileList = (
  applicationPath: string,
  pathname: string
) => {
  const dir = path.join(applicationPath, pathname);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    return [];
  }

  const files = fs.readdirSync(dir, {
    encoding: 'utf-8',
    withFileTypes: true,
  });

  const list: MindMapItem[] = [];

  files.forEach((dirent) => {
    const filename = dirent.name;

    const filePath = path.join(dir, filename);
    if (!dirent.isDirectory()) {
      const stat = fs.statSync(filePath);
      const data = fs.readFileSync(filePath);

      list.push({
        name: filename,
        changeMs: stat.ctimeMs,
        data: data.toString(),
      });
    }
  });

  list.sort((a, b) => {
    return b.changeMs - a.changeMs;
  });

  return list;
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

export const newDefaultFile = (pathname: string, fileType: string): boolean => {
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
export const newMindMapFile = (pathname: string, filename: string): boolean => {
  let name = path.join(pathname, `${filename}.mindmap`);
  const defaultData = {
    label: 'Topic',
    id: '0',
    style: { fill: 'blue' },
    size: [100, 40],
    children: [],
  };
  if (!fs.existsSync(name)) {
    fs.createFileSync(name);
    fs.writeJSONSync(name, defaultData, 'utf-8');
    return true;
  }

  for (let index = 1; index < 65535; index += 1) {
    name = path.join(pathname, `${filename}(${index}).mindmap`);
    if (!fs.existsSync(name)) {
      fs.createFileSync(name);
      fs.writeJSONSync(name, defaultData, 'utf-8');
      return true;
    }
  }

  return false;
};

export const removeFile = (pathname: string, filename: string): boolean => {
  const name = path.join(pathname, filename);
  if (!fs.existsSync(name)) {
    return true;
  }
  fs.removeSync(name);
  return true;
};

export const renameFile = (
  pathname: string,
  oldname: string,
  newName: string,
  fileType: string
): boolean => {
  const name = path.join(pathname, oldname) + fileType;
  if (!fs.existsSync(name)) {
    return false;
  }
  const newname = path.join(pathname, newName) + fileType;
  fs.renameSync(name, newname);
  return true;
};

export const saveFile = (
  pathname: string,
  name: string,
  data: any
): boolean => {
  const file = path.join(pathname, name);
  if (!fs.existsSync(file)) {
    return false;
  }
  fs.writeJSONSync(file, data);
  return true;
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
