// React
import { useState , useEffect , useCallback } from 'react';
// ライブラリ
import Store from 'electron-store';
import { useHotkeys } from 'react-hotkeys-hook';
//スタイル
import VL from '../style/vol.module.css';
// コンポーネント
import Languages from '../components/Languages';
// マテリアルUI
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

//マテリアルUI Icon
import Slider from '@material-ui/core/Slider';
import VolumeUp from '@material-ui/icons/VolumeUp';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';



const AudioVolumeControl = () => {

    const useStyles = makeStyles((theme) => ({
        root: {
            minWidth: 24,
            height:32,
        },
    }))
    const squareButton = useStyles()

    // console.log("VolumeControl---------------------",)
    const [ volumeValue, setVolumeValue ] = useState(0.0) //スライダーで動かす値
    const [ defVol, setDefVol ] = useState(0.0) // ボリュームバーの初期値
    const [ nowMute, setNowMute ] = useState(false) // ミュートフラグ管理

    // SeekBar on Volume Change /////////////////////////////////////////////////
    const handleChange = (event, newValue) => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        store_audio_control.set('volume_tmp',newValue)
        setVolumeValue(newValue)

        audio_player.volume = volumeValue
    }
    ////////////////////////////////////////////////////////////////////////////





    // Store Option Setting Volume  /////////////////////////////////////////////////
    useEffect(()=>{
        // 音量状態初期化
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        if(store_audio_control.has('volume')){
            const def_volume = store_audio_control.get('volume')
            audio_player.volume = def_volume
            setDefVol(def_volume)   //スライダーで動かす値
            setVolumeValue(def_volume) // ボリュームバーの初期値
        } else {
            console.log('音量初期化設定：読み込めませんでした。初期化します。')
            const def_volume = 0.2
            audio_player.volume = def_volume
            setDefVol( def_volume )   //スライダーで動かす値
            setVolumeValue( def_volume ) // ボリュームバーの初期値
        }
        // ボリュームエリアCSS
        const volume_area = document.getElementById('vol_wrap')
        volume_area.addEventListener('mouseover',()=>{
            document.getElementById("vol_slider").style.visibility = "visible"
        })
        volume_area.addEventListener('mouseout',()=>{
            document.getElementById("vol_slider").style.visibility = "hidden"
        })
    },[])
    ////////////////////////////////////////////////////////////////////////////




    // Hot Key Volume Changer /////////////////////////////////////////////////
    function volUP () {
        if ( (audio_player.volume > 0.01) && (audio_player.volume < 0.99) ){
            let now_vol = audio_player.volume + 0.01
            now_vol = now_vol.toFixed(2)
            setVolumeValue(now_vol)
            audio_player.volume = now_vol
            // console.log("Up", audio_player.volume)
        }
    }
    function volDOWN () {
        if ( (audio_player.volume > 0.01) && (audio_player.volume < 0.99) ){
            let now_vol = audio_player.volume - 0.01
            now_vol = now_vol.toFixed(2)
            setVolumeValue(now_vol)
            audio_player.volume = now_vol
            // console.log("Down", audio_player.volume)
        }
    }
    function volZeroToggle() {
        if(nowMute){
            const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
            const vol = store_audio_control.get('volume_tmp')
            setNowMute(false)                   // フラグ管理
            setVolumeValue(vol)                 // ストアに保存した音量値を読み込み
            audio_player.volume = vol       // プレイヤーの音量を読み込む
            // console.log("ミュート解除",volumeValue)
        }else{
            const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
            // console.log("ミュート")
            store_audio_control.set('volume_tmp', audio_player.volume)  // 現在の値を保存する
            setNowMute(true)        // フラグをセットする
            setVolumeValue(0)       // スライダーの値をゼロにする
            audio_player.volume = 0 // プレイヤーの音量をゼロにする
            // console.log("Zero", audio_player.volume )
        }
    }
    ///////////////////////////////////////////////////////////////////////

    //
    // 翻訳コード
    //
    const [t_01, setT_01 ] = useState("")
    const [t_02, setT_02 ] = useState("")
    const [t_03, setT_03 ] = useState("")
    useEffect(()=>{
        const text_01 = Languages("Mute")
        const text_02 = Languages("VolUp")
        const text_03 = Languages("VolDown")
        setT_01(text_01)
        setT_02(text_02)
        setT_03(text_03)
    })

    //
    // Shortcut Key
    //
    useHotkeys('shift + c', useCallback(() => volUP()), [])
    useHotkeys('shift + x', useCallback(() => volDOWN()), [])
    useHotkeys('shift + z', useCallback(() => volZeroToggle()), [nowMute])



    return (
        <>
        <div id="vol_wrap" className={VL.wrap}>
            <Tooltip title={t_01+" (shift + z)"} >
                <Button  className={squareButton.root} onClick={()=>{volZeroToggle()}}>
                    <div id="vol_icon" className={VL.icon_left} >
                        {(volumeValue >= 0.5 )?<VolumeUp />:null}
                        {(volumeValue >= 0.15 && volumeValue < 0.5 )?<VolumeDown />:null}
                        {(volumeValue !== 0 && volumeValue < 0.15 )?<VolumeMuteIcon />:null}
                        {(volumeValue === 0)?<VolumeOffIcon />:null}
                    </div>
                </Button>
            </Tooltip >
            <Tooltip title={t_02+" (shift + c) "+t_03+" (shift + x)"} >
                <div id="vol_slider" className={VL.slider}>
                    <Slider
                        defaultValue={defVol}
                        value={volumeValue}
                        onChange={handleChange}
                        aria-labelledby="volume_slider"
                        valueLabelDisplay="auto"
                        max={1}
                        min={0}
                        step={0.01}
                    />
                </div>
            </Tooltip >
            </div>
        </>
    )
}

export default AudioVolumeControl


// 🔉
// 🔊

