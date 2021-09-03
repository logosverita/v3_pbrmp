// React
import {React, useState, useEffect } from 'react';

// ライブラリ
import Store from 'electron-store';
//スタイル
import HM from '../style/home.module.css';
// コンポーネント
import AudioController from '../components/AudioController';
import TrackViewController from '../components/TrackViewController';
import TopBar from '../components/TopBar';
import Setting from '../components/Setting';
import History from '../components/History';
// マテリアルUI
//マテリアルUI Icon

function Home() {
    // console.log("Home---------------------",)
    //
    const [ nowPlaying, setNowPlaying] = useState(false)
    const [ playRequest , setPlayRequest ] = useState(false)
    const [ reloadRequest, setReloadRequest ] = useState(false)
    const [ optionRequest, setOptionRequest] = useState('none')
    //
    const [ modePlayer , setModePlayer] = useState(true)
    const [ modeSetting, setModeSetting ] = useState(false)
    const [ modeHistory, setModeHistory] = useState(false)
    const [ modePatron , setModePatron] = useState(false)
    // Home -> AudioController -> AudioPlayBackRate
    const [ pb_Rate , setPBRate ] = useState(1.0)
    const [ pbr_max , setPBR_max ] = useState(4.0)  // MaterialUIの設定のために仮の情報で初期化
    const [ pbr_min , setPBR_min ] = useState(0.1)
    const [ pbr_step, setPBR_step ] = useState(0.1)
    const [ pbr_default, setPBR_default] = useState(1.0)
    // Home -> AudioController -> AudioForwardRewind
    const [ LR, setLR ] = useState(0)
    const [ SR, setSR ] = useState(0)
    const [ SF, setSF ] = useState(0)
    const [ LF, setLF ] = useState(0)
    // Home -> AudioController -> AudioPBRBtn
    const [ pbr_set_1, setPBR_set_1 ]= useState(2.0)
    const [ pbr_set_2, setPBR_set_2 ]= useState(3.0)
    // AudioPlayBackRateControl, AudioPBRBtn スライダー用変数
    const [ pbrSliderValue , setPbrSliderValue ] = useState(1.0)
    // Home -> AudioController
    const [ switchColumn, setSwitchColumn ] = useState(false)
    // Home lang
    const [ lang, setLang ] = useState("")
    // Home -> AudioContorller & TrackViewController
    const [ videoFlag, setVideooCFlag ] = useState(false)

    useEffect( ()=> {
        const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア
        store_track_view_info.set('tracks',[])
        store_track_view_info.set('current_id',0)
        store_track_view_info.set('loadmeta_count',0)
        store_track_view_info.set('playing_uuid','')
        store_track_view_info.set('uuid',[])

        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        if(!store_audio_control.has('prb_max')){
            store_audio_control.set('prb_max',4.0) //max16.0
            store_audio_control.set('pbr_min',0.1)
            store_audio_control.set('pbr_step',0.1)
            store_audio_control.set('pbr_default',1.0)
            // store_audio_control.set('pbr_step_on',true)
        }
        if ( !store_audio_control.has('LARGE_FORWARD')){
            store_audio_control.set('LARGE_FORWARD',60)
            store_audio_control.set('SMALL_FORWARD',5)
            store_audio_control.set('LARGE_REPLAY',60)
            store_audio_control.set('SMALL_REPLAY',5)
            store_audio_control.set('VIDEO_SIZE',720)
            setLR(60)   // 再定義しないと初回起動時に読み込み順の関係でバグる。
            setSR(5)
            setSF(60)
            setLF(5)
            // console.log('メディアコントロール；初期化実行しました。')
        } else {
            setLR(store_audio_control.get('LARGE_REPLAY'))
            setSR(store_audio_control.get('SMALL_REPLAY'))
            setSF(store_audio_control.get('SMALL_FORWARD'))
            setLF(store_audio_control.get('LARGE_FORWARD'))
        }
        if ( !store_audio_control.has('volume')){
            store_audio_control.set('volume',0.20)
            // console.log('オーディオコントロール；音量初期化実行しました。')
        }
        if ( !store_audio_control.has('volume_tmp')){
            store_audio_control.set('volume_tmp',0.20)
            // console.log('ミュートコントロール；セーブスロットを作成しました。')
        }
        if( !store_audio_control.has('pbr_set_1')){
            store_audio_control.set('pbr_set_1',2)
            store_audio_control.set('pbr_set_2',3)
            setPBR_set_1(2.0)  // 再定義しないと初回起動時に読み込み順の関係でバグる。
            setPBR_set_2(3.0)
            // console.log('再生速度コントロール；初期化実行しました。')
        }
        if ( !store_audio_control.has('LANG')){
            const local = navigator.language  // 日本語なら"ja"が返る
            console.log(local)
            store_audio_control.set('LANG',local)
            // console.log('言語コントロール；使用言語を設定しました。')
        } else {
            const lang = store_audio_control.get('LANG')
            setLang(lang)
        }
        if ( !store_audio_control.has('FOLD')){
            store_audio_control.set('FOLD',false)
            // console.log('展開折りたたみコントロール；初期化実行しました。。')
        } else {
            store_audio_control.set('FOLD',false)
        }


    },[])


    return (
    <>


        <div id="header_top" className={HM.header}>
            <TopBar
                modePlayer={modePlayer}
                modeSetting={modeSetting}
                modeHistory={modeHistory}
                setModePlayer={setModePlayer}
                setModeSetting={setModeSetting}
                setModeHistory={setModeHistory}
                setModePatron={setModePatron}
                lang={lang}
            />
        </div>




    <div
    className={
        ( modeHistory || modeSetting || modePatron)
        ?HM.wrap_HS_hide
        :HM.wrap_HS_show
    }>
        <div
            className={
                switchColumn
                ?HM.wrap_flex
                :HM.wrap_block
            }
            id="media_player"
        >
            <div
                className={switchColumn?HM.style50:HM.style100}
                // className={HM.controller}
                id="audio_controller"
            >
                <AudioController
                    setPlayRequest={setPlayRequest}
                    setPBRate={setPBRate}
                    pb_Rate={pb_Rate}
                    playRequest={playRequest}
                    reloadRequest={reloadRequest}
                    setReloadRequest={setReloadRequest}
                    setOptionRequest={setOptionRequest}
                    optionRequest={optionRequest}
                    nowPlaying={nowPlaying}
                    setNowPlaying={setNowPlaying}
                    videoFlag={videoFlag}
                    setVideooCFlag={setVideooCFlag}
                    modePlayer={modePlayer}
                    modeSetting={modeSetting}
                    modeHistory={modeHistory}
                    pbr_max={pbr_max}
                    pbr_min={pbr_min}
                    pbr_step={pbr_step}
                    pbr_default={pbr_default}
                    setPBR_max={setPBR_max}
                    setPBR_min={setPBR_min}
                    setPBR_step={setPBR_step}
                    setPBR_default={setPBR_default}
                    LR={LR}
                    SR={SR}
                    SF={SF}
                    LF={LF}
                    setLR={setLR}
                    setSR={setSR}
                    setSF={setSF}
                    setLF={setLF}
                    modePlayer={modePlayer}
                    modeSetting={modeSetting}
                    modeHistory={modeHistory}
                    pbr_set_1={ pbr_set_1}
                    pbr_set_2={pbr_set_2}
                    setPBR_set_1={setPBR_set_1}
                    setPBR_set_2={setPBR_set_2}
                    pbrSliderValue={pbrSliderValue}
                    setPbrSliderValue={setPbrSliderValue}
                    switchColumn={switchColumn}
                    setSwitchColumn={setSwitchColumn}
                    lang={lang}
                />
                </div>
            <div
                className={switchColumn ?HM.style50 :HM.style100}
                // className={HM.viewtable}
                id="view_controller"
            >
                <TrackViewController
                    setPlayRequest={setPlayRequest}
                    playRequest={playRequest}
                    reloadRequest={reloadRequest}
                    setReloadRequest={setReloadRequest}
                    nowPlaying={nowPlaying}
                    setNowPlaying={setNowPlaying}
                    videoFlag={videoFlag}
                    setVideooCFlag={setVideooCFlag}
                    modePlayer={modePlayer}
                    lang={lang}
                />
            </div>
        </div>
    </div>






        <div
            // className={HM.setting}
            id="view_setting"
        >
        {modeSetting
            ?<Setting
                className={HM.viewtable}
                pbr_max={pbr_max}
                pbr_min={pbr_min}
                pbr_step={pbr_step}
                pbr_default={pbr_default}
                setPBR_max={setPBR_max}
                setPBR_min={setPBR_min}
                setPBR_step={setPBR_step}
                setPBR_default={setPBR_default}
                LR={LR}
                SR={SR}
                SF={SF}
                LF={LF}
                setLR={setLR}
                setSR={setSR}
                setSF={setSF}
                setLF={setLF}
                pbr_set_1={pbr_set_1}
                pbr_set_2={pbr_set_2}
                setPBR_set_1={setPBR_set_1}
                setPBR_set_2={setPBR_set_2}
                lang={lang}
                setLang={setLang}
                switchColumn={switchColumn}
                setSwitchColumn={setSwitchColumn}
            />
            :null
        }
        </div>






        <div
            id="view_history"
            // className={HM.history}
        >
        {modeHistory
            ?<History
                className={HM.viewtable}
                setReloadRequest={setReloadRequest}
            />
            :null
        }
        </div>


    </>
    )
}

export default Home;

