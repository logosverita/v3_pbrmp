import { app , Menu ,dialog , nativeTheme, ipcMain, shell } from 'electron';
import {resolve} from 'path';
import serve from 'electron-serve';
import { createWindow } from './helpers';

const isMac = process.platform === 'darwin'
const isProd = process.env.NODE_ENV === 'production';

// ------------------------------------
// About Panelの内容をカスタマイズする for Mac
// ------------------------------------
const aboutPanel = function(){
  dialog.showMessageBox({
    title: `About PBR Media Player`,
    message: `PBR Media Player ${app.getVersion()}`,
    detail: `Copyright (C) 2021 PBR Media Player`,
    buttons: [],
    icon: resolve(__dirname, 'build/icon.png')
  });
}

//------------------------------------
// メニュー
//------------------------------------
const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      {label:`About ${app.name}`, click:aboutPanel},
      // { role: 'about' },
      // { type: 'separator' },
      // { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  // {
  //   label: 'Edit',
  //   submenu: [
  //     { role: 'undo' },
  //     { role: 'redo' },
  //     { type: 'separator' },
  //     { role: 'cut' },
  //     { role: 'copy' },
  //     { role: 'paste' },
  //     ...(isMac ? [
  //       { role: 'pasteAndMatchStyle' },
  //       { role: 'delete' },
  //       { role: 'selectAll' },
  //       { type: 'separator' },
  //       {
  //         label: 'Speech',
  //         submenu: [
  //           { role: 'startSpeaking' },
  //           { role: 'stopSpeaking' }
  //         ]
  //       }
  //     ] : [
  //       { role: 'delete' },
  //       { type: 'separator' },
  //       { role: 'selectAll' }
  //     ])
  //   ]
  // },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Web Site',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://pbrmediaplayer.com/')
        }
      },
      {
        label: 'Twitter',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://twitter.com/logosverita')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)


if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();
  nativeTheme.themeSource = 'dark';
  const mainWindow = createWindow('main', {
    width: 1000,
    minWidth: 448,
    minHeight: 110, // 最小は90,手動で最小化すると綺麗なサイズが100
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();


//------------------------------------
// IPC Main
//------------------------------------

  ipcMain.handle('request_playlists_folder_open',  (event, file_path) => {
    console.log(file_path)
    shell.showItemInFolder(file_path)
  })

//------------------------------------


app.on('window-all-closed', () => {
  app.quit();
});
