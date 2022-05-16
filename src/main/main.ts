/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import os from 'os';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import {
  createDir,
  newKanbanFile,
  newMindMapFile,
  readFileTree,
  readMindMapFileList,
  removeFile,
  renameFile,
  saveFile,
} from './file';

const APPLICATION_PATH = path.join(os.homedir(), 'tda');

const init = () => {
  createDir(APPLICATION_PATH);
};

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  // 初始化目录
  await init();

  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1400,
    height: 900,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();

  ipcMain.on('list-tree-file', (event) => {
    const tree = readFileTree(APPLICATION_PATH);
    event.reply('list-tree-file', tree);
  });

  ipcMain.on('show-context-menu', (event) => {
    menuBuilder.buildDefaultContextMenu(event, APPLICATION_PATH);
  });

  ipcMain.on('list-mind-map-file', (event) => {
    const list = readMindMapFileList(APPLICATION_PATH, 'MindMap');
    if (list) {
      event.reply('list-mind-map-file', list);
    }
  });

  ipcMain.on('mind-map', async (event, command, arg) => {
    /* if (command === 'list') {
    } */
    if (command === 'new') {
      const pathname = path.join(APPLICATION_PATH, 'MindMap');
      newMindMapFile(pathname, arg.name);
    }
    if (command === 'delete') {
      const pathname = path.join(APPLICATION_PATH, 'MindMap');
      removeFile(pathname, arg.name);
      event.reply('app-notification', 'Delete success!');
    }
    if (command === 'rename') {
      const pathname = path.join(APPLICATION_PATH, 'MindMap');
      // 文件重命名
      renameFile(pathname, arg.oldname, arg.name, '.mindmap');
      event.reply('app-notification', 'Rename success!');
    }
    if (command === 'edit') {
      const pathname = path.join(APPLICATION_PATH, 'MindMap');
      // 保存数据
      saveFile(pathname, `${arg.name}.mindmap`, arg.data);
      event.reply('app-notification', 'Save success!');
    }
    const list = readMindMapFileList(APPLICATION_PATH, 'MindMap');
    if (list) {
      event.reply('list-mind-map-file', list);
    }
  });
};

ipcMain.on('kanban', async (event, command, arg) => {
  /* if (command === 'list') {
  } */
  if (command === 'new') {
    const pathname = path.join(APPLICATION_PATH, 'Kanban');
    newKanbanFile(pathname, arg.name);
  }
  if (command === 'delete') {
    const pathname = path.join(APPLICATION_PATH, 'Kanban');
    removeFile(pathname, arg.name);
    event.reply('app-notification', 'Delete success!');
  }
  if (command === 'rename') {
    const pathname = path.join(APPLICATION_PATH, 'Kanban');
    // 文件重命名
    renameFile(pathname, arg.oldname, arg.name, '.mindmap');
    event.reply('app-notification', 'Rename success!');
  }
  if (command === 'edit') {
    const pathname = path.join(APPLICATION_PATH, 'Kanban');
    // 保存数据
    saveFile(pathname, `${arg.name}.kanban`, arg.data);
    event.reply('app-notification', 'Save success!');
  }
  const list = readMindMapFileList(APPLICATION_PATH, 'Kanban');
  if (list) {
    event.reply('list-kanban', list);
  }
});

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
