//React
import { useState, useEffect , useCallback } from 'react'
// ライブラリ
import Store from 'electron-store';
import { useHotkeys } from 'react-hotkeys-hook';
//スタイル群
//コンポーネント
import Languages from '../components/Languages';
//マテリアルUI
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';

//マテリアルUI Icon
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';

const AudioPlayPause = (props) => {

    const [t_01, setT_01 ] = useState("")
    const [t_02, setT_02 ] = useState("")


    useEffect(() => {

        audio_player.addEventListener('play', () => {
            props.setNowPlaying(true)
        })
        audio_player.addEventListener('pause', () => {
            props.setNowPlaying(false)
        })
        if ( props.playRequest){
            props.setPlayRequest(false)
            audio_control_play()
        }

        //
        // 翻訳コード
        //
        const text_01 = Languages("Pause")
        const text_02 = Languages("Play")
        setT_01(text_01)
        setT_02(text_02)


    })




    //
    // オーディオコントロール機能群
    //
    const audio_control_play = () => {
        if ( props.onLoad ) { //メディアが読み込み完了したらトラック情報からblobを読み込む。
            if (audio_player.currentTime === 0){
                const store_TRACK_LIST_ALL_INFO = new Store({name: 'tracklist_all_info'})   // トラックリスト全体情報ストア
                const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア
                const track_info = store_track_view_info.get('tracks')
                const track_uuid = store_track_view_info.get('uuid')
                const current_track_id = store_track_view_info.get('current_id')
                const track_name = track_info[current_track_id]
                const track_INFO = store_TRACK_LIST_ALL_INFO.get(track_name)
                store_track_view_info.set('playing_uuid',track_uuid[current_track_id])

                audio_player.src = track_INFO.track_blob
            }

            // audio_player.play()
            // Fix Code
            var playPromise = audio_player.play()
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                  // Automatic playback started!
                  // Show playing UI.
                    audio_player.playbackRate = props.pb_Rate
                })
                .catch(error => {
                  // Auto-play was prevented
                  // Show paused UI.
                })
            }
        }
    }

    const audio_control_playpause_toggle = () => {
        if ( props.onLoad ) { //メディアが読み込み完了したらトラック情報からblobを読み込む。
            if( props.nowPlaying ){
                // console.log("再生中->停止します")
                audio_player.pause()
            }else{
                // console.log("停止中->再生します")
                if (audio_player.currentTime === 0){
                    const store_TRACK_LIST_ALL_INFO = new Store({name: 'tracklist_all_info'})   // トラックリスト全体情報ストア
                    const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア
                    const track_info = store_track_view_info.get('tracks')
                    const track_uuid = store_track_view_info.get('uuid')
                    const current_track_id = store_track_view_info.get('current_id')
                    const track_name = track_info[current_track_id]
                    const track_INFO = store_TRACK_LIST_ALL_INFO.get(track_name)
                    store_track_view_info.set('playing_uuid',track_uuid[current_track_id])

                    audio_player.src = track_INFO.track_blob
                }
                // audio_player.play()
                // Fix Code
                var playPromise = audio_player.play()
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                    // Automatic playback started!
                    // Show playing UI.
                        audio_player.playbackRate = props.pb_Rate
                    })
                    .catch(error => {
                    // Auto-play was prevented
                    // Show paused UI.
                    })
                }
            }
        }
    }

    //
    // Shortcut Key
    //
    useHotkeys('k, space', useCallback(() => audio_control_playpause_toggle()), [ props.onLoad , props.nowPlaying ])




    return (
        <>
        {props.nowPlaying
            ?<Tooltip title={t_01+" (space/k)"}>
                <Button  size="large" onClick={audio_control_playpause_toggle}  >
                    <PauseRoundedIcon fontSize="large" style={{ color: '#0984E3' }}/>
                </Button>
            </Tooltip>
            :<Tooltip title={t_02+" (space/k)"}>
                <Button size="large" onClick={audio_control_playpause_toggle} >
                    <PlayArrowRoundedIcon fontSize="large" style={{ color: '#0984E3' }}/>
                </Button>
            </Tooltip>
        }
        </>
    )
}

export default AudioPlayPause;


