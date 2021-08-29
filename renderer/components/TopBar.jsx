
//React
import { useState, useEffect , useCallback } from 'react'
// ライブラリ
import Store from 'electron-store';
import { useHotkeys } from 'react-hotkeys-hook';
//スタイル
import OP from '../style/option.module.css';
//コンポーネント
import Languages from '../components/Languages';
//マテリアルUI
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
//マテリアルUI ICONs
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import TimelineIcon from '@material-ui/icons/Timeline';
import SettingsIcon from '@material-ui/icons/Settings';



const TopBar = (props) => {

    const mode_change_p = () => {
        // console.log("Mode Chage player")
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        store_audio_control.set('MODE',"PLAY")
        props.setModePlayer(true)
        props.setModeHistory(false)
        props.setModeSetting(false)

    }
    const mode_change_h = () => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        store_audio_control.set('MODE',"HISTORY")
        props.setModePlayer(false)
        props.setModeHistory(true)
        props.setModeSetting(false)

    }
    const mode_change_s = () => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        store_audio_control.set('MODE',"SETTING")
        props.setModePlayer(false)
        props.setModeHistory(false)
        props.setModeSetting(true)

    }


    //
    // 翻訳コード
    //
    const [t_01, setT_01 ] = useState("")
    const [t_02, setT_02 ] = useState("")
    const [t_03, setT_03 ] = useState("")
    useEffect(()=>{
        const text_01 = Languages("MediaPlayer")
        const text_02 = Languages("History")
        const text_03 = Languages("Setting")
        setT_01(text_01)
        setT_02(text_02)
        setT_03(text_03)
    })

    //
    // Shortcut Key
    //
    useHotkeys('1', useCallback(() => mode_change_p()), [])
    useHotkeys('2', useCallback(() => mode_change_h()), [])
    useHotkeys('3', useCallback(() => mode_change_s()), [])


    return (
        <>
        <div className={OP.wrap}>

            <div className={OP.right}>
                <Tooltip title={t_01+" (1)"}><IconButton size="small" onClick={mode_change_p} ><QueueMusicIcon  className={OP.icon} fontSize="small" /></IconButton></Tooltip>
                <Tooltip title={t_02+" (2)"}><IconButton size="small" onClick={mode_change_h} ><TimelineIcon    className={OP.icon} fontSize="small" /></IconButton></Tooltip>
                <Tooltip title={t_03+" (3)"}><IconButton size="small" onClick={mode_change_s} ><SettingsIcon    className={OP.icon} fontSize="small" /></IconButton></Tooltip>
            </div>
        </div>
        </>
    )
}

export default TopBar


