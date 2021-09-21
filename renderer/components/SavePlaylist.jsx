// electron
import { ipcRenderer } from 'electron';
// Node
//React
import { useState , useEffect } from 'react';
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
import Snackbar from '@material-ui/core/Snackbar';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
//マテリアルUI ICONs
import SaveIcon from '@material-ui/icons/Save';
import RemoveIcon from '@material-ui/icons/Remove';
import CloseIcon from '@material-ui/icons/Close';



const SavePlaylist = (props) => {

    ////////////////////////////////////////////////////////////
    //
    // useEffect お気に入りフォルダ作成処理群
    //
    



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
    const check_exist_folder = () => {
        // 音楽フォルダにお気に入りフォルダが作成済みか確認。
        // Mac でのみ有効な手段。"LOGNAME"
        // USER なら Windowsでも使用可能らしいが、未検証。
        const username = process.env["USER"]
        const dir = "/Users/"+username+"/Music/PBR Media Player/"
        // もしなければつくって、スナックバーで作成報告
        // With Promises:
        fs.ensureDir(dir)
            .then(() => {
                // console.log('success!')
        })
        .catch(err => {
            console.error(err)
        })
        // console.log(dir)
    }

    const check_exist_tracks = () => {
        // 今あるトラックを確認する関数
        // これはitemで代用可能だ。
    }
    ////////////////////////////////////////////////////////////////
    const [open_snack_newfolder, setOpen_snack_newfolder] = useState(false)
    const handleClick_snack_newfolder = () => {
        setOpen_snack_newfolder(true)
    }
    const handleClose_snack_newfolder = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpen_snack_newfolder(false)
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

    const log_username = () => {
        // const username = os.userInfo().username
    }
    function open_folder() {
        const file_path = "/Volumes/Samsung_T5/audio/audio_1.mp3"
        ipcRenderer.send('request_playlists_folder_open', file_path)
    }
    const pick_up_folders = () => {

        // プレイリストフォルダのパス取得
        const username = process.env["USER"]
        const dir = "/Users/"+username+"/Music/PBR Media Player/"
        // プレイリストフォルダのフォルダ一覧取得
        const allDirents = fs.readdirSync(dir, { withFileTypes: true })
        const folders = allDirents.filter(dirent => dirent.isDirectory()).map(({ name }) => name)
        // フォルダ名一覧保存
        const store_PLAYLISTS_INFO = new Store({name: 'playlists'})   // トラックリスト全体情報ストア
        store_PLAYLISTS_INFO.set('PLAYLISTS',folders)

        // console.log(folders)
    }
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////

    return (
        <>
        {/* テストユニットここから */}
        {/* <Button onClick={open_folder} >OPEN</Button> */}
        <Button onClick={test_save_playlist_func} >COPY</Button>
        <Button onClick={show_items} >ITEMS</Button>
        <Button onClick={pick_up_folders} >LIST</Button>
        {/* <Button onClick={log_username} >log_username</Button> */}
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
            {/* <a href="#" download={savePlayFolderName} id="btnSave" > */}
                <SaveIcon fontSize="small" />
            {/* </a> */}
        </Button>




        </>


    )
}

export default SavePlaylist
