// React
import { useState, useEffect , useCallback } from 'react';
// ライブラリ
import Store from 'electron-store';
import { useHotkeys } from 'react-hotkeys-hook';

//スタイル
import AM from '../style/audio_minimum.module.css';
// コンポーネント
import Languages from './Languages';
// マテリアルUI
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
//マテリアルUI Icon
import ReorderIcon from '@material-ui/icons/Reorder';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import ViewStreamIcon from '@material-ui/icons/ViewStream';



const AudioMinimum = (props) => {


    const [ w, setW ] = useState(null)  // innerWidth 用 React変数

    const minimum = () => {
        if(!props.miniFlag){
            props.setWindowSizeWidth(window.innerWidth)
            props.setWindowSizeHeight(window.innerHeight)
            props.setMiniFlag(true)
            const ID_track_control_btns = document.getElementById("track_control_btns")
            const ID_track_title = document.getElementById("track_title")
            const ID_header_top = document.getElementById("header_top")
            ID_track_control_btns.style.display ="none"
            ID_track_title.style.display ="none"
            ID_header_top.style.display ="none"
            window.resizeTo(448, 72)
        }
    }


    const resize_column_1 = () => {

        const store_audio_control = new Store({name: 'store_audio_control'})    // トラックVIEW管理用ストア
        const column_flag = store_audio_control.get('COLUMN')

        const ID_track_control_btns = document.getElementById("track_control_btns")
        const ID_track_title = document.getElementById("track_title")
        const ID_header_top = document.getElementById("header_top")
        const ID_dnd = document.getElementById("dnd")
        const ID_table_view = document.getElementById("table_view")
        const ID_audio_pbr = document.getElementById("audio_pbr")
        const ID_video_blackbox = document.getElementById("video_blackbox")
        const ID_minimum_back = document.getElementById("minimum_back")
        const ID_vol_wrap = document.getElementById("vol_wrap")
        let H_table_view = 0
        if( ID_table_view){
            H_table_view = ID_table_view.clientHeight
        }

        if ((column_flag === "OFF") && (!props.videoFlag) ){
            if ( window.innerHeight / screen.availHeight < 0.12 ){
                // console.log("NONE.",screen.availWidth , window.innerHeight, window.innerHeight/screen.availHeight)
                ID_header_top.style.display ="none"
            } else {
                // console.log("BLOCK.",screen.availWidth , window.innerHeight, window.innerHeight/screen.availHeight)
                ID_header_top.style.display = "block"
            }
            if ( window.innerHeight  < 365 ) {
                ID_dnd.style.display ="none"
            } else {
                ID_dnd.style.display ="block"
            }
            if ( window.innerHeight < 264 ) {
                ID_table_view.style.display ="none"
            } else {
                ID_table_view.style.display ="block"
            }
            if ( window.innerHeight < 240 ) {
                ID_minimum_back.style.display ="block"
                props.setMiniFlag(true)
            } else {
                ID_minimum_back.style.display ="none"
                props.setMiniFlag(false)
            }
            if ( window.innerHeight  <　230 ) {
                ID_audio_pbr.style.display ="none"
            } else {
                ID_audio_pbr.style.display ="block"
            }
            if ( window.innerHeight < 140) {
                ID_track_control_btns.style.display ="none"
            } else {
                ID_track_control_btns.style.display ="block"
            }
            if ( window.innerHeight < 120 ){
                ID_video_blackbox.style.display ="none"
            } else {
                ID_video_blackbox.style.display = "block"
            }
            if ( window.innerHeight < 90 ) {
                ID_track_title.style.display ="none"
            } else {
                ID_track_title.style.display = "block"
            }
        // } else if ((column_flag === "ON") && (!props.videoFlag) ){
        } else {
            // console.log("ON 2",)
            if ( window.innerHeight / screen.availWidth < 0.12 ){
                ID_header_top.style.display ="none"
            } else {
                ID_header_top.style.display = "block"
            }
            if ( window.innerHeight  < 230 ) {
                ID_audio_pbr.style.display ="none"
            } else {
                ID_audio_pbr.style.display ="block"
            }
            if ( window.innerHeight  < 200 ) {
                ID_vol_wrap.style.display ="none"
                ID_dnd.style.display ="none"
            } else {
                ID_table_view.style.display ="block"
                ID_dnd.style.display ="block"
            }
            if ( window.innerHeight < 160) {
                ID_track_control_btns.style.display ="none"
                ID_minimum_back.style.display ="none"
                props.setMiniFlag(true)
            } else {
                ID_minimum_back.style.display ="block"
                ID_track_control_btns.style.display ="block"
                props.setMiniFlag(false)
            }
            if ( window.innerHeight < 120 ){
                ID_video_blackbox.style.display ="none"
            } else {
                ID_video_blackbox.style.display = "block"
            }
            if ( window.innerHeight < 100 ) {
                ID_table_view.style.display ="none"

            } else {
                ID_vol_wrap.style.display ="block"
            }
            if ( window.innerHeight < 90 ) {
                ID_track_title.style.display ="none"
            } else {
                ID_track_title.style.display = "block"
            }
        }
    }

    const resize_column_2 = () => {

        const store_audio_control = new Store({name: 'store_audio_control'})    // トラックVIEW管理用ストア
        const column_flag = store_audio_control.get('COLUMN')

        if ( ( window.innerWidth < 900 ) && (column_flag === "ON") ) {
            // console.log("column_flag",column_flag)
            props.setSwitchColumn(false)
        } else if ( ( window.innerWidth > 900 ) && (column_flag === "ON" ) ) {
            // console.log("column_flag",column_flag)
            props.setSwitchColumn(true)
        }
    }



    const switch_coluｍn = () => {
        if((props.miniFlag === false) && (window.innerWidth > 900 )){ // SCでminiになってるとき：SC無効
            // console.log("Switch")
            const store_audio_control = new Store({name: 'store_audio_control'})    // トラックVIEW管理用ストア
            if( props.switchColumn === false ){
                store_audio_control.set('COLUMN',"ON")
                props.setSwitchColumn( true )
            }else{
                store_audio_control.set('COLUMN',"OFF")
                props.setSwitchColumn( false )
            }
        }
        // else{
        //     console.log("Switch:SCでminiになってるとき：SC無効")
        // }
        // console.log("switch_coluｍn ",props.switchColumn)

    }


    // const [isResizing, setIsResizing ] = useState(false) // リザイズ中にSC押すとリサイズしただけ処理が走るを防止
    useEffect(()=>{

        // カラム切り替えをuseEffectの副作用から逃れるために、propsとstateでないStoreに保存
        const store_audio_control = new Store({name: 'store_audio_control'})    // トラックVIEW管理用ストア
        if(!store_audio_control.has('COLUMN')){
            store_audio_control.set('COLUMN',"OFF")
        }else{
            // 2カラムのまま終了したら、フラグがONのままなので、OFFに初期化。
            // useEffect は初回だけ実行なので、この処理も一度だけ働く。
            // useEffect の []を期待通りの働きをしなくなる。なぜそうなるのかは、よくわかっていない。
            store_audio_control.set('COLUMN',"OFF")
        }
        if(!store_audio_control.has('MODE')){
            store_audio_control.set('MODE',"PLAY")
        }else{
            // 2カラムのまま終了したら、フラグがONのままなので、OFFに初期化。
            // useEffect は初回だけ実行なので、この処理も一度だけ働く。
            // useEffect の []を期待通りの働きをしなくなる。なぜそうなるのかは、よくわかっていない。
            store_audio_control.set('MODE',"PLAY")
        }

        let timeoutId

        window.addEventListener('resize', ()=>{
            // console.log("Resizing Now...")
            let ww = window.innerWidth
            // console.log("Resizing Now...",ww)
            setW(ww)
            // setIsResizing(true)
            const ID_audio_player = document.getElementById("audio_player")
            const mode_flag = store_audio_control.get('MODE')
            if( (props.modePlayer) && (mode_flag === "PLAY") ) {
                if ( props.videoFlag){
                    ID_audio_player.style.display ="none"
                } else {
                    ID_audio_player.style.display ="block"
                }
                if ( timeoutId ) return

                timeoutId = setTimeout(  ()=> {
                    timeoutId = 0
                    resize_column_1()   //　1カラムのCSS none block 切り替え処理関数
                    resize_column_2()   //　2カラムのCSS none block 切り替え処理関数
                }, 25 )                 // 25ms毎にリサイズ処理
            }
            // else  if (mode_flag === "HISTORY") {
            //     // console.log("HISTORY")
            // } else  if( (props.modeHistory) && (mode_flag === "SETTING") ) {
            //     // console.log("SETTING")
            // } else {
            //     null
            // }
        })
        // console.log("Resizing Done...")
        // setIsResizing(false)
    },[]) // 初回だけ実行＝初回起動時のStateとpropsをuseEffect内で保持。


    //
    // 翻訳コード
    //
    const [t_01, setT_01 ] = useState("")
    const [t_02, setT_02 ] = useState("")
    const [t_03, setT_03 ] = useState("")
    useEffect(()=>{
        const text_01 = Languages("Mini")
        const text_02 = Languages("SwitchColumn_2")
        const text_03 = Languages("SwitchColumn_1")
        setT_01(text_01)
        setT_02(text_02)
        setT_03(text_03)
    })


    //
    // Shortcut Key
    //
    useHotkeys('q', useCallback(() => minimum()), [ props.miniFlag ])
    useHotkeys('e', useCallback(() => switch_coluｍn()), [ props.switchColumn , props.miniFlag ])


    return (
        <>
        {!(props.videoFlag) && (props.miniFlag === false)
            ?
            <Tooltip title={t_01+" (q)"}>
                <Button
                    size="small"
                    onClick={minimum}
                >
                <ReorderIcon />
                </Button>
            </Tooltip>
            :null
        }
        {
            (w>900)
            ?(props.videoFlag)
                ?null   // ビデオなら一列表示
                :!(props.switchColumn)　// falseなら...
                    ?
                    <Tooltip title={t_02+" (e)"}>
                        <Button onClick={switch_coluｍn} size="small">
                            <div className={AM.icon_mirror}>
                                <VerticalSplitIcon />
                            </div>
                        </Button>
                    </Tooltip>
                    :
                    <Tooltip title={t_03+" (e)"} >
                        <Button onClick={switch_coluｍn} size="small">
                            <div className={AM.icon_mirror}>
                                <ViewStreamIcon/>
                            </div>
                        </Button>
                    </Tooltip>
            :null
        }
        </>
    )
}

export default AudioMinimum;