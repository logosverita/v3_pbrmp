// React
import { useState, useEffect } from 'react';
// ライブラリ
import Store from 'electron-store';
import fs from 'fs-extra';
//スタイル
import HM from '../style/home.module.css';
// コンポーネント
import AudioController from '../components/AudioController';
import TrackViewController from '../components/TrackViewController';
import TopBar from '../components/TopBar';
import Setting from '../components/Setting';
import History from '../components/History';
// import Learning from '../components/Learning';
// import Archivement from '../components/Archivement';
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
    const [ modeSetting, setModeSetting] = useState(false)
    const [ modeHistory, setModeHistory] = useState(false)
    const [ modeLearning , setModeLearning] = useState(false)
    const [ modeArchivement , setModeArchivement] = useState(false)

    // Home -> AudioController -> AudioPlayBackRate
    const [ pb_Rate , setPBRate ] = useState(1.0)
    const [ pbr_max , setPBR_max ] = useState(16.0)  // MaterialUIの設定のために仮の情報で初期化
    const [ pbr_min , setPBR_min ] = useState(0.07)
    const [ pbr_step, setPBR_step ] = useState(1.0)
    const [ pbr_default, setPBR_default] = useState(1.0)
    // Home -> AudioController -> AudioForwardRewind
    const [ LR, setLR ] = useState(0)
    const [ SR, setSR ] = useState(0)
    const [ SF, setSF ] = useState(0)
    const [ LF, setLF ] = useState(0)
    // Home -> AudioController -> AudioPBRBtn
    const [ pbr_set_1, setPBR_set_1 ]= useState(3.0)
    const [ pbr_set_2, setPBR_set_2 ]= useState(5.0)
    // AudioPlayBackRateControl, AudioPBRBtn スライダー用変数
    const [ pbrSliderValue , setPbrSliderValue ] = useState(1.0)
    // Home -> AudioController
    const [ switchColumn, setSwitchColumn ] = useState(false)
    // Home lang
    const [ lang, setLang ] = useState("")
    // Home -> AudioContorller & TrackViewController
    const [ videoFlag, setVideooCFlag ] = useState(false)
    // Home -> Setting, || TrackViewController -> SavePlaylist
    const [ playFolderPath, setPlayFolderPath ] = useState("")


    useEffect( ()=> {
        const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア
        store_track_view_info.set('tracks',[])
        store_track_view_info.set('current_id',0)
        store_track_view_info.set('loadmeta_count',0)
        store_track_view_info.set('playing_uuid','')
        store_track_view_info.set('uuid',[])

        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        // 再生速度初期値
        if(!store_audio_control.has('prb_max')){
            store_audio_control.set('prb_max',16.0) //max16.0
            store_audio_control.set('pbr_min',0.07)
            store_audio_control.set('pbr_step',1.0)
            store_audio_control.set('pbr_default',1.0)
        } else {
            setPBR_max(store_audio_control.get('prb_max'))
            setPBR_min(store_audio_control.get('pbr_min'))
            setPBR_step(store_audio_control.get('pbr_step'))
            setPBR_default(store_audio_control.get('pbr_default'))
        }
        // 早送り巻き戻し時間
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
        // 音量
        if ( !store_audio_control.has('volume')){
            store_audio_control.set('volume',0.20)
            // console.log('オーディオコントロール；音量初期化実行しました。')
        }
        // 音量一時保存用
        if ( !store_audio_control.has('volume_tmp')){
            store_audio_control.set('volume_tmp',0.20)
            // console.log('ミュートコントロール；セーブスロットを作成しました。')
        }
        // 登録速度
        if( !store_audio_control.has('pbr_set_1')){
            store_audio_control.set('pbr_set_1',2)
            store_audio_control.set('pbr_set_2',3)
            setPBR_set_1(2.0)  // 再定義しないと初回起動時に読み込み順の関係でバグる。
            setPBR_set_2(3.0)
            // console.log('再生速度コントロール；初期化実行しました。')
        } else {
            setPBR_set_1(store_audio_control.get('pbr_set_1'))
            setPBR_set_2(store_audio_control.get('pbr_set_2'))
        }
        // ユーザー言語環境
        if ( !store_audio_control.has('LANG')){
            const local = navigator.language  // 日本語なら"ja"が返る
            // console.log(local)
            store_audio_control.set('LANG',local)
            setLang(lang)
            // console.log('言語コントロール；使用言語を設定しました。')
        } else {
            const lang = store_audio_control.get('LANG')
            setLang(lang)
        }
        // 折りたたみフラグ
        if ( !store_audio_control.has('FOLD')){
            store_audio_control.set('FOLD',false)
            // console.log('展開折りたたみコントロール；初期化実行しました。。')
        } else {
            store_audio_control.set('FOLD',false)
        }
        // 起動回数カウント
        if(!store_audio_control.has('BOOT')){
            store_audio_control.set('BOOT',1)
        }else{
            let boot_count = store_audio_control.get('BOOT')
            boot_count = boot_count + 1
            store_audio_control.set('BOOT',boot_count)
        }
        // プレイフォルダの有無の確認
        // With Promises:
        const username = process.env["USER"]
        const init_dir = "/Users/"+username+"/Music/PBR Media Player"
        fs.ensureDir(init_dir)
        // プレイフォルダ保存先
        if(!store_audio_control.has('PATH')){
            store_audio_control.set( 'PATH', init_dir )
            // 初回起動時は、デフォルトの保存先フォルダを作成
            setPlayFolderPath( init_dir )
        }else{
            setPlayFolderPath( store_audio_control.get('PATH') )
        }
        // プレイフォルダ一覧保存
        const store_PLAYLISTS_INFO = new Store({name: 'playlists'})   // トラックリスト全体情報ストア
        if(!store_PLAYLISTS_INFO.has('PLAYLISTS')){
            store_PLAYLISTS_INFO.set('PLAYLISTS',[])
        } else {
            // プレイリストフォルダのフォルダ一覧取得
            const dir_playfolders= String(store_audio_control.get( 'PATH' ))
            const allDirents = fs.readdirSync( dir_playfolders, { withFileTypes: true })
            const folders = allDirents.filter(dirent => dirent.isDirectory()).map(({ name }) => name)
            store_PLAYLISTS_INFO.set('PLAYLISTS',folders)
            // console.log(dir_playfolders)
            // console.log(folders)
        }


    },[])


    return (
    <>

{/* <button onClick={Notification}>通知テスト</button> */}

        <div id="header_top" className={HM.header}>
            <TopBar
                // modePlayer={modePlayer}
                // modeSetting={modeSetting}
                // modeHistory={modeHistory}
                setModePlayer={setModePlayer}
                setModeSetting={setModeSetting}
                setModeHistory={setModeHistory}
                setModeLearning={setModeLearning}
                setModeArchivement={setModeArchivement}
                lang={lang}
            />
        </div>




    <div
    className={
        ( modeHistory || modeSetting || modeLearning || modeArchivement )
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
                    playFolderPath={playFolderPath}
                    setPlayFolderPath={setPlayFolderPath}
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
                setVideooCFlag={setVideooCFlag}
                playFolderPath={playFolderPath}
                setPlayFolderPath={setPlayFolderPath}
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





        {/* <div
            id="view_learning"
            // className={HM.learning}
        >
        {modeLearning
            ?<Learning
                className={HM.viewtable}
                setReloadRequest={setReloadRequest}
            />
            :null
        }
        </div> */}




        {/* <div
            id="view_archivement"
            // className={HM.archivement}
        >
        {modeArchivement
            ?<Archivement
                className={HM.viewtable}
                setReloadRequest={setReloadRequest}
            />
            :null
        }
        </div> */}



    </>
    )
}

export default Home;

