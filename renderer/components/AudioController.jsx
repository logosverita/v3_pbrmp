//React
import React, { useReducer, useCallback ,useMemo,useEffect,useState } from 'react';
import Head from 'next/head';
// ライブラリ
import Store from 'electron-store';
//スタイル
import VC from '../style/videocontroller.module.css';
//コンポーネント
import AudioSeekBar from './AudioSeekBar';
import AudioPlayPause from './AudioPlayPause';
import AudioForwardRewind from './AudioForwardRewind';
import AudioNextPrevious from './AudioNextPrevious';
import AudioPlayBackRateControl from './AudioPlayBackRateControl';
import AudioShuffleRepeat from './AudioShuffleRepeat';
import VideoSizeChanger from './VideoSizeChanger';
import VideoFullScreen from './VideoFullScreen';
import AudioMinimum from './AudioMinimum';
import AudioVolumeControl from './AudioVolumeControl';
import AudioMinimumBack from './AudioMinimumBack';
import AudioPBRBtn from './AudioPBRBtn';
//マテリアルUI
//マテリアルUI Icon



const AudioController = (props) => {
    const store_TRACK_LIST_ALL_INFO = new Store({name: 'tracklist_all_info'})   // トラックリスト全体情報ストア
    // const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア
    const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
    const [ onLoad , setOnLoad ] = useState(false)
    const [ trackName, setTrackName ] = useState("")
    const [ repeatOn, setRepeatOn ] = useState(false)
    const [ shuffleOn, setShuffleOn ] = useState(false)
    const [ videoSize, setVideoSize ] = useState(0)
    const [ windowSizeWidth, setWindowSizeWidth] = useState(1000)
    const [ windowSizeHeight, setWindowSizeHeight] = useState(600)
    const [ miniFlag, setMiniFlag ] = useState(false)
    const [ videoForcedChange, setVideoForcedChange ] = useState(false)
    const TITLE = 'PBR Media Player'


    useEffect(()=>{
        audio_player.addEventListener('loadedmetadata', () => {
            setOnLoad(true)
            const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア
            const track_info = store_track_view_info.get('tracks')
            const video_size = store_audio_control.get('VIDEO_SIZE')
            const current_track_id = store_track_view_info.get('current_id')
            const track_name = track_info[current_track_id]
            const track_INFO = store_TRACK_LIST_ALL_INFO.get(track_name)
            //オブジェクト名?.プロパティ名と指定すると、オブジェクトがnullまたはundefinedだった場合に、エラーにならず、undefinedを返す
            const track_type = track_INFO?.track_mime
            let flag = false
            if (track_type !== undefined) {
                flag = track_type.includes("video")
                // console.log(track_type)
            } else {
                flag = false
            }
            // console.log("track_type",track_type)
            // console.log("flag",flag)
            // TO do 情報が正しく読み込まれませんでした。リロードボタンを押してください。
            // video にすると読み込み速度の関係で.track_mineが読み込めなくてバグる時がある。
            // -> Reload()でFix. -> まだ解決してない
            // -> 文字列検索を.matchから.includesに変更した
            // -> これでも直らない。 -> fncごとにストアデータを読み込むようにした。
            if (flag){
                // ビデオサイズ最適化
                let width_size = window.innerWidth*0.55-116
                width_size = width_size.toFixed(0)
                setVideoSize(width_size)
                // setVideoSize(video_size)
                props.setVideooCFlag(true)
                // ビデオを読み込んで二列だったら一列に直す
                // ビデオ読み込み中は二列を選択できないようにする -> AudioMinimum.jsx
                if( props.switchColumn ){
                    props.setSwitchColumn(false)
                    setVideoForcedChange(true)
                }
            } else { //track type Audio
                setVideoSize(0)
                props.setVideooCFlag(false)
                // ビデオの時強制的に二列に直したあと、オーディオ再生になったらに列に戻す処理。
                if(videoForcedChange){
                    setVideoForcedChange(false)
                    props.setSwitchColumn(true)
                }
            }
            setTrackName(track_name)
        })
        audio_player.onended = () => {
            const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア
            // トラック再生処理 オーディオの再生が終わったら〜〜する。
            // 再生管理関数とトラック情報の読み込みでBlog操作に重複処理がある。
            count_up()
            props.setReloadRequest(true)
            if ( repeatOn ) {
                audio_player.currentTime = 0
                props.setPlayRequest(true)
            }　else if ( shuffleOn ) {
                //Todo Current　Random
                const track_info = store_track_view_info.get('tracks')
                const len = track_info.length
                const random = Math.floor(Math.random() * len)
                const track_name = track_info[random]
                const track_INFO = store_TRACK_LIST_ALL_INFO.get(track_name)
                store_track_view_info.set('current_id',random)
                audio_player.src = track_INFO.track_blob
                props.setPlayRequest(true)
            } else {
                // ToDo CurrentID++ load save
                const track_info = store_track_view_info.get('tracks')
                const current_track_id = store_track_view_info.get('current_id')
                const len = track_info.length
                if ( current_track_id + 1 < len ) {
                    const next_track_id = current_track_id + 1
                    store_track_view_info.set('current_id',next_track_id )
                    const track_name = track_info[next_track_id]
                    const track_INFO = store_TRACK_LIST_ALL_INFO.get(track_name)
                    audio_player.src = track_INFO.track_blob
                } else {
                    store_track_view_info.set('current_id', 0 )
                    const track_name = track_info[0]
                    const track_INFO = store_TRACK_LIST_ALL_INFO.get(track_name)
                    audio_player.src = track_INFO.track_blob
                } // トラックリストより超えなければ次をセットして、超えたら０に戻す。
                props.setPlayRequest(true)
            }
        }
        audio_player.addEventListener('emptied', () => {
            // もし次のトラックもビデオならビデオの初期化はしない
            // 次の読み込みトラックが存在していて、次の読み込みトラックが同じタイプならビデオサイズはそのままにする。
            // Fix: この下の二行が不要なコードだった。。。
            // setVideoSize(0)
            // props.setVideooCFlag(false)
            setOnLoad(false)
            // setTrackName("No Title")
            props.setNowPlaying(false)
        })


    })

    // 日付をYYYY-MM-DDの書式で返すメソッド
    function formatDate(dt) {
        var y = dt.getFullYear();
        var m = ('00' + (dt.getMonth()+1)).slice(-2);
        var d = ('00' + dt.getDate()).slice(-2);
        return (y + '-' + m + '-' + d);
    }


    const count_up = () => {
        const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア
        const track_info = store_track_view_info.get('tracks')
        const current_track_id = store_track_view_info.get('current_id')
        const track_name = track_info[current_track_id]
        let track_INFO = store_TRACK_LIST_ALL_INFO.get(track_name)
        // 再生完了トラックの再生回数をカウントアップ
        track_INFO.track_count = track_INFO.track_count + 1
        // 再生完了日をストアトラックに保存
        track_INFO.track_play_date = formatDate(new Date())
        //再生中に履歴からトラック情報を削除したときをフォローアップする処理
        if(store_TRACK_LIST_ALL_INFO.has(track_name)){
            store_TRACK_LIST_ALL_INFO.set(track_name,track_INFO)
        }
        // console.log('Count up',track_INFO)
    }

    return (
        <>
        <Head>
            {(trackName)
                ?<title>{trackName}</title>
                :<title>{TITLE}</title>
            }
        </Head>
            {(props.videoFlag)
                ?<div id="video_blackbox" className={VC.videobox}><video id='audio_player' height={videoSize} ></video></div>
                :<div id="video_blackbox" className={VC.audiobox}><video id='audio_player' width="0" ></video></div>
                // :<video id='audio_player' width={videoSize} height="10" className={VC.audio}></video>
            }
            <div className={VC.container}>
                <div className={VC.btn}>
                    <AudioPlayPause
                        setPlayRequest={props.setPlayRequest}
                        playRequest={props.playRequest}
                        pb_Rate={props.pb_Rate}
                        onLoad={onLoad}
                        nowPlaying={props.nowPlaying}
                        setNowPlaying={props.setNowPlaying}
                        modePlayer={props.modePlayer}
                    />
                </div>
                <div id="audio_seekbar" className={VC.seekbar}>
                    <AudioSeekBar onLoad={onLoad} setTrackName={setTrackName} />
                    </div>
                <div id="minimum_back" className={VC.minimum_back}>
                    <AudioMinimumBack
                        className={VC.mini}
                        windowSizeWidth={windowSizeWidth}
                        windowSizeHeight={windowSizeHeight}
                        miniFlag={miniFlag}
                        setMiniFlag={setMiniFlag}
                    />
                </div>
            </div>

            <div id="track_title" className={VC.tracktitle}>{trackName}</div>
            {props.modePlayer
            ?<>
                <div id="track_control_btns" className={VC.track_control_btns}>
                    <AudioNextPrevious
                        setPlayRequest={props.setPlayRequest}
                        pb_Rate={props.pb_Rate}
                    />
                    <AudioPBRBtn
                        pb_Rate={props.pb_Rate}
                        pbr_step={props.pbr_step}
                        pbr_max={props.pbr_max}
                        pbr_min={props.pbr_min}
                        pbr_set_1={props.pbr_set_1}
                        pbr_set_2={props.pbr_set_2}
                        setPBR_set_1={props.setPBR_set_1}
                        setPBR_set_2={props.setPBR_set_2}
                        setPBRate={props.setPBRate}
                        pbrSliderValue={props.pbrSliderValue}
                        setPbrSliderValue={props.setPbrSliderValue}
                    />
                    <AudioForwardRewind
                        onLoad={onLoad}
                        setOptionRequest={props.setOptionRequest}
                        optionRequest={props.optionRequest}
                        LR={props.LR}
                        SR={props.SR}
                        SF={props.SF}
                        LF={props.LF}
                        setLR={props.setLR}
                        setSR={props.setSR}
                        setSF={props.setSF}
                        setLF={props.setLF}
                        lang={props.lang}
                    />
                    <AudioMinimum
                        windowSizeWidth={windowSizeWidth}
                        setWindowSizeWidth={setWindowSizeWidth}
                        windowSizeHeight={windowSizeHeight}
                        setWindowSizeHeight={setWindowSizeHeight}
                        miniFlag={miniFlag}
                        setMiniFlag={setMiniFlag}
                        modePlayer={props.modePlayer}
                        // modeSetting={props.modeSetting}
                        // modeHistory={props.modeHistory}
                        switchColumn={props.switchColumn}
                        setSwitchColumn={props.setSwitchColumn}
                        videoFlag={props.videoFlag}
                    />
                    <AudioShuffleRepeat
                        setPlayRequest={props.setPlayRequest}
                        setRepeatOn={setRepeatOn}
                        setShuffleOn={setShuffleOn}
                        repeatOn={repeatOn}
                        shuffleOn={shuffleOn}
                    />
                    <VideoFullScreen
                        videoSize={videoSize}
                        videoFlag={props.videoFlag}
                    />
                    <VideoSizeChanger
                        videoSize={videoSize}
                        setVideoSize={setVideoSize}
                        videoFlag={props.videoFlag}
                        switchColumn={props.switchColumn}
                    />

                    <AudioVolumeControl />
                </div>
                <div  id="audio_pbr" className={VC.audio_pbr}>
                    <AudioPlayBackRateControl
                        setPBRate={props.setPBRate}
                        pb_Rate={props.pb_Rate}
                        pbr_max={props.pbr_max}
                        pbr_min={props.pbr_min}
                        pbr_step={props.pbr_step}
                        pbr_default={props.pbr_default}
                        setPBR_max={props.setPBR_max}
                        setPBR_min={props.setPBR_min}
                        setPBR_step={props.setPBR_step}
                        setPBR_default={props.setPBR_default}
                        pbrSliderValue={props.pbrSliderValue}
                        setPbrSliderValue={props.setPbrSliderValue}
                    />
                </div>
            </>
            :null
            }
        </>
    )
}

export default AudioController;


