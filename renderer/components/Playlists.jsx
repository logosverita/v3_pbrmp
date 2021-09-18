// electron
import { ipcRenderer } from 'electron'
//React
// ライブラリ
//スタイル
//コンポーネント
//マテリアルUI
import { Button } from '@material-ui/core';
//マテリアルUI ICONs



function open_folder() {
    const file_path = "/Volumes/Samsung_T5/audio/audio_1.mp3"
    // shell.showItemInFolder(file_path) // Show the given file in a file manager. If possible, select the file.
    // const file_path = "/Volumes/Samsung_T5/audio/"
    // shell.openPath(file_path) // Open the given file in the desktop's default manner.
    // ipcRenderer.send('show-in-folder', file_path)
    ipcRenderer.send('request_playlists_folder_open', file_path)
    // shell.showItemInFolder(file_path)
}


const Playlists = () => {
    return (
        <>
            <Button
                color="primary"
                onClick={open_folder}
            >TEST</Button>
        </>
    )
}

export default Playlists
