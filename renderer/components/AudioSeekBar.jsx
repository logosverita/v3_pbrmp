// React
import { useState, useEffect } from 'react';
// ライブラリ
//スタイル
import SB from '../style/seekbar.module.css';
// コンポーネント群
// マテリアルUI
import Slider from '@material-ui/core/Slider';
//マテリアルUI Icon




const AudioSeekBar = (props) => {

    const [ currentTime, setCurrentTime ]= useState(0.0)
    const [ durationTime, setDurationTime ] = useState(0.0)
    const [ durationTime_max, setDurationTimeMax ] = useState(0)
    const [ seekBarTime , setSeekBarTime ] = useState(0)

    useEffect(()=>{
        setDurationTime('00:00')
        setSeekBarTime('00:00')
        audio_player.addEventListener('timeupdate', (e) => {
            let current_time_s = audio_player.currentTime
            let duration_time_s  = audio_player.duration
            // console.log('SeekBar --------------------:',)
            // console.log('SeekBar current_time_s:',current_time_s)
            // console.log('SeekBar duration_time_s:',duration_time_s)
            if( isNaN(duration_time_s)){
                // トラック切り替えで0.1だけ00:aNとチラつくストレスを緩和する処理
                setDurationTime('00:00')
            } else {
                let hms_time = hms(current_time_s)
                let duration_hms = hms(duration_time_s)
                setDurationTime(duration_hms)
                setSeekBarTime(hms_time)
                setCurrentTime(current_time_s)
                setDurationTimeMax(duration_time_s)
            }
        })
    },[])


    useEffect( ()=> {
        //ToDo Track info all から duration を取得する
        audio_player.addEventListener('loadedmetadata', () => {
            let duration_time_s  = audio_player.duration
            let duration_hms = hms(duration_time_s)
            setDurationTime(duration_hms)
            setDurationTimeMax(duration_time_s)
        })
        audio_player.addEventListener('emptied', () => {
            setDurationTime('00:00')
            setSeekBarTime('00:00')
            setCurrentTime(0)
            audio_player.currentTime = 0
            props.setTrackName('')
        })
    })



    function hms (tt) {
        let hms = ''
        const t = Math.floor(tt)
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



    const handleChange = (event, currentTime) => {
        if(audio_player.readyState > 0){
            // console.log('SET currentTime on audio_player.currentTime :',currentTime)
            audio_player.currentTime = currentTime
        }
    }


    return (
        <>
        <div className={SB.container}>
            <div className={SB.time}>{seekBarTime} / {durationTime}</div>
            <Slider
                className={SB.seekbar}
                value={currentTime}
                min={0}
                max={durationTime_max}
                onChange={handleChange}
                aria-labelledby="continuous-slider"
                // valueLabelDisplay="auto"
                // valueLabelFormat={hms}
            />
        </div>
        </>
    )
}

export default AudioSeekBar;
