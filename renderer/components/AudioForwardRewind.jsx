
//React
import  { useEffect , useState  , useCallback } from 'react';
// ライブラリ
// import Store from 'electron-store';
import { useHotkeys } from 'react-hotkeys-hook';
//スタイル群
//コンポーネント
import Languages from '../components/Languages';
//マテリアルUI
// import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
//マテリアルUI Icon
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';


    const AudioForwardRewind = (props) => {


    // 時間操作可能管理フラグ
    const [ onLoad , setOnLoad ] = useState(false)
    useEffect(()=>{
        audio_player.addEventListener('loadedmetadata', () => {
            setOnLoad(true)
        })
        if(audio_player.currentTime > 0){
            setOnLoad(true)
        }
    },[onLoad])

    // Option 設定ファイル群
    //
    const control_track_replay_large = () => {
        const current_time_s = audio_player.currentTime
        if ( ( onLoad ) && ( current_time_s - props.LR > 0 ) ) {
            audio_player.currentTime = current_time_s - props.LR
        } else if ( ( onLoad ) && ( current_time_s - props.LR < 0 ) ) {
            audio_player.currentTime = 0
        }
        // console.log("props.LR",props.LR)
    }
    const control_track_replay_small = () => {
        const current_time_s = audio_player.currentTime
        if ( ( onLoad ) && ( current_time_s - props.SR > 0 ) ) {
            audio_player.currentTime = current_time_s - props.SR
        } else if ( ( onLoad ) && ( current_time_s - props.SR < 0 ) ) {
            audio_player.currentTime = 0
        }
        // console.log("control_track_replay_small::")
        // console.log("props.SR",props.SR)

    }
    const control_track_forward_small = () => {
        const current_time_s = audio_player.currentTime
        const duration_time_s  = audio_player.duration
        if ( ( onLoad ) && ( current_time_s + props.SF < duration_time_s ) ) {
            audio_player.currentTime = current_time_s + props.SF
        }
        // console.log("control_track_forward_small::")
        // console.log("props.SF",props.SF)

    }
    const control_track_forward_large = () => {
        const current_time_s = audio_player.currentTime
        const duration_time_s  = audio_player.duration
        if ( ( onLoad ) && ( current_time_s + props.LF < duration_time_s ) ) {
            audio_player.currentTime = current_time_s + props.LF
        }
        // console.log("control_track_forward_large::")
        // console.log("props.LF",props.LF)

    }
    //
    // 翻訳コード
    //
    const [t_Rewind, setT_Rewind ] = useState("")
    const [t_Forward, setT_Forward] = useState("")
    useEffect(()=>{
        const text_01 = Languages("Rewind")
        const text_02 = Languages("Forward")
        setT_Rewind(text_01)
        setT_Forward(text_02)
        // console.log(text_01,text_02)
    })


    //
    // Shortcut Key
    //
    useHotkeys('z', useCallback(() => control_track_replay_large()), [props.LR,onLoad])
    useHotkeys('x', useCallback(() => control_track_replay_small()), [props.SR,onLoad])
    useHotkeys('c', useCallback(() => control_track_forward_small()),[props.SF,onLoad])
    useHotkeys('v', useCallback(() => control_track_forward_large()),[props.LF,onLoad])



    return (
        <>
        <Tooltip title={t_Rewind+" (z)"}><Button onClick={ control_track_replay_large }><ChevronLeftIcon />{props.LR}</Button></Tooltip>
        <Tooltip title={t_Rewind+" (x)"}><Button onClick={ control_track_replay_small }><ArrowLeftIcon />{props.SR}</Button></Tooltip>
        <Tooltip title={t_Forward+" (c)"}><Button onClick={ control_track_forward_small }><ArrowRightIcon />{props.SF}</Button></Tooltip>
        <Tooltip title={t_Forward+" (v)"}><Button onClick={ control_track_forward_large }><ChevronRightIcon />{props.LF}</Button></Tooltip>
        </>
    )
}
export default AudioForwardRewind;


