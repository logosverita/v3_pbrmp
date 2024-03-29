import { app , Menu ,dialog , nativeTheme, ipcMain, shell } from 'electron';
import { resolve } from 'path';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import Store from 'electron-store';

const path = require('path');

const isMac = process.platform === 'darwin'
const isProd = process.env.NODE_ENV === 'production';

// ------------------------------------
// About Panelの内容をカスタマイズする for Mac
// ------------------------------------
const aboutPanel = function(){
  dialog.showMessageBox({
    title: `About PBR Media Player`,
    message: `PBR Media Player ${app.getVersion()}`,
    detail: `Copyright (C) 2021 PBR Media Player

    Special Thanks!!
    @hackclub/react-calendar-heatmap 1.8.2
    @material-ui/icons 4.11.2
    array-move 4.0.0
    electron-osx-sign 0.6.0
    electron-serve 1.1.0
    electron-store 8.0.0
    fs-extra 10.0.0
    material-ui-popup-state 1.9.3
    react-dropzone 11.3.4
    react-hotkeys-hook 3.4.0
    react-smooth-dnd 0.11.1"
    @material-ui/core 4.12.3
    electron 16.0.1
    electron-builder 22.14.5
    next 11.0.1
    nextron 7.1.0
    react 17.0.2
    react-dom 17.0.2
    `,
    buttons: [],
    icon: resolve(__dirname, 'build/icon.png')
  });
}

//------------------------------------
// メニュー
//------------------------------------
const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
const lang = store_audio_control.get("LANG")
let isJp = false
if (lang === 'ja'){
  isJp=true
}
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
  // {
  //   label: 'File',
  //   submenu: [
  //     isMac ? { role: 'close' } : { role: 'quit' }
  //   ]
  // },
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
    role: 'Tutorial',
    submenu: [
      {
        label: 'How to download YouTube',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://pbrmediaplayer.com/how-to-download-youtube.html')
        }
      },
      {
        label: 'How to download Teachable',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://pbrmediaplayer.com/how-to-download-Teachable.html')
        }
      },
      { type: 'separator' },
      {
        label: 'Web Site',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://pbrmediaplayer.com/')
        }
      }
    ]
  }
]
const template_jp = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      {label:"PBR Media Player について", click:aboutPanel},
      // { role: 'about' },
      // { type: 'separator' },
      // { role: 'services' },
      { type: 'separator' },
      { label:"PBR Media Player を非表示にする",role: 'hide' },
      { label:"その他を非表示にする", role: 'hideothers' },
      { label:"全てを表示", role: 'unhide' },
      { type: 'separator' },
      { label:"PBR Media Player を終了", role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  // {
  //   label: 'ファイル',
  //   submenu: [
  //     { label:"ウィンドウを閉じる", role: 'close' }
  //   ]
  // },
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
    label: '表示',
    submenu: [
      { label:"ページを再読み込み", role: 'reload' },
      { label:"強制再読み込み", role: 'forceReload' },
      { type: 'separator' },
      { label:"実際のサイズ", role: 'resetZoom' },
      { label:"拡大", role: 'zoomIn' },
      { label:"縮小", role: 'zoomOut' },
      { type: 'separator' },
      { label:"フルスクリーンにする", role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'ウィンドウ',
    submenu: [
      { label:"最小化", role: 'minimize' },
      { label:"ズーム", role: 'zoom' },
      ...(isMac ? [
          { type: 'separator' },
          { label:"全てを手前に移動", role: 'front' },
          { type: 'separator' },
        ] : null
        )
    ]
  },
  {
    label: 'ヘルプ',
    role: 'help',
    submenu: [
      {
        label: 'YouTube 動画のダウンロード方法',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://pbrmediaplayer.com/jp/how-to-download-youtube.html')
        }
      },
      {
        label: 'Teachable 動画のダウンロード方法',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://pbrmediaplayer.com/jp/show-to-download-Teachable.html')
        }
      },
      {
        label: 'ウェブサイト',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://pbrmediaplayer.com/jp/')
        }
      },
      {
        label: 'お問い合わせ',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://inspirationlife.jp/pbr-media-player-support-from/')
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
const menu = Menu.buildFromTemplate(isJp?template_jp:template)
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

  ipcMain.on('request_playlists_folder_open',  (event, file_path) => {
    // console.log(file_path)
    shell.showItemInFolder(file_path)
  })

  ipcMain.handle('request_playlists_select_folder', async ( event ) => {
    const dir_path = dialog.showOpenDialogSync( {
      properties: ['createDirectory', 'openDirectory']
    })
    // console.log(path)
    return dir_path
  })

  ipcMain.handle('request_playlist_folder_parent_path', async ( event, file_path ) => {
    // console.log(file_path)
    const dir_path = file_path.split(path.sep)
    // console.log(dir_path)
    return dir_path
    // const dir = path.dirname('/foo/bar/baz/asdf/quux')

  })


//------------------------------------

app.on('window-all-closed', () => {
  app.quit();
});
