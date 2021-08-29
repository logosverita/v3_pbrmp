//React
import React, { useReducer, useCallback ,useEffect } from 'react';
// ライブラリ
import Store from 'electron-store';
import { useDropzone } from 'react-dropzone'
//スタイル群
//コンポーネント
import Languages from '../components/Languages';
//マテリアルUI
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
//マテリアルUI ICONs
import PlayForWorkIcon from '@material-ui/icons/PlayForWork';

const MediaDropOpen = () => {


    const store_TRACK_LIST_ALL_INFO = new Store({name: 'tracklist_all_info'})   // トラックリスト全体情報ストア
    const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア
    const make_random_str = () => { return Math.random().toString(32).substring(2) } // 更新管理用ランダム数列作成関数
    let track_list_name_only = []   // VIEW管理用にトラック名だけの配列を追加 // 処理が終わったトラック上の名前をストアにして保存する用の配列
    let track_list_name_uuid = []

    //
    // useReducer　TrackView管理機能群
    //
    const [items, dispatch] = useReducer((state, action) => {
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
                    }
                ]
            case "reload": // 設定を初期化せずにレコード情報をクリア
                return []
            default:
                return state
        }
        }, [])

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
                })
            }
        }
    //
    // useDropZone　DnD管理機能群
    //
    const onDropRejected = useCallback(files => { console.log('rejected files')}, [])
    const onDropAccepted = useCallback(files => {
        // console.log("drop zone make track info")
        make_track_info(files)
        reload_track_view()
    }, [])
    const { getRootProps ,getInputProps, open } = useDropzone({
        accept: 'video/*, audio/*',
        noClick: true,
        onDropAccepted,
        onDropRejected,
    })




    // DnDしたファイル情報管理関数
    function make_track_info(files){
        track_list_name_only = store_track_view_info.get('tracks')
        track_list_name_uuid = store_track_view_info.get('uuid')
        for (let i=0; files.length>i; i++) {
            const filename = files[i].name.split("/").reverse()[0].split('.')[0]
            // 初回ロード
            if (!store_TRACK_LIST_ALL_INFO.has(filename)) {
                const blob = URL.createObjectURL(files[i])
                const uuid = make_random_str()
                let audio = new Audio()
                audio.src =  blob
                audio.addEventListener('loadedmetadata', () => {
                    store_TRACK_LIST_ALL_INFO.set(
                        filename,
                        {
                            'track_name':filename,
                            'track_time':audio.duration,
                            'track_blob': blob,
                            'track_favorite': false,
                            'track_count':0,
                            'track_uuid':uuid,
                            'track_mime':files[i].type
                        }
                    )
                    dispatch({
                        type:'push',
                        name: filename,
                        time: hms(audio.duration),
                        count: 0,
                        blob: blob,
                        favorite: false,
                        uuid: uuid,
                        mime:files[i].type,
                    })
                })
                track_list_name_only.push( filename )   // 処理が終わったトラック上の名前をストアにして保存する用の配列
                track_list_name_uuid.push( uuid ) //各トラックのUUIDを配列として保存。ソート用に使う
            // 情報あり
            } else {
                let track_INFO = store_TRACK_LIST_ALL_INFO.get(filename)
                track_INFO.track_blob = URL.createObjectURL(files[i]) // blob リメイク トラックインフォが存在していたら過去に作ったBlobだから、Javascriptのセキュリティー上再利用不可のため再度作成して保存。
                const uuid = make_random_str()
                track_INFO.track_uuid = uuid
                store_TRACK_LIST_ALL_INFO.set(filename,track_INFO)
                dispatch({
                    type:'push',
                    name:track_INFO.track_name,
                    time:hms(track_INFO.track_time),
                    count:track_INFO.track_count,
                    blob: track_INFO.track_blob,
                    favorite:track_INFO.track_favorite,
                    uuid:track_INFO.track_uuid,
                    mine:track_INFO.track_mime,
                })
                track_list_name_only.push( filename )   // 処理が終わったトラック上の名前をストアにして保存する用の配列
                track_list_name_uuid.push( track_INFO.track_uuid　) //各トラックのUUIDを配列として保存。ソート用に使う
            }
        }
        // オーディオが停止中ならインポートした最初の曲をセット
        if (audio_player.paused){
            audio_player.src =  URL.createObjectURL(files[0])
        }
        // VIEW管理用にトラック名だけの配列を追加
        store_track_view_info.set('tracks',track_list_name_only)
        store_track_view_info.set('uuid',track_list_name_uuid)
        track_list_name_only = []
        track_list_name_uuid = []
    }


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


    //
    // 翻訳コード
    //
    const [t_01, setT_01 ] = useState("")
    useEffect(()=>{
        const text_01 = Languages("OpenMedia")
        setT_01(text_01)
    })




    return (
        <>
        <div id="x" >
            <div {...getRootProps()}>
            <input {...getInputProps()} />
                <Tooltip title={t_01}>
                    <Button
                        onClick={open}
                        size="small"
                    >
                        <PlayForWorkIcon fontSize="small"/>
                    </Button>
                </Tooltip>
            </div>
        </div>
        </>
    )
}

export default MediaDropOpen;

