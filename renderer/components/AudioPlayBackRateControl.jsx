// React
import { useState, useEffect , useCallback } from 'react';
// ライブラリ
// import Store from 'electron-store';
import { useHotkeys } from 'react-hotkeys-hook';
//スタイル
import PBR from '../style/pbr.module.css';
// コンポーネント群
import Languages from '../components/Languages';
// マテリアルUI
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
// マテリアルUI Icons
import SpeedIcon from '@material-ui/icons/Speed';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';



const AudioPlayBackRateControl = (props) => {

    const handleSliderChange = (event, pb_Rate) => {
        props.setPbrSliderValue(pb_Rate)
        props.setPBRate( pb_Rate.toFixed(1) )
        audio_player.playbackRate = pb_Rate
    }
    const resetPBR = () => {
        props.setPBRate( props.pbr_default )
        props.setPbrSliderValue(props.pbr_default)
        audio_player.playbackRate = props.pbr_default
    }
    const setPBR_01 = () => {
        props.setPBRate( 1.0 )
        props.setPbrSliderValue( 1.0)
        audio_player.playbackRate = 1.0
    }
    const setPBR_02 = () => {
        props.setPBRate( 2.0 )
        props.setPbrSliderValue( 2.0)
        audio_player.playbackRate = 2.0
    }
    const setPBR_03 = () => {
        props.setPBRate( 3.0 )
        props.setPbrSliderValue( 3.0)
        audio_player.playbackRate = 3.0
    }
    const setPBR_04 = () => {
        props.setPBRate( 4.0 )
        props.setPbrSliderValue( 4.0)
        audio_player.playbackRate = 4.0
    }
    const setPBR_05 = () => {
        props.setPBRate( 5.0 )
        props.setPbrSliderValue( 5.0)
        audio_player.playbackRate = 5.0
    }
    const setPBR_06 = () => {
        props.setPBRate( 6.0 )
        props.setPbrSliderValue( 6.0)
        audio_player.playbackRate = 6.0
    }
    const setPBR_07 = () => {
        props.setPBRate( 7.0 )
        props.setPbrSliderValue( 7.0)
        audio_player.playbackRate = 7.0
    }
    const setPBR_08 = () => {
        props.setPBRate( 8.0 )
        props.setPbrSliderValue( 8.0)
        audio_player.playbackRate = 8.0
    }
    const setPBR_09 = () => {
        props.setPBRate( 9.0 )
        props.setPbrSliderValue( 9.0)
        audio_player.playbackRate = 9.0
    }
    const setPBR_10 = () => {
        props.setPBRate( 10.0 )
        props.setPbrSliderValue( 10.0)
        audio_player.playbackRate = 10.0
    }
    const setPBR_11 = () => {
        props.setPBRate( 11.0 )
        props.setPbrSliderValue( 11.0)
        audio_player.playbackRate = 11.0
    }
    const setPBR_12 = () => {
        props.setPBRate( 12.0 )
        props.setPbrSliderValue( 12.0)
        audio_player.playbackRate = 12.0
    }

    //
    // 翻訳コード
    //
    const [t_01, setT_01 ] = useState("")
    useEffect(()=>{
        const text_01 = Languages("Reset")
        setT_01(text_01)
    })

    //
    // Shortcut Key
    //
    useHotkeys('shift + h',useCallback(() => resetPBR()),  [ props.pbr_default ])
    useHotkeys('ctrl + 1　, command　+ 1', useCallback(() => setPBR_01()), [ props.pb_Rate ])
    useHotkeys('ctrl + 2　, command　+ 2', useCallback(() => setPBR_02()), [ props.pb_Rate ])
    useHotkeys('ctrl + 3　, command　+ 3', useCallback(() => setPBR_03()), [ props.pb_Rate ])
    useHotkeys('ctrl + 4　, command　+ 4', useCallback(() => setPBR_04()), [ props.pb_Rate ])
    useHotkeys('ctrl + 5　, command　+ 5', useCallback(() => setPBR_05()), [ props.pb_Rate ])
    useHotkeys('ctrl + 6　, command　+ 6', useCallback(() => setPBR_06()), [ props.pb_Rate ])
    useHotkeys('ctrl + 7　, command　+ 7', useCallback(() => setPBR_07()), [ props.pb_Rate ])
    useHotkeys('ctrl + 8　, command　+ 8', useCallback(() => setPBR_08()), [ props.pb_Rate ])
    useHotkeys('ctrl + 9　, command　+ 9', useCallback(() => setPBR_09()), [ props.pb_Rate ])
    useHotkeys('ctrl + 0　, command　+ 0', useCallback(() => setPBR_10()), [ props.pb_Rate ])
    useHotkeys('ctrl + -　, command　+ -', useCallback(() => setPBR_11()), [ props.pb_Rate ])
    useHotkeys('ctrl + ^　, command　+ ^', useCallback(() => setPBR_12()), [ props.pb_Rate ])





    return (
        <>
            <div className={PBR.grid_container}>
                <div className={PBR.icon_left}>
                    <SpeedIcon />
                </div>
                <div className={PBR.slider}>
                    <Slider
                        // getAriaValueText={valuetext}
                        aria-labelledby="pbr_slider"
                        id="slider_pbRate"
                        valueLabelDisplay="auto"
                        marks
                        value={Number(props.pbrSliderValue)}
                        defaultValue={props.pbr_default}
                        onChange={handleSliderChange}
                        step={props.pbr_step}
                        max={props.pbr_max}
                        min={props.pbr_min}
                        track={false}
                    />
                </div>
                {/* <div className={PBR.icon_mid}>
                    <SpeedIcon />
                </div> */}
                <div className={PBR.icon_right}>
                    <Tooltip title={t_01+" (shift + h)"}>
                        <RotateLeftIcon onClick={resetPBR}/>
                    </Tooltip>
                </div>
            </div>
        </>
    )
}



export default AudioPlayBackRateControl;

// ⏱


