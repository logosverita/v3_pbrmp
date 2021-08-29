// React
import { useState, useEffect , useCallback} from 'react'
// ライブラリ
import Store from 'electron-store';
import { useHotkeys } from 'react-hotkeys-hook';
//スタイル群
// コンポーネント群
import Languages from '../components/Languages';
// マテリアルUI
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
//マテリアルUI Icon
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';



const AudioNextPrevious = (props) => {

    const audio_next = () => {
        const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア
        let track_name = store_track_view_info.get('tracks')
        let current_track_id = store_track_view_info.get('current_id')
        if((track_name.length > 0) && (Number(current_track_id) < track_name.length -1)){
            current_track_id = current_track_id + 1
            store_track_view_info.set('current_id',current_track_id)
            audio_player.pause()
            load_track_blob()
            props.setPlayRequest(true)
        }
    }

    const audio_previous = () => {
        const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア
        let track_name = store_track_view_info.get('tracks')
        let current_track_id = store_track_view_info.get('current_id')
        if ((track_name.length > 0) && (current_track_id > 0)){
            current_track_id = current_track_id - 1
            store_track_view_info.set('current_id',current_track_id)
            audio_player.pause()
            load_track_blob()
            props.setPlayRequest(true)
        }
    }

    const load_track_blob = () => {
        const store_TRACK_LIST_ALL_INFO = new Store({name: 'tracklist_all_info'})   // トラックリスト全体情報ストア
        const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア
        const track_info = store_track_view_info.get('tracks')
        const current_track_id = store_track_view_info.get('current_id')
        const track_name = track_info[current_track_id]
        const track_INFO = store_TRACK_LIST_ALL_INFO.get(track_name)
        audio_player.src = track_INFO.track_blob
    }


    //
    // 翻訳コード
    //
    const [t_01, setT_01 ] = useState("")
    const [t_02, setT_02 ] = useState("")
    useEffect(()=>{
        const text_01 = Languages("Previous")
        const text_02 = Languages("Next")
        setT_01(text_01)
        setT_02(text_02)
    })

    //
    // Shortcut Key
    //
    useHotkeys('a', useCallback(() => audio_previous()), [] )
    useHotkeys('s', useCallback(() => audio_next()), [] )


    return (
        <>
            <Tooltip title={t_01+" (a)"}><Button onClick={ audio_previous }><SkipPreviousIcon /></Button></Tooltip>
            <Tooltip title={t_02+" (s)"}><Button onClick={ audio_next }><SkipNextIcon /></Button></Tooltip>
        </>
    )
}

export default AudioNextPrevious;
