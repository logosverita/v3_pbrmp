// electron
// import { ipcRenderer } from 'electron';
// Node
//React
import { useState } from 'react';
// ライブラリ
import fs from 'fs-extra';
import Store from 'electron-store';
//スタイル
//コンポーネント
//マテリアルUI
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
// import DialogActions from '@material-ui/core/DialogActions';
//マテリアルUI ICONs
import SaveIcon from '@material-ui/icons/Save';
// import RemoveIcon from '@material-ui/icons/Remove';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

const SavePlaylist = (props) => {



    ////////////////////////////////////////////////////////////
    //
    // プレイフォルダ作成関数群
    //
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // 『ファイルをコピーしてプレイリストを作成』関連
    const [checkedCopyToMove, setCheckedCopyToMove ] = useState(true)
    const handleChangeCopyToMove = (event) => {
        // if(checkedCopyToMove){　console.log("Un Checked.")　}
        // else {    console.log("Checked.") }
        setCheckedCopyToMove(event.target.checked)
    }
    ////////////////////////////////////////////////////////////
    // 『プレイリストの名前』関係
    const [ savePlayFolderName , setSavePlayFolderName ] = useState("")
    const handleChange_playlist_name = (event) => {
        setSavePlayFolderName(event.target.value)
    }
    ////////////////////////////////////////////////////////////
    // 『プレイリストの警告』関係
    const [ saveCheck, setSaveCheck ] = useState("0")
    ////////////////////////////////////////////////////////////
    //
    // セーブボタン関数
    //
    const close_and_save_playlist = () => {

        const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア
        const track_info = store_track_view_info.get('tracks')
        // console.log(track_info,track_info.length)

        if  ( (track_info.length !== 0 ) && ( savePlayFolderName !== "") ) {

            const dir = props.playFolderPath+"/"+savePlayFolderName+"/"
            // With Promises:
            fs.ensureDir(dir)
            .then(() => {
                // プレイリストフォルダのフォルダ一覧取得
                const allDirents = fs.readdirSync(props.playFolderPath, { withFileTypes: true })
                const folders = allDirents.filter(dirent => dirent.isDirectory()).map(({ name }) => name)
                // フォルダ名一覧保存
                const store_PLAYLISTS_INFO = new Store({name: 'playlists'})   // トラックリスト全体情報ストア
                store_PLAYLISTS_INFO.set('PLAYLISTS',folders)
                // console.log('success!')
            })
            .catch(err => {
                // console.error(err)
            })
            // コピーして移動にチェックがある場合は、コピーして移動する。
            if ( checkedCopyToMove ) {
                // itemから全てのパスを取得
                props.items.map((item,index) => (
                // With Promises:
                // 取得したパスを元にプレイリストフォルダへ移動
                    fs.copy(item.path, dir+item.name+item.ext)
                    .then(() => {
                        // console.log('success!',dir+item.name+item.ext)
                        // 移動したファイルの情報のストアを更新する処理
                        const store_TRACK_LIST_ALL_INFO = new Store({name: 'tracklist_all_info'})   // トラックリスト全体情報ストア
                        let update_path = store_TRACK_LIST_ALL_INFO.get(item.name)
                        // console.log( "update_path" , update_path )
                        update_path.track_path = dir+item.name+item.ext
                        store_TRACK_LIST_ALL_INFO.set( item.name, update_path )
                        // console.log( "update_path" , update_path )
                    })
                    .catch(err => {
                        // console.error(err)
                    })
                ))
            } else {
                // itemから全てのパスを取得
                props.items.map((item,index) => (
                    // With Promises:
                    fs.move(item.path, dir+item.name+item.ext)
                    .then(() => {
                        // track store クリア
                        store_track_view_info.set('tracks', [] )
                        store_track_view_info.set('loadmeta_count', 0 )
                        store_track_view_info.set('current_id', 0 )
                        store_track_view_info.set('playing_uuid', "" )
                        store_track_view_info.set('uuid', [] )
                        audio_player.pause()
                        audio_player.src = ''
                        props.setVideooCFlag(false)
                        // 移動したファイルの情報のストアを更新する処理
                        const store_TRACK_LIST_ALL_INFO = new Store({name: 'tracklist_all_info'})   // トラックリスト全体情報ストア
                        let update_path = store_TRACK_LIST_ALL_INFO.get(item.name)
                        // console.log( "update_path" , update_path )
                        update_path.track_path = dir+item.name+item.ext
                        store_TRACK_LIST_ALL_INFO.set( item.name, update_path )
                        // console.log( "update_path" , update_path )

                        props.setReloadRequest(true)
                    })
                    .catch(err => {
                        // console.error(err)
                    })
                ))
            }
            // 保存したらプレイリストReact変数とプレイフォルダストアを更新する。
            // プレイリストフォルダのフォルダ一覧取得
            const dir_playfolders= String(props.playFolderPath)
            const store_PLAYLISTS_INFO = new Store({name: 'playlists'})   // トラックリスト全体情報ストア
            const allDirents = fs.readdirSync( dir_playfolders, { withFileTypes: true })
            const folders = allDirents.filter(dirent => dirent.isDirectory()).map(({ name }) => name)
            store_PLAYLISTS_INFO.set('PLAYLISTS',folders)
            props.setPlayListsFolders(folders)

            setSaveCheck("0")
            // プレイリストボタン表示管理フラグ オフ
            props.setMakePlayListFlag(false)
        } else if (track_info.length === 0){
            // プレイリストが空の場合
            setSaveCheck("1")
            setOpenAlrt(true)

        } else {
            // プレイリスト名が無名の場合
            setSaveCheck("2")
            setOpenAlrt(true)

        }
    }
    //
    // スナックバー関連群
    //

    const [openAlrt, setOpenAlrt] = useState(false)
    const handleClickAlrt = () => {
        setOpenAlrt(true)
    }

    const handleCloseAlrt = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpenAlrt(false)

    }

    ////////////////////////////////////////////////////////////
    //
    // mini test functinos

    ////////////////////////////////////////////////////////////

    return (
        <>
        {/* テストユニットここから */}
        {/* <Button onClick={select_folder} >SELECT FOLDER</Button> */}
        {/* テストユニットここまで */}

        {/* <Button onClick={
                () => {
                    textName()
                }}
            >AAA</Button> */}

        <Tooltip title="折りたたむ(shift + q)">
            <Button
                size="small"
                onClick={
                () => {
                    props.setMakePlayListFlag(false)
                }}
            >
                <KeyboardArrowRightIcon fontSize="small" />
            </Button>
        </Tooltip>

        <TextField
            onChange={handleChange_playlist_name}
            defaultValue={props.parentFolderName}
            helperText={
            <><Checkbox
                checked={checkedCopyToMove}
                onChange={handleChangeCopyToMove}
                color="primary"
                /><span>ファイルをコピーしてプレイフォルダを作成</span>
            </>}
            margin="dense"
        />
        <Tooltip title="保存">
            <Button
                onClick={close_and_save_playlist}
            >
                <SaveIcon fontSize="small" />
            </Button>
        </Tooltip>

        <Snackbar
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        open={openAlrt}
        autoHideDuration={6000}
        onClose={handleCloseAlrt}
        message={saveCheck==="1"
                    ?"トラックを追加してください。"
                    :"プレイフォルダに名前をつけてください。"
                }
        action={
        <>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseAlrt}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </>
        }
        />


        </>


    )
}

export default SavePlaylist
