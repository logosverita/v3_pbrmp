//React
import {  useState,useEffect, useReducer,useCallback } from 'react';

// ライブラリ
import Store from 'electron-store';
import { Container, Draggable } from 'react-smooth-dnd';
import { arrayMoveImmutable } from 'array-move';
import { useHotkeys } from 'react-hotkeys-hook';
//スタイル
import HR from '../style/history.module.css';
//コンポーネント
import Languages from '../components/Languages';
//マテリアルUI
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';


//マテリアルUI Icon
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import SortIcon from '@material-ui/icons/Sort';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
// ToDo:これをトラックリストに追加するアイコン、音を鳴らす　シュッて。
import ForwardIcon from '@material-ui/icons/Forward';


const History = (props) => {

    const store_TRACK_LIST_ALL_INFO = new Store({name: 'tracklist_all_info'})   // トラックリスト全体情報ストア
    const store_TRACK_array = store_TRACK_LIST_ALL_INFO.get('TRACKS')
    let track_items = []
    const track_diff_elapsed = []
    const today = new Date()

    if(store_TRACK_LIST_ALL_INFO.has('TRACKS')){
        for (let i=0; i<store_TRACK_array.length; i++ ) {
            const store_TRACK_INFO = store_TRACK_LIST_ALL_INFO.get(store_TRACK_array[i])
            // console.log(store_TRACK_INFO)
            // 差分日時を計算して配列に追加保存
            const elapsed = new Date(store_TRACK_INFO.track_play_date)
            // console.log("elapsed",elapsed)
            const diff =  Math.ceil(( today.getTime() - elapsed.getTime() ) / 86400000 )
            // console.log("diff",diff)
            track_diff_elapsed.push(diff)
            // ストアデータを配列に追加して保存
            track_items.push(store_TRACK_INFO)
        }
        // console.log(track_items)
    }

    function rep_date(str){
        return str.replace( /-/g, "/") // スラッシュで挟んだ文字をグローバルに置換
    }
    // 2つのYYYY-MM-DD形式の日付の差分(日数)を求める関数
    // function getDateDiff(dateString1, dateString2) {
    //     // 日付を表す文字列から日付オブジェクトを生成
    //     const date1 = new Date(dateString1)
    //     const date2 = new Date(dateString2)
    //     // 2つの日付の差分（ミリ秒）を計
    //     const msDiff  = date1.getTime() - date2.getTime()
    //     // 求めた差分（ミリ秒）を日付に変換
    //     // 差分÷(1000ミリ秒×60秒×60分×24時間)
    //     return Math.ceil(msDiff / (1000 * 60 * 60 *24))
    // }
    ////////////////////////////////////////////////////////////////
    //
    // 拡張パネル
    //
    ////////////////////////////////////////////////////////////////
    const [ open, setOpen] = useState(false)
    const [ deleteName, setDeleteName ] =  useState("")
    const handleClickOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const useStyles = makeStyles((theme) => ({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            border: '1px solid rgb(44, 44, 44);',
            // boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }))
    const classes = useStyles()


    const handleOk = () => {
        // Track詳細情報の削除
        const store_TRACK_LIST_ALL_INFO = new Store({name: 'tracklist_all_info'})   // トラックリスト全体情報ストア
        store_TRACK_LIST_ALL_INFO.delete(deleteName)
        // Track名前リストからの削除
        const store_TRACK_array = store_TRACK_LIST_ALL_INFO.get('TRACKS')
        const array_TRACKS = []
        for ( let i = 0; i<store_TRACK_array.length; i++){
            if(store_TRACK_array[i] !== deleteName){
                array_TRACKS.push(store_TRACK_array[i])
            }
        }
        store_TRACK_LIST_ALL_INFO.set('TRACKS',array_TRACKS)
        // 再生リストからTrack名を削除
        const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア
        const track_list_info = store_track_view_info.get('tracks')
        const array_tracks = []
        for ( let i = 0; i<track_list_info.length; i++){
            if(track_list_info[i] !== deleteName){
                array_tracks.push(track_list_info[i])
            }
        }
        store_track_view_info.set('tracks',array_tracks)
        // 再生リストの読み込み中のトラック数情報を更新
        const track_list_count = store_track_view_info.get('loadmeta_count')
        const num = Number(track_list_count) - Number(1)
        store_track_view_info.set('loadmeta_count',num)
        // リロードリクエスト変数送信。
        props.setReloadRequest(true)
        // ダイアログを閉じる
        setOpen(false)

        // console.log("トラック情報を削除しました。",deleteName,array)
        // snackbars　をしてもいいししなくてもいい。
    }
    ////////////////////////////////////////////////////////////////
    //
    // テーブルセル上下入れ替え関数群
    //
    //  TpDp:ヒストリーのDnDで書き換え可能にする。
    ////////////////////////////////////////////////////////////////
    const [items, dispatch] = useReducer((state, action) => {
    // const store_TRACK_LIST_ALL_INFO = new Store({name: 'tracklist_all_info'})   // トラックリスト全体情報ストア
    switch (action.type) {
        case "dnd":
            const store_TRACK_LIST_ALL_INFO = new Store({name: 'tracklist_all_info'})   // トラックリスト全体情報ストア
            // const store_TRACK_array = store_TRACK_LIST_ALL_INFO.get('TRACKS')
            const track_INFO = store_TRACK_LIST_ALL_INFO.get('TRACKS')
            const new_track_INFO = arrayMoveImmutable(track_INFO, action.removedIndex, action.addedIndex)
            store_TRACK_LIST_ALL_INFO.set('TRACKS', new_track_INFO )
            // console.log('tracks',track_INFO )
            // console.log('new tracks',new_track_INFO )

            return arrayMoveImmutable(action.items, action.removedIndex||0, action.addedIndex||0)
        case "sort":
                // console.log("Sorted.",track_items, action.key_name )
                track_items.sort(function(a, b) {
                    var nameA =  sort_a_b_toUpper( a, action.key_name )
                    var nameB = sort_a_b_toUpper( b, action.key_name)
                    // if (nameA < nameB) { return -1 }
                    // if (nameA > nameB) { return 1 }
                    const sa = String(nameA).replace(/(\d+)/g, m => m.padStart(30, '0'));
                    const sb = String(nameB).replace(/(\d+)/g, m => m.padStart(30, '0'));
                    return sa < sb ? -1 : sa > sb ? 1 : 0;
                })
                track_items = sort_array_and_save(track_items)
                return track_items
        case "reverse":
            // console.log("reverse.",track_items, action.key_name )
            track_items.sort(function(a, b) {
                var nameA =  sort_a_b_toUpper( a, action.key_name )
                var nameB = sort_a_b_toUpper( b, action.key_name)
                const sa = String(nameA).replace(/(\d+)/g, m => m.padStart(30, '0'));
                const sb = String(nameB).replace(/(\d+)/g, m => m.padStart(30, '0'));
                return sa < sb ? 1 : sa > sb ? -1 : 0;
            })
            track_items = sort_array_and_save(track_items)
            return track_items
        case "reload": // 設定を初期化せずにレコード情報をクリア
            return []
        default:
            return state
    }
    }, [])
    function sort_a_b_toUpper(str, array_name){
        if(array_name === "track_favorite"){
            return str.track_favorite
        }
        if(array_name === "track_name"){
            return str.track_name.toUpperCase() // 大文字と小文字を無視する
        }
        if(array_name === "track_count"){
            return str.track_count
        }
        if(array_name === "track_play_date"){
            return str.track_play_date
        }
        return 0
    }
    function sort_array_and_save(array){
        // ソートした配列から名前だけ抜き出してTRACKSに保存
        const store_TRACK_LIST_ALL_INFO = new Store({name: 'tracklist_all_info'})   // トラックリスト全体情報ストア
        let save_array = []
        for (let i=0; i<array.length; i++ ) {
            save_array.push(array[i].track_name)
        }
        // console.log(save_array)
        store_TRACK_LIST_ALL_INFO.set('TRACKS', save_array )
        return array
    }


    const [ dndTime, setDndTime ] = useState(0)
    function onDrop(dropResult ) {
        const time = Date.now() // ２回dispatchが実行されてしまうのをなぜか防げる処理
        setDndTime(time)// ２回dispatchが実行されてしまうのをなぜか防げる処理
        const  { removedIndex , addedIndex , payload , element } = dropResult
        dispatch({
            type:'dnd',
            items:items,
            removedIndex:removedIndex,
            addedIndex:addedIndex
        })
        // リスト上下で動いたidを保存し直す処理
        dispatch({ type:'reload' }) // 設定を初期化せずにレコード情報をクリア
    }

    ////////////////////////////////////////////////////////////////
    //
    // ショートカット用ソート関数
    //
    ////////////////////////////////////////////////////////////////
    //
    function sort(key_name) {
        if( key_name === "track_favorite" ){
            if(sortFlagFavo){
                // console.log("Func reverse:track_favorite")
                dispatch({ type:'reverse', items:items , key_name:"track_favorite" })
                setSortFlagFavo(false)
            }else{
                // console.log("Func Sorted:track_favorite")
                dispatch({ type:'sort', items:items, key_name:"track_favorite"  })
                setSortFlagFavo(true)
            }
        }
        if( key_name === "track_name" ){
            if(sortFlagTitle){
                // console.log("Func reverse:key_name")
                dispatch({ type:'reverse', items:items , key_name:"track_name" })
                setSortFlagTitle(false)
            }else{
                // console.log("Func sort:key_name")
                dispatch({ type:'sort', items:items, key_name:"track_name"  })
                setSortFlagTitle(true)
            }
        }
        if( key_name === "track_count" ){
            if(sortFlagCount){
                // console.log("Func reverse:track_count")
                dispatch({ type:'reverse', items:items , key_name:"track_count" })
                setSortFlagCount(false)
            }else{
                // console.log("Func Sorted:track_count")
                dispatch({ type:'sort', items:items, key_name:"track_count"  })
                setSortFlagCount(true)
            }
        }
        if( key_name === "track_play_date" ){
            if(sortFlagDate){
                // console.log("Func reverse:track_play_date")
                dispatch({ type:'reverse', items:items , key_name:"track_play_date" })
                setSortFlagDate(false)
            }else{
                // console.log("Func sort:track_play_date")
                dispatch({ type:'sort', items:items , key_name:"track_play_date" })
                setSortFlagDate(true)
            }
        }
    }

    //
    // 翻訳コード
    //
    const [t_00, setT_00 ] = useState("")
    const [t_01, setT_01 ] = useState("")
    const [t_02, setT_02 ] = useState("")
    const [t_03, setT_03 ] = useState("")
    const [t_04, setT_04 ] = useState("")
    const [t_05, setT_05 ] = useState("")
    const [t_06, setT_06 ] = useState("")
    const [t_07, setT_07 ] = useState("")
    const [t_08, setT_08 ] = useState("")
    const [t_09, setT_09 ] = useState("")



    useEffect(()=>{
        const text_00 = Languages("Favorite")
        const text_01 = Languages("Title")
        const text_02 = Languages("Count")
        const text_03 = Languages("Date")
        const text_04 = Languages("Edlapsed")
        const text_05 = Languages("Delete")
        const text_06 = Languages("Delete_Dia_title")
        const text_07 = Languages("Delete_Dia_info")
        const text_08 = Languages("OK")
        const text_09 = Languages("Cancel")


        setT_00(text_00)
        setT_01(text_01)
        setT_02(text_02)
        setT_03(text_03)
        setT_04(text_04)
        setT_05(text_05)
        setT_06(text_06)
        setT_07(text_07)
        setT_08(text_08)
        setT_09(text_09)


    })

    ////////////////////////////////////////////////////////////////
    // お気に入りON/OFF管理関数
    function favorite_onoff(name) {
        // console.log('favorite_onoff',name)
        //引数の名前から該当する全情報ストアのトラックのお気に入りを反転させる処理
        let track_INFO = store_TRACK_LIST_ALL_INFO.get(name)
        track_INFO.track_favorite = !track_INFO.track_favorite
        store_TRACK_LIST_ALL_INFO.set(name,track_INFO)
        // その後リロード
        dispatch({ type:'reload' }) // 設定を初期化せずにレコード情報をクリア
        // リロードリクエスト変数送信。
        props.setReloadRequest(true)
        // console.log('TRACK_INFO',track_INFO)
        // console.log(items)
    }
    ////////////////////////////////////////////////////////////////
    // テーブルソート管理React変数群
    const [ sortFlagFavo, setSortFlagFavo ] = useState(false)
    const [ sortFlagTitle, setSortFlagTitle ] = useState(false)
    const [ sortFlagCount, setSortFlagCount ] = useState(false)
    const [ sortFlagDate, setSortFlagDate ] = useState(false)
    // const [ sortFlagEdlapsed, setSortFlagEdlapsed ] = useState(false)
    //
    // Shortcut Key
    //
    useHotkeys('shift + 1', useCallback(() => sort("track_favorite")), [sortFlagFavo])
    useHotkeys('shift + 2', useCallback(() => sort("track_name")), [sortFlagTitle])
    useHotkeys('shift + 3', useCallback(() => sort("track_count")), [sortFlagCount])
    useHotkeys('shift + 4', useCallback(() => sort("track_play_date")), [sortFlagDate])


    return (
        <>
        <div className={HR.wrap}>
            <div
                className={HR.table}
                id="history_table"
            >
                <div className={HR.table_row_head}>
                <Tooltip title={t_00+ " (shift + 1)"} placement="bottom-start">
                    <div className={HR.table_cell_head_favo}>
                        {sortFlagFavo
                        ?<StarIcon className={HR.icon_des}  fontSize="small" onClick={
                            ()=>{
                                dispatch({ type:'reverse', items:items, key_name:"track_favorite"  })
                                setSortFlagFavo(false)
                            }
                        } />
                        :<StarIcon className={HR.icon_des}  fontSize="small" onClick={
                            () => {
                                dispatch({ type:'sort', items:items, key_name:"track_favorite"  })
                                setSortFlagFavo(true)
                            }
                        } />
                        }
                    </div>
                </Tooltip>

                    <div id="table_cell_head_title" className={HR.table_cell_head_title}
                        onClick={
                            sortFlagTitle
                            ?()=>{
                                    dispatch({ type:'reverse', items:items , key_name:"track_name" })
                                    setSortFlagTitle(false)
                                }
                            :() => {
                                dispatch({ type:'sort', items:items, key_name:"track_name"  })
                                setSortFlagTitle(true)
                            }
                        }
                    >
                        <Tooltip title={t_01+ " (shift + 2)"} placement="bottom-start">
                            <div className={HR.text_abridgement}>{t_01}</div>
                        </Tooltip>
                        {sortFlagTitle
                        ?<SortIcon className={HR.icon_ace}  fontSize="small" />
                        :<SortIcon className={HR.icon_des}  fontSize="small" />
                        }
                    </div>
                    <div className={HR.table_cell_head_count}
                        onClick={
                            sortFlagCount
                            ?()=>{
                                dispatch({ type:'reverse', items:items , key_name:"track_count" })
                                setSortFlagCount(false)
                            }
                            :()=>{
                                dispatch({ type:'sort', items:items , key_name:"track_count" })
                                setSortFlagCount(true)
                            }
                        }
                    >
                        <Tooltip title={t_02+ " (shift + 3)"} placement="bottom-start">
                            <div className={HR.text_abridgement}>{t_02}</div>
                        </Tooltip>
                        {sortFlagCount
                        ?<SortIcon className={HR.icon_ace}  fontSize="small" />
                        :<SortIcon className={HR.icon_des}  fontSize="small" />
                        }
                    </div>
                    <div className={HR.table_cell_head_date}
                        onClick={
                            sortFlagDate
                            ?()=>{
                                dispatch({ type:'reverse', items:items , key_name:"track_play_date" })
                                setSortFlagDate(false)
                            }
                            : ()=>{
                                dispatch({ type:'sort', items:items , key_name:"track_play_date" })
                                setSortFlagDate(true)
                            }
                        }
                    >
                        <Tooltip title={t_03+ " (shift + 4)"} placement="bottom-start">
                            <div className={HR.text_abridgement}>{t_03}</div>
                        </Tooltip>
                        {sortFlagDate
                        ?<SortIcon className={HR.icon_ace}  fontSize="small" />
                        :<SortIcon className={HR.icon_des}  fontSize="small" />
                        }
                    </div>

                    <div className={HR.table_cell_head_elapsed_date}>
                        <Tooltip title={t_04} placement="bottom-start">
                            <div className={HR.text_abridgement}>{t_04}</div>
                        </Tooltip>
                    </div>



                </div>
                <div id="GC" >
                <Container lockAxis="y" onDrop={onDrop}>
                    {track_items.map((item, index)=> (
                    <Draggable key={item.track_uuid} className={HR.a} >
                        <div className={HR.a} >
                            <div className={HR.b}>
                                {(item.track_favorite)
                                    ?<StarIcon
                                        onClick={
                                            ()=>{ favorite_onoff(item.track_name) }
                                        }
                                    />
                                    :<StarBorderIcon onClick={
                                        ()=>{ favorite_onoff(item.track_name) } }
                                    />
                                }
                            </div>
                            <div className={HR.c}>
                                {item.track_name}
                            </div>
                            <div className={HR.d}>
                                {item.track_count}
                            </div>
                            <div className={HR.e}>
                                {rep_date(item.track_play_date)}
                                {/* {item.track_play_date} */}
                            </div>
                            <div className={HR.f}>
                                {track_diff_elapsed[index]}
                            </div>
                            <div className={HR.g}>
                                <PopupState variant="popover" popupId="demo-popup-menu">
                                    {(popupState) => (
                                    <>
                                        <MoreVertIcon {...bindTrigger(popupState)} />
                                        <Menu {...bindMenu(popupState)}>
                                            <MenuItem
                                                onClick={
                                                    ()=>{
                                                        setDeleteName(item.track_name)
                                                        popupState.close()
                                                        handleClickOpen()
                                                    }
                                                }
                                            >
                                                <ListItemIcon>
                                                    <DeleteIcon fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText primary={t_05} />
                                            </MenuItem>
                                        </Menu>
                                    </>
                                    )}
                                </PopupState>
                            </div>

                            <div className={HR.h}>
                                <FolderOpenIcon fontSize="small" />
                            </div>

                        </div>
                    </Draggable>
                    ))}
                </Container>
                </div>
            </div>
        </div>
        <Modal
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
            <Fade in={open}>
                <div className={classes.paper}>
                <div>{t_06}</div>
                <div>
                {t_07}
                </div>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                    {t_09}
                    </Button>
                    <Button onClick={handleOk} color="primary">
                    {t_08}
                    </Button>
                </DialogActions>
                </div>
            </Fade>
        </Modal>
    </>
    )

}


export default History;