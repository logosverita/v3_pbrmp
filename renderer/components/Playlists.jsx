
import { ipcRenderer } from 'electron'
//React
import { useState, useEffect } from 'react'
// ライブラリ
//スタイル
//コンポーネント
//マテリアルUI
import { Button } from '@material-ui/core';
//マテリアルUI ICONs
const {shell} = require('electron') // deconstructing assignment



function open_folder() {
    const file_path = "/Volumes/Samsung_T5/audio/細田守300日（中文字幕）.mp4"
    // shell.showItemInFolder(file_path) // Show the given file in a file manager. If possible, select the file.
    // const file_path = "/Volumes/Samsung_T5/audio/"
    // shell.openPath(file_path) // Open the given file in the desktop's default manner.
    // ipcRenderer.send('show-in-folder', file_path)
    ipcRenderer.invoke('request_playlists_folder_open', file_path)
    // shell.showItemInFolder(file_path)



}
// In renderer process (web page).
// NB. Electron APIs are only accessible from preload, unless contextIsolation is disabled.
// See https://www.electronjs.org/docs/tutorial/process-model#preload-scripts for more details.

function show() {
    const file_path = "/Users/thinker/Pictures/Blog/webp_for_wp/ODD_ONE_OUT/audio_1.mp3"
    // ipcRenderer.send('request_playlists_folder_open', file_path)
    shell.showItemInFolder(file_path)

}

const Playlists = () => {
    return (
        <>
            <Button
                color="primary"
                onClick={open_folder}
            >TEEST</Button>


            <Button
                color="primary"
                onClick={show}
            >SHOW</Button>
        </>
    )
}

export default Playlists
