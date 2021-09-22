// electron
import { ipcRenderer } from 'electron';
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
        console.log(track_info,track_info.length)

        if  ( (track_info.length !== 0 ) && ( savePlayFolderName !== "") ){
            // console.log("CLOSE SAVE FUNC")
            // console.log("SAVE:", savePlayFolderName)
            // プレイリストフォルダのパス取得
            const username = process.env["USER"]
            // ToDo "/Users/"+username+"/Music を変更可能にして、好きなところに保存できるようにしたい
            const dir = "/Users/"+username+"/Music/PBR Media Player/"+savePlayFolderName+"/"
            // With Promises:
            fs.ensureDir(dir)
            .then(() => {
                const dir2 = "/Users/"+username+"/Music/PBR Media Player/"
                // プレイリストフォルダのフォルダ一覧取得
                const allDirents = fs.readdirSync(dir2, { withFileTypes: true })
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
                        console.log('success!',dir+item.name+item.ext)
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
                        // console.log('success!',dir+item.name+item.ext)
                        // track store からは除外する。 -> どうせ全部消えるのだから初期化で良い。
                        // const res = track_info.filter( ( name ) => {
                        // return name !== item.name
                        // })
                        // console.log(res)
                        // track store クリア
                        store_track_view_info.set('tracks', [] )
                        store_track_view_info.set('loadmeta_count', 0 )
                        store_track_view_info.set('current_id', 0 )
                        store_track_view_info.set('playing_uuid', "" )
                        store_track_view_info.set('uuid', [] )
                        props.setReloadRequest(true)
                    })
                    .catch(err => {
                        // console.error(err)
                    })
                ))
            }
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
    const select_folder = () => {

        ipcRenderer.invoke('request_playlists_select_folder')
        .then(function(return_path) {
            console.log(return_path)
        })



    }
    ////////////////////////////////////////////////////////////

    return (
        <>
        {/* テストユニットここから */}
        <Button onClick={select_folder} >SELECT FOLDER</Button>
        {/* テストユニットここまで */}




        <TextField
            onChange={handleChange_playlist_name}
            helperText={
            <><Checkbox
                checked={checkedCopyToMove}
                onChange={handleChangeCopyToMove}
                color="primary"
                /><span>ファイルをコピーしてプレイリストを作成</span>
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
                    ?"プレイリストが空です。"
                    :"プレイリストに名前をつけてください。"
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
