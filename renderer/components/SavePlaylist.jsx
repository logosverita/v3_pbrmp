// electron
import { ipcRenderer } from 'electron';
//React
import { useState } from 'react';
// ライブラリ
import fs from 'fs-extra';
import Store from 'electron-store';
//スタイル
import PL from '../style/playlists.module.css';
//コンポーネント
//マテリアルUI
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';

//マテリアルUI ICONs
import SaveIcon from '@material-ui/icons/Save';
import RemoveIcon from '@material-ui/icons/Remove';
const SavePlaylist = (props) => {

    ////////////////////////////////////////////////////////////

    const [checked_playlist_copy, setChecked_playlist_copy] = useState(true)
    const handleChange_playlist_copy = (event) => {
        setChecked_playlist_copy(event.target.checked);
    }
    ////////////////////////////////////////////////////////////
    // 保存名
    const [ savePlayFolderName , setSavePlayFolderName ] = useState("playlist.txt")
    const handleChange = e => setSavePlayFolderName(e.target.value+".txt")


    ////////////////////////////////////////////////////////////
    //
    // プレイフォルダ作成関数群
    //
    ////////////////////////////////////////////////////////////
    const close_and_save_playlist = () => {
        console.log("CLOSE SAVE FUNC")
        props.setMakePlayListFlag(false)
    }
    const origin_file_path = "/Volumes/Samsung_T5/audio/audio_1.mp3"
    const save_playfolder_name = "audio_test"
    const move_to_file_path = "/Volumes/Samsung_T5/audio/"+save_playfolder_name+"/audio_1.mp3"
    const test_save_playlist_func = () => {
        // With a callback:
        // 移動したいファイルが既に移動先にあるか確認
        fs.pathExists( move_to_file_path , (err, exists) => {
            // console.log(err) // => null
            if ( exists ) {
                console.log("すでにファイルが存在しています。")
            } else {
                console.log("ファイルをコピーして移動します。")
                fs.copy( origin_file_path, move_to_file_path )
                .then(() => console.log('success!'))
                .catch(err => console.error(err))
            }
        })
    }
    ////////////////////////////////////////////////////////////
    //
    // テスト用ミニマム関数群
    //
    ////////////////////////////////////////////////////////////
    const show_items = () => {
        console.log(props.items)
    }
    const select_folder = () => {
        const file_path = "audio_test"
        console.log("SELECT FOLDER")
    }
    function open_folder() {
        const file_path = "/Volumes/Samsung_T5/audio/audio_1.mp3"
        ipcRenderer.send('request_playlists_folder_open', file_path)
    }
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////

    return (
        <>
        {/* テストユニットここから */}
        {/* <Button onClick={open_folder} >OPEN</Button> */}
        {/* <Button onClick={test_save_playlist_func} >COPY</Button> */}
        {/* <Button onClick={show_items} >ITEMS</Button> */}
        {/* <Button onClick={select_folder} >SELECT FOLDER</Button> */}
        {/* テストユニットここまで */}





        <TextField
            onChange={handleChange}
            helperText={
            <><Checkbox
                color="primary"
                /><span>ファイルをコピーしてプレイフォルダを作成</span>
            </>}
            margin="dense"
        />
        <Button
            onClick={close_and_save_playlist}
        >
            <a href="#" download={savePlayFolderName} id="btnSave" >
                <SaveIcon fontSize="small" />
            </a>
        </Button>
        </>




    )
}

export default SavePlaylist
