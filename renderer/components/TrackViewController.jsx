
// electron
import { ipcRenderer } from 'electron';
//React
import { useReducer, useCallback , useEffect,useState  } from 'react';
// ライブラリ
import Store from 'electron-store';
import fs from 'fs-extra';
import { useDropzone } from 'react-dropzone'
import { Container, Draggable } from 'react-smooth-dnd';
import { useHotkeys } from 'react-hotkeys-hook';
import { arrayMoveImmutable } from 'array-move';
import TV from '../style/track_view.module.css';

//コンポーネント
import AudioEffect from '../components/AudioEffect';
import DnDMinimam from '../components/DnDMinimam';
import Languages from '../components/Languages';
import SavePlaylist from '../components/SavePlaylist';
//マテリアルUI
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
//マテリアルUI ICON
import StarIcon from '@material-ui/icons/Star';
import DeleteIcon from '@material-ui/icons/Delete';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ClearIcon from '@material-ui/icons/Clear';
import PlayForWorkIcon from '@material-ui/icons/PlayForWork';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import SortIcon from '@material-ui/icons/Sort';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';


const TrackViewController = (props) => {
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // 初期設定変数群
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    const store_TRACK_LIST_ALL_INFO = new Store({name: 'tracklist_all_info'})   // トラックリスト全体情報ストア
    const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア
    const make_random_str = () => { return Math.random().toString(32).substring(2) } // 更新管理用ランダム数列作成関数
    let track_list_name_only = []   // VIEW管理用にトラック名だけの配列を追加 // 処理が終わったトラック上の名前をストアにして保存する用の配列
    let track_list_name_uuid = []
    const [ currentId, setCurrentId ] = useState(0)
    const [ dndMiniFlag, setDnDMiniFlag ] = useState(true)   // DnDエリア折り畳みフラグ
    // const [ importTrackFlag, setImportFlag ] = useState(false) // DnDエリアにトラックをインポート中判定フラグ。
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // リロードリクエスト受付関数
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(()=>{
        if ( props.reloadRequest ) {
            reload_track_view()
            const current_track_id = store_track_view_info.get('current_id')
            setCurrentId(current_track_id)
            props.setReloadRequest(false)
        }
        // モードスイッチでクリアされるテーブル情報を再リロードする処理
        if ( props.modeSwitchOn ) {
            reload_track_view()
            props.modeSwitchOn(false)
        }
    })
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // Dispatch 関数群
    //
    // useReducer　TrackView管理機能群
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    const [items, dispatch] = useReducer((state, action) => {
        const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア
        switch (action.type) {
            case "push":
                return [
                    ...state,
                    {
                        id: state.length,
                        name: action.name,
                        blob: action.blob,
                        time: action.time,
                        count: action.count,
                        favorite: action.favorite,
                        uuid: action.uuid,
                        mime: action.mime,
                        path: action.path,
                        ext: action.ext,
                    }
                    // MediaDropOpen.jsx にも同様の記載をすること
                ]
            case "remove":
            // keep every item except the one we want to remove
                track_list_name_only = []
                track_list_name_uuid = []
                const result = state.filter((_, index) => index != action.index)
                for (let i=0; i<result.length; i++ ) {
                    // console.log(result[i])
                    track_list_name_only.push(result[i].name)
                    track_list_name_uuid.push(result[i].uuid)
                }
                if( track_list_name_only.length === 0 ) {
                    audio_player.pause()
                    audio_player.src = ''
                    // console.log('NO RECORD')
                }
                // ストアトラックからも情報を消去
                store_track_view_info.set('loadmeta_count',track_list_name_uuid.length)
                store_track_view_info.set('tracks', track_list_name_only)
                store_track_view_info.set('uuid', track_list_name_uuid)
                // console.log('RESULT:',result)
                // console.log('REMOVE TRACK CHECK ...:', track_list_name_only )
                // console.log('REMOVE UUID CHECK ...:', track_list_name_uuid )
                return state.filter((_, index) => index != action.index)
            case "sort":
                // console.log("Sorted.",state,  action.key_name )
                state.sort((a, b) => {
                    var nameA =  sort_a_b_toUpper( a, action.key_name )
                    var nameB = sort_a_b_toUpper( b, action.key_name)
                    // console.log(nameA,nameB)
                    const sa = String(nameA).replace(/(\d+)/g, m => m.padStart(30, '0'));
                    const sb = String(nameB).replace(/(\d+)/g, m => m.padStart(30, '0'));
                    return sa < sb ? -1 : sa > sb ? 1 : 0;
                })
                state = sort_array_and_save(state)
                return state
            case "reverse":
                // console.log("Reversed.",state,  action.key_name )
                state.sort(function(a, b) {
                    var nameA =  sort_a_b_toUpper( a, action.key_name )
                    var nameB = sort_a_b_toUpper( b, action.key_name)
                    const sa = String(nameA).replace(/(\d+)/g, m => m.padStart(30, '0'));
                    const sb = String(nameB).replace(/(\d+)/g, m => m.padStart(30, '0'));
                    return sa < sb ? 1 : sa > sb ? -1 : 0;
                })
                state = sort_array_and_save(state)
                return state
            case "clear": // 設定を初期化
                const len = store_track_view_info.get('tracks')
                if ( len.length >= 0) {
                    audio_player.pause()
                    audio_player.src = ''
                    store_track_view_info.set('tracks',[])
                    store_track_view_info.set('current_id',0)
                    store_track_view_info.set('uuid',[])
                    store_track_view_info.set('playing_uuid',"")
                    store_track_view_info.set('loadmeta_count',0)
                    // プレイフォルダ名の初期化
                    // Done AudioController の VideoFlag をHomeに上昇させてアクセスできるように持ってくる。
                    // But,
                    // Warning Code:↓
                    props.setVideooCFlag(false)
                    // console.log('track_view_clear DONE')
                    // console.log('LEN,',len.length)
                    return []
                } else {
                    return []
                }
            case "reload": // 設定を初期化せずにレコード情報をクリア
                return []
            case "dnd":
                const track_info = store_track_view_info.get('tracks')
                const current_track_id = store_track_view_info.get('uuid')
                const new_track_info = arrayMoveImmutable(track_info, action.removedIndex, action.addedIndex)
                const new_track_uuid = arrayMoveImmutable(current_track_id, action.removedIndex, action.addedIndex)
                store_track_view_info.set('tracks',new_track_info)
                store_track_view_info.set('uuid',new_track_uuid)
                // console.log('removedIndex:',action.removedIndex,'addedIndex:',action.addedIndex)
                // console.log('tracks',track_info )
                // console.log('new tracks',new_track_info )
                return arrayMoveImmutable(action.items, action.removedIndex||0, action.addedIndex||0)
            default:
                return state
        }
        }, [])
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // useDropZone　DnD管理機能群
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////


    const onDropRejected = useCallback(files => {
        //ToDo リジェクトした時のCSSスタイルを表示
        // console.log('rejected files')
    }, [])
    const onDropAccepted = useCallback(files => {
        // ロード中は画面の切り替えができない様にする
        // console.log(files)
        // setImportFlag(true)
        setMakePlayListFlag(false)
        let promise = new Promise(function(resolve, reject){
            const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
            store_audio_control.set("LOADING",true)
            // console.log("LOADING NOW")
            resolve(1)
        }).then(function() {
            make_track_info(files)
            return(1)
        }).finally(function() {
            const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
            store_audio_control.set("LOADING",false)
            // setImportFlag(false)
            // console.log("LOADING NOT NOW")
            return(1)
        })
    }, [])
    const {getRootProps, getInputProps, open, isDragActive, isDragAccept, isDragReject } = useDropzone({
        accept: 'audio/mpeg, audio/wav, audio/aac, audio/ogg, video/mp4',
        noClick: true,
        onDropAccepted,
        onDropRejected,
    })
    ////////////////////////////////////////////////////////////////
    // isDragActive とかはreact-dropzoneの変数 dnd処理の値が入る
    // DnD でボーダーの色を変える関数
    ////////////////////////////////////////////////////////////////
    const dnd_border_color_change = (isDragAccept,isDragReject) => {
        if ( isDragAccept ) {
            // return "#4453CC"
            return "#4453CC"
        } else if( isDragReject) {
            return "#4453CC"
            // Build 1.18.0 フォルダごとD&DしてもOKだけど、赤色になるから、DnDしたら色が変更するように変更。
            // return "red"
        } else {
            return "rgb(192, 191, 191)"
        }
    }
    const border = `${isDragActive ? "solid" : "dashed"} 1px ${dnd_border_color_change(isDragAccept,isDragReject)}`
    ////////////////////////////////////////////////////////////////
    // 日付をYYYY-MM-DDの書式で返すメソッド
    function formatDate(dt) {
        var y = dt.getFullYear();
        var m = ('00' + (dt.getMonth()+1)).slice(-2)
        var d = ('00' + dt.getDate()).slice(-2)
        return (y + '-' + m + '-' + d)
    }
    ////////////////////////////////////////////////////////////////
    // DnDしたファイル情報作成関数
    let folderSaveName = ""
    function make_track_info(files){
        track_list_name_only = store_track_view_info.get('tracks')
        track_list_name_uuid = store_track_view_info.get('uuid')
        let loadmeta_count = 0
        for (let i=0; files.length>i; i++) {
            // 新規読み込みファイルから拡張子を分離してファイル名だけを使用する処理
            // console.log("file name:", files[i].name)
            // console.log("file ext:", (files[i].name).split(/(?=\.[^.]+$)/)[1])
            // const filename = (files[i].name).split(/(?=\.[^.]+$)/)[0] これだど TITLE.TAA.12.02.mp3 の場合、TITLEだけがトラック名となってしまう。
            const ext_count = (files[i].name).split(/(?=\.[^.]+$)/)[1].length
            const filename = files[i].name.slice( 0, -ext_count)
            const ext = (files[i].name).split(/(?=\.[^.]+$)/)[1]
            // console.log("insert file name:",filename)
            // 初回ロード
            const uuid = make_random_str()




            // console.log("File path:" , files[i].path )

            if (!store_TRACK_LIST_ALL_INFO.has(filename)) {
                // History機能のJSON処理用に、全てのKeyをストアに保存する処理
                // 新規トラックを要素名配列に保存する。
                let store_track_array = []
                if(store_TRACK_LIST_ALL_INFO.has('TRACKS')){
                    store_track_array = store_TRACK_LIST_ALL_INFO.get('TRACKS')
                    store_track_array.push(filename)
                } else { // 初回起動時
                    store_track_array.push(filename)
                }
                store_TRACK_LIST_ALL_INFO.set('TRACKS',store_track_array)
                // 新規トラック情報を作成していく。
                const blob = URL.createObjectURL(files[i])
                const uuid = make_random_str()
                let audio = new Audio()
                audio.src =  blob
                audio.addEventListener('loadedmetadata', () => {
                    store_TRACK_LIST_ALL_INFO.set(
                        String(filename),
                        {
                            'track_name':filename,
                            'track_time':audio.duration,
                            // 'track_blob':blob,
                            'track_blob':audio.src,
                            'track_favorite': false,
                            'track_count':0,
                            'track_uuid':uuid,
                            'track_mime':files[i].type,
                            'track_play_date':formatDate(new Date()),
                            'track_path':files[i].path,
                            'track_ext': ext,
                        }
                    )
                    const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア
                    loadmeta_count = store_track_view_info.get('loadmeta_count') + 1
                    store_track_view_info.set('loadmeta_count',loadmeta_count)
                    dispatch({
                        type:'push',
                        name: filename,
                        time: hms(audio.duration),
                        count: 0,
                        blob: blob,
                        favorite: false,
                        uuid: uuid,
                        mime:files[i].type,
                        path:files[i].path,
                        ext: ext,
                    })
                    // loadmeta 完了でリロード
                    // loadmeta は非同期に並列して最後に纏まって処理される。
                    const track_info = store_track_view_info.get('tracks')
                    if ( track_info.length === loadmeta_count ) {
                        reload_track_view()
                    }
                })
                track_list_name_only.push( filename )   // 処理が終わったトラック上の名前をストアにして保存する用の配列
                track_list_name_uuid.push( uuid ) //各トラックのUUIDを配列として保存。ソート用に使う.
            // 情報あり
            } else {
                // console.log("Exits!" , filename )
                let track_INFO = store_TRACK_LIST_ALL_INFO.get(filename)
                // let track_INFO_tmp = store_TRACK_LIST_ALL_INFO.get(filename)
                // Array.from(new Set(track_INFO_tmp)) // 配列から重複を排除する
                track_INFO.track_blob = URL.createObjectURL(files[i]) // blob リメイク トラックインフォが存在していたら過去に作ったBlobだから、Javascriptのセキュリティー上再利用不可のため再度作成して保存。
                const uuid = make_random_str()
                track_INFO.track_uuid = uuid
                // Memo トラック情報に追加プロパティする場合、追記する箇所はこの関数内の6つ。
                // Build 1.16.10 -> 1.17.0 用の処理
                if ( !track_INFO.track_path ){
                    // console.log("none track path")
                    track_INFO.track_path = files[i].path
                }
                // Build 1.17.1 -> 1.18.0 用の処理
                if ( !track_INFO.track_ext ){
                    // console.log("none track path")
                    track_INFO.track_ext = ext
                }
                store_TRACK_LIST_ALL_INFO.set(filename,track_INFO)
                const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア
                loadmeta_count = store_track_view_info.get('loadmeta_count') + 1
                store_track_view_info.set('loadmeta_count',loadmeta_count)
                dispatch({
                    type:'push',
                    name:track_INFO.track_name,
                    time:hms(track_INFO.track_time),
                    count:track_INFO.track_count,
                    blob: track_INFO.track_blob,
                    favorite:track_INFO.track_favorite,
                    uuid:track_INFO.track_uuid,
                    mine:track_INFO.track_mime,
                    path:files[i].path,
                    ext: track_INFO.track_ext,

                })
                track_list_name_only.push( filename )   // 処理が終わったトラック上の名前をストアにして保存する用の配列
                track_list_name_uuid.push( track_INFO.track_uuid ) //各トラックのUUIDを配列として保存。ソート用に使う
                // loadmeta 完了でリロード
                const track_info = store_track_view_info.get('tracks')
                if ( track_info.length === loadmeta_count ) {
                    reload_track_view()
                }
            }

            // フォルダパスをプレイフォルダに代入
            // フォルダパスをタイトルに代入
            // path.basename(path.dirname(filename))
            // path.dirname(files[i].path).split(path.sep).pop()
            const parent_path = files[i].path
            // console.log( files[i].path )
            ipcRenderer.invoke('request_playlist_folder_parent_path', parent_path)
            .then(function(parent_path) {
                // プレイフォルダ保存の入力を楽にする処理
                // インポートした親のフォルダ名を取得して、React変数にセット。下位のコンポーネントで使用。
                folderSaveName =  ( parent_path.slice(-2)[0] )
                setParentFolderName(folderSaveName)
                setSavePlayFolderName(folderSaveName)

                // console.log("parent_path:", parent_path)
                // console.log("parent_path2:", parent_path.slice(-2)[0])
                // console.log("folderSaveName:", folderSaveName)
            })
            // console.log("Import End...folderSaveName:" , folderSaveName )
            // for End ...
        }


        // オーディオリストが空ならインポートした最初の曲をセット
        const track_list = store_track_view_info.get('tracks')
        if (track_list.length === 0){
            audio_player.src =  URL.createObjectURL(files[0])
            store_track_view_info.set('playing_uuid',track_list_name_uuid[0])

        }
        // VIEW管理用にトラック名だけの配列を追加
        store_track_view_info.set('tracks',track_list_name_only)
        store_track_view_info.set('uuid',track_list_name_uuid)

        // 使用配列初期化
        track_list_name_only = []
        track_list_name_uuid = []
    }
    ////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////
    //
    // 小さな関数群
    //
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    // sをh:mm:ss にする関数
    function hms (tt) {
        let hms = ''
        let t = Math.floor(tt)
        const h = t / 3600 | 0
        const m = t % 3660 / 60 | 0
        const s = t % 60
        const z2 = (v) => {
            const s = '00' + v
            return s.substr(s.length - 2, 2)
        }
        if ( h != 0 ) {
            hms = h + ':' + z2(m) + ':' + z2(s)
        } else if ( m != 0 ) {
            hms = z2(m) + ':' + z2(s)
        } else {
            hms = '00:' + z2(s)
        }
        return hms
    }
    ////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////
    // お気に入りON/OFF管理関数
    function favorite_onoff(name) {
        // console.log('favorite_onoff',name)
        //引数の名前から該当する全情報ストアのトラックのお気に入りを反転させる処理
        let track_INFO = store_TRACK_LIST_ALL_INFO.get(name)
        track_INFO.track_favorite = !track_INFO.track_favorite
        store_TRACK_LIST_ALL_INFO.set(name,track_INFO)
        // その後リロード
        reload_track_view()
        // console.log('TRACK_INFO',track_INFO)
        // console.log(items)
    }
    ////////////////////////////////////////////////////////////////
    // トラックをクリックで再生用に使用
    const set_now_blob = (name) => {
        // console.log('set_now_blob:',name)
        let track_INFO = store_TRACK_LIST_ALL_INFO.get(name)
        audio_player.src = track_INFO.track_blob
    }
    ////////////////////////////////////////////////////////////////
    // TrackView リロード関数
    const reload_track_view = () => {
        const save_tracks = store_track_view_info.get('tracks')
        dispatch({ type:'reload' }) // 設定を初期化せずにレコード情報をクリア
        for (let i=0;i<save_tracks.length;i++) {
            let track_INFO = store_TRACK_LIST_ALL_INFO.get(save_tracks[i])
            dispatch({
                type:'push',
                name: save_tracks[i],
                time: hms(track_INFO.track_time),
                count: track_INFO.track_count,
                blob: track_INFO.track_blob,
                favorite: track_INFO.track_favorite,
                uuid: make_random_str(),
                mime: track_INFO.track_mime,
                path: track_INFO.track_path,
                ext: track_INFO.track_ext,
            })
        }
    }
    ////////////////////////////////////////////////////////////////
    // テーブルソート関数
    function sort_a_b_toUpper(str, array_name){
        if(array_name === "track_favorite"){
            return str.favorite
        }
        if(array_name === "track_name"){
            return str.name.toUpperCase()
        }
        if(array_name === "track_count"){
            return str.count
        }
        if(array_name === "track_time"){ // ここはHistory.jsx と違う
            const time_to_string = (str.time.replace(':','') )
            // console.log(time_to_string)
            return str.time
        }
        return 0
    }
    ////////////////////////////////////////////////////////////////
    // テーブルソート関数
    function sort_array_and_save(array){
        // console.log("State Check:",array)
        // ソートした配列から名前だけ抜き出してTRACKSに保存
        const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア
        let save_array = []
        let save_uuid = []
        for (let i=0; i<array.length; i++ ) {
            save_array.push(array[i].name)
            save_uuid.push(array[i].uuid)
        }
        // console.log(save_array)
        // playing_uuid で一致するUUIDをCurrent_id として保存.
        const playing_uuid = store_track_view_info.get('playing_uuid')
        const uuid = store_track_view_info.get('uuid')
        for(let i=0; i<uuid.length; i++){
            if(uuid[i] === playing_uuid){
                store_track_view_info.set('current_id',i)
            }
        }

        store_track_view_info.set('tracks', save_array )
        store_track_view_info.set('uuid', save_uuid )

        return array
    }
    ////////////////////////////////////////////////////////////////
    //
    // テーブルセル上下入れ替え関数群
    //
    //
    ////////////////////////////////////////////////////////////////
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
        const track_uuid = store_track_view_info.get('uuid')
        const playing_uuid = store_track_view_info.get('playing_uuid')
        for ( let i=0; i<track_uuid.length; i++) {
            if ( track_uuid[i] === playing_uuid) {
                store_track_view_info.set('current_id',i)
            }
        }
    }
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    //
    // 翻訳コード
    //
    const [t_01, setT_01 ] = useState("")
    const [t_02, setT_02 ] = useState("")
    const [t_03, setT_03 ] = useState("")
    const [t_04, setT_04 ] = useState("")
    const [t_05, setT_05 ] = useState("")
    const [t_06, setT_06 ] = useState("")
    const [t_07, setT_07 ] = useState("")
    const [t_08, setT_08 ] = useState("")
    const [t_09, setT_09 ] = useState("")
    const [t_10, setT_10 ] = useState("")
    const [t_11, setT_11 ] = useState("")
    useEffect(()=>{
        const text_01 = Languages("OpenMedia")
        const text_02 = Languages("Clear")
        const text_03 = Languages("Reload")
        const text_04 = Languages("DnD_Here")
        const text_05 = Languages("Title")
        const text_06 = Languages("PlaybackTime")
        const text_07 = Languages("Count")
        const text_08 = Languages("Favorite")
        const text_09 = Languages("Delete")
        const text_10 = Languages("MakePF")
        const text_11 = Languages("LoadPF")
        setT_01(text_01)
        setT_02(text_02)
        setT_03(text_03)
        setT_04(text_04)
        setT_05(text_05)
        setT_06(text_06)
        setT_07(text_07)
        setT_08(text_08)
        setT_09(text_09)
        setT_10(text_10)
        setT_11(text_11)
    })
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////

    function sort(key_name) {
        if(( key_name === "track_favorite" ) && (props.modePlayer)){
            // console.log("TV:Func Sorted:track_favorite")
            if(sortFlagFavo){
                dispatch({ type:'reverse', items:items , key_name:"track_favorite" })
                setSortFlagFavo(false)
            }else{
                dispatch({ type:'sort', items:items, key_name:"track_favorite"  })
                setSortFlagFavo(true)
            }
        }
        if(( key_name === "track_name" ) && (props.modePlayer)){
            // console.log("TV:Func Sorted:key_name")
            if(sortFlagTitle){
                dispatch({ type:'reverse', items:items , key_name:"track_name" })
                setSortFlagTitle(false)
            }else{
                dispatch({ type:'sort', items:items, key_name:"track_name"  })
                setSortFlagTitle(true)
            }
        }
        if(( key_name === "track_time" ) && (props.modePlayer)){
            // console.log("TV:Func Sorted:track_time")
            if(sortFlagTime){
                dispatch({ type:'reverse', items:items , key_name:"track_time" })
                setSortFlagTime(false)
            }else{
                dispatch({ type:'sort', items:items, key_name:"track_time"  })
                setSortFlagTime(true)
            }
        }
        if(( key_name === "track_count" ) && (props.modePlayer)){
            // console.log("TV:Func Sorted:track_count")
            if(sortFlagCount){
                dispatch({ type:'reverse', items:items , key_name:"track_count" })
                setSortFlagCount(false)
            }else{
                dispatch({ type:'sort', items:items, key_name:"track_count"  })
                setSortFlagCount(true)
            }
        }
    }
    ////////////////////////////////////////////////////////////////
    // テーブルソート管理React変数群
    const [ sortFlagFavo, setSortFlagFavo ] = useState(false)
    const [ sortFlagTitle, setSortFlagTitle ] = useState(false)
    const [ sortFlagTime, setSortFlagTime ] = useState(false)
    const [ sortFlagCount, setSortFlagCount ] = useState(false)
    //
    // Shortcut Key
    //
    useHotkeys('BackSpace', useCallback(() => dispatch({ type: "clear" })), [])
    useHotkeys('shift + r', useCallback(() => reload_track_view()), [])
    useHotkeys('shift + 1', useCallback(() => sort("track_favorite")), [sortFlagFavo,props.modePlayer])
    useHotkeys('shift + 2', useCallback(() => sort("track_name")), [sortFlagTitle,props.modePlayer])
    useHotkeys('shift + 3', useCallback(() => sort("track_time")), [sortFlagTime,props.modePlayer])
    useHotkeys('shift + 4', useCallback(() => sort("track_count")), [sortFlagCount,props.modePlayer])
    useHotkeys('shift + q', useCallback(() => { setMakePlayListFlag(false) } ))
    useHotkeys('shift + w', useCallback(() => { setMakePlayListFlag(true) } ))
    useHotkeys('shift + e', useCallback(() => sc_Open_playfolder()), [])
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    //
    // PlayList React変数群
    //
    ////////////////////////////////////////////////////////////////

    const [ makePlayListFlag, setMakePlayListFlag ] = useState(false)
    const [ parentFolderName, setParentFolderName ] = useState("")
    const [ savePlayFolderName , setSavePlayFolderName ] = useState("")
    const [ playlistFolders , setPlayListsFolders ] = useState([])
    const ITEM_HEIGHT = 48
    const [anchorEl, setAnchorEl] = useState(false)
    // const open_playlist = Boolean(anchorEl)
    const open_save_playlist_func = () => {
        setMakePlayListFlag(true)
    }

    // Warning: ForwardRef(Menu) anchorEl
    const sc_Open_playfolder = () => {
        const store_PLAYLISTS_INFO = new Store({name: 'playlists'})   // トラックリスト全体情報ストア
        const folders = store_PLAYLISTS_INFO.get('PLAYLISTS')
        setPlayListsFolders(folders)
        setAnchorEl(true)
    }

    const handleClick_playlist = (event) => {
        // 呼び出したらプレイリストReact変数を更新する。
        // プレイリストフォルダのフォルダ一覧取得
        // ユーザーがフォルダを削除した場合に備えて、重複するけどSavePlaylist.jsxと同じ処理をここでもする。
        const dir = String(props.playFolderPath)
        const store_PLAYLISTS_INFO = new Store({name: 'playlists'})   // トラックリスト全体情報ストア
        const allDirents = fs.readdirSync( dir, { withFileTypes: true })
        const folders = allDirents.filter(dirent => dirent.isDirectory()).map(({ name }) => name)
        store_PLAYLISTS_INFO.set('PLAYLISTS',folders)
        setPlayListsFolders(folders)
        // Menu Open
        setAnchorEl(event.currentTarget)
        // clickPlayFolder
    }
    const handleClose = () => {
        setAnchorEl(false)
    }

    // 保存したプレイリストをクリックすると対象フォルダを開いて表示する関数
    const clickPlayFolder = (option) => {
        // console.log("Clicked:",option )
        const dir = props.playFolderPath+"/"+option
        // console.log(dir)
        setAnchorEl(false)
        ipcRenderer.send('request_playlists_folder_open', dir)
    }


    ////////////////////////////////////////////////////////////////

    return (
        <>
        {props.modePlayer
            ?<>
            <div id="dnd" className={TV.wrap}>


                <div id="dnd_tools">

                    <div className={TV.dnd_tools_container}>

                        {
                        (makePlayListFlag)
                        ?<>
                            <SavePlaylist
                                setMakePlayListFlag={setMakePlayListFlag}
                                items={items}
                                setReloadRequest={props.setReloadRequest} // 移動して作成用
                                playFolderPath={props.playFolderPath}
                                setPlayFolderPath={props.setPlayFolderPath}
                                setVideooCFlag={props.setVideooCFlag}
                                parentFolderName={parentFolderName}
                                setPlayListsFolders={setPlayListsFolders}
                                savePlayFolderName={savePlayFolderName}
                                setSavePlayFolderName={setSavePlayFolderName}
                            />
                        </>

                        :
                        <Tooltip title={t_10+" (shift + w)"}>
                            <Button>
                                <PlaylistAddIcon fontSize="small" onClick={open_save_playlist_func} />
                            </Button>
                        </Tooltip>

                        }
                        <Tooltip title={t_11+" (shift + e)"}>
                            <Button
                                // aria-haspopup="true"
                                onClick={handleClick_playlist}
                            >
                                <PlaylistPlayIcon />
                            </Button>
                        </Tooltip>

                            <Menu
                                id="playfolder_lists"
                                autoFocus={false}
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                PaperProps={{
                                    style: {
                                    maxHeight: ITEM_HEIGHT * 12,
                                    width: '480px',
                                    },
                                }}
                            >
                                {playlistFolders.map((option) => (
                                    <MenuItem
                                        key={option}
                                        // selected={option === 'Pyxis'}
                                        onClick={
                                        // こうやって一旦スコープしないと永遠に実行され続ける。
                                            ()=>{
                                                clickPlayFolder(option)
                                            }
                                        }
                                    >
                                        {option}
                                    </MenuItem>
                                ))}
                            </Menu>


                        {!dndMiniFlag
                            ?<Tooltip title={t_01}>
                                <Button onClick={open} size="small">
                                    <PlayForWorkIcon fontSize="small"/>
                                </Button>
                            </Tooltip>
                            :null
                        }

                        <DnDMinimam dndMiniFlag={dndMiniFlag} setDnDMiniFlag={setDnDMiniFlag}/>

                        <Tooltip title={t_02+" (BackSpace)"}>
                            <Button onClick={
                                () =>  {
                                    setMakePlayListFlag(false)
                                    setParentFolderName("")
                                    dispatch({ type: "clear" })
                                }}
                                size="small">
                                <ClearIcon fontSize="small"/>
                            </Button>
                        </Tooltip>
                    </div>



                </div>




                {/* <p>ここにメディアをドラッグ＆ドロップします</p> */}
                <div id="dnd_area">
                    <Box className={TV.dndbox} {...getRootProps()}  border={border}>
                        <input {...getInputProps()} />
                        <p>{t_04}</p>
                        <Tooltip title={t_01}>
                            <div　className={TV.open_area} onClick={open}>
                                <PlayForWorkIcon  className={TV.open_icon} fontSize="small"/>
                                <span>{t_01}</span>
                            </div>
                        </Tooltip>
                    </Box>
                </div>
            </div>




            <div id="table_view" className={TV.table}>

                <div className={TV.table_row_head}>

                <Tooltip title={t_08 + " (shift + 1)"} placement="bottom-start">
                    <div className={TV.table_cell_head_favo}>
                        {sortFlagFavo
                        ?<StarIcon className={TV.icon_des}  fontSize="small" onClick={
                                ()=>{
                                    dispatch({ type:'reverse', items:items, key_name:"track_favorite"  })
                                    setSortFlagFavo(false)
                                }
                        } />
                        :<StarIcon className={TV.icon_des}  fontSize="small" onClick={
                            () => {
                                dispatch({ type:'sort', items:items, key_name:"track_favorite"  })
                                setSortFlagFavo(true)
                            }
                        } />
                        }
                    </div>
                </Tooltip>

                    <div className={TV.table_cell_head_ez}></div>


                    <Tooltip title={t_05+ " (shift + 2)"} placement="bottom-start">
                        <div className={TV.table_cell_head_title}
                            onClick={
                                sortFlagTitle
                                ?()=>{
                                    dispatch({ type:'reverse', items:items , key_name:"track_name" })
                                    setSortFlagTitle(false)
                                }
                                :()=>{
                                    dispatch({ type:'sort', items:items, key_name:"track_name"  })
                                    setSortFlagTitle(true)
                                }
                            }
                        >
                        <div className={TV.text_abridgement}>{t_05}</div>
                        {sortFlagTitle
                            ?<SortIcon className={TV.icon_ace}  fontSize="small"  />
                            :<SortIcon className={TV.icon_des}  fontSize="small"  />
                        }
                        </div>
                    </Tooltip>

                    <Tooltip title={t_06+ " (shift + 3)"} placement="bottom-start">
                        <div className={TV.table_cell_head_time}
                            onClick={
                                sortFlagTime
                                ?()=>{
                                    dispatch({ type:'reverse', items:items , key_name:"track_time" })
                                    setSortFlagTime(false)
                                }
                                :()=>{
                                    dispatch({ type:'sort', items:items , key_name:"track_time" })
                                    setSortFlagTime(true)
                                }
                            }
                        >
                            <div className={TV.text_abridgement}>{t_06}</div>
                                {sortFlagTime
                                    ?<SortIcon className={TV.icon_ace}  fontSize="small" />
                                    :<SortIcon className={TV.icon_des}  fontSize="small" />
                                }
                        </div>
                    </Tooltip>

                    <Tooltip title={t_07+ " (shift + 4)"} placement="bottom-start">
                        <div className={TV.table_cell_head_count}
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
                        <div className={TV.text_abridgement}>{t_07}</div>
                            {sortFlagCount
                                ?<SortIcon className={TV.icon_ace}  fontSize="small" />
                                :<SortIcon className={TV.icon_des}  fontSize="small" />
                            }
                        </div>
                    </Tooltip>

                    <div className={TV.table_cell_head_del}>
                        <DeleteIcon fontSize="small"/>
                    </div>

                </div>
                {/* End: table_row_head */}


                <Container lockAxis="y" onDrop={onDrop}>
                    {items.map((item,index) => (
                    <Draggable key={item.uuid} className={TV.a}>


                        <div className={TV.a}
                            onDoubleClick={
                                ()=> {
                                    set_now_blob(item.name) // 選択トラックのBlobを作成
                                    store_track_view_info.set('current_id',index)
                                    props.setPlayRequest(true) // 再生フラグをセット
                                    // console.log(index,item.name)
                                }
                            }
                        >


                            <div className={TV.b}>
                                <Button size="small"
                                    aria-label="favorite_btn"
                                    onClick={
                                        ()=>{
                                            favorite_onoff(item.name)
                                        }
                                    }
                                >{ (item.favorite)
                                    ?<StarIcon fontSize="small"/>
                                    :<StarBorderIcon fontSize="small"/>
                                }</Button>
                            </div>


                            <div className={TV.c}>
                                <AudioEffect
                                    index={index}
                                    nowPlaying={props.nowPlaying}
                                    setPlayRequest={props.setPlayRequest}
                                />
                            </div>


                            <div className={TV.d}>{item.name}</div>
                            <div className={TV.e}>{item.time}</div>
                            <div className={TV.f}>{item.count}</div>
                            <Tooltip title={t_09}>
                                <div className={TV.g}>
                                        <Button size="small"
                                            edge="end"
                                            aria-label="delete"
                                            onClick={
                                                ()=> {
                                                    dispatch({ type:'remove', index })
                                                }
                                            }
                                        ><DeleteIcon fontSize="small"/>
                                        </Button>
                                </div>
                            </Tooltip>
                        </div>
                        {/* End:className={TV.a} */}
                    </Draggable>
                    ))}
                </Container>
            </div>
            {/* End:className={TV.table} */}
        </>
        :null}
    </>
    )
}

export default TrackViewController;

