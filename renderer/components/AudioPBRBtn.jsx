// React
import { useState, useEffect , useCallback } from 'react';
// ライブラリ
import Store from 'electron-store';
import { useHotkeys } from 'react-hotkeys-hook';
//スタイル
import PBR from '../style/pbr.module.css';
// コンポーネント群
import Languages from '../components/Languages';
// マテリアルUI
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
// マテリアルUI Icons
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import TimelapseIcon from '@material-ui/icons/Timelapse';

const AudioPBRBtn = (props) => {
    const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア

    const loadConfig = () => {
        props.setPBR_set_1(store_audio_control.get('pbr_set_1'))
        props.setPBR_set_2(store_audio_control.get('pbr_set_2'))
    }
    useEffect(()=>{
        loadConfig() // 遅延実行で設定情報を読み込み
    },[])

    //
    // 設定した再生速度にクリックで移動関数
    //
    const pbr_set_1 = () => {
        props.setPbrSliderValue(props.pbr_set_1)
        props.setPBRate(props.pbr_set_1)
        audio_player.playbackRate = props.pbr_set_1
    }
    const pbr_set_2 = () => {
        props.setPbrSliderValue(props.pbr_set_2)
        props.setPBRate(props.pbr_set_2)
        audio_player.playbackRate = props.pbr_set_2
    }
    //
    // シークバー右送り左送り機能関数
    //
    const control_seekbar_rewind = () => {
        if( props.pb_Rate - props.pbr_step >= props.pbr_min ){
            let math = (props.pb_Rate - props.pbr_step)
            math = math.toFixed(1)
            props.setPBRate(math)
            props.setPbrSliderValue(math)
            // console.log(math)
        }
    }
    const control_seekbar_forward = () => {
        if(  Number(props.pb_Rate) + Number(props.pbr_step) <= props.pbr_max ){
            let math = Number(props.pb_Rate) + Number(props.pbr_step)
            math = math.toFixed(1)
            props.setPBRate(math)
            props.setPbrSliderValue(math)
            // console.log(math)
        }
    }

    //
    // 翻訳コード
    //
    const [t_01, setT_01 ] = useState("")
    const [t_02, setT_02 ] = useState("")
    const [t_03, setT_03 ] = useState("")
    const [t_04, setT_04 ] = useState("")
    useEffect(()=>{
        const text_01 = Languages("PBR_Reduce")
        const text_02 = Languages("PBR_Set_1")
        const text_03 = Languages("PBR_Set_2")
        const text_04 = Languages("PBR_Add")
        setT_01(text_01)
        setT_02(text_02)
        setT_03(text_03)
        setT_04(text_04)
    })

    //
    // Shortcut Key
    //
    useHotkeys('g', useCallback(() => pbr_set_1()), [ props.pbr_set_1 ])
    useHotkeys('h', useCallback(() => pbr_set_2()), [ props.pbr_set_2])
    useHotkeys('d', useCallback(() => control_seekbar_rewind()), [ props.pb_Rate , props.pbr_step , props.pbr_min ])
    useHotkeys('f', useCallback(() => control_seekbar_forward()), [ props.pb_Rate , props.pbr_step , props.pbr_max ])





    return (
        <>
        <Tooltip title={t_01+" (d)"}><Button onClick={control_seekbar_rewind}><FastRewindIcon /></Button></Tooltip>
        <Tooltip title={t_04+" (f)"}><Button onClick={control_seekbar_forward}><FastForwardIcon /></Button></Tooltip>
        <Tooltip title={t_02+" (g)"}><Button onClick={pbr_set_1}><TimelapseIcon className={PBR.save_icon}/> {props.pbr_set_1}</Button></Tooltip>
        <Tooltip title={t_03+" (h)"}><Button onClick={pbr_set_2}><TimelapseIcon className={PBR.save_icon}/> {props.pbr_set_2}</Button></Tooltip>
        </>
    )
}



export default AudioPBRBtn;


// &#8854;
// &oplus;