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
    useHotkeys('shift + h', useCallback(() => resetPBR()), [ props.pbr_default ])





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


