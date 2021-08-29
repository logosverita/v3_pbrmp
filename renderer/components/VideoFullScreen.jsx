
//React
import { useState, useEffect , useCallback } from 'react'
// ライブラリ
import { useHotkeys } from 'react-hotkeys-hook';
//スタイル群
//コンポーネント
import Languages from '../components/Languages';
//マテリアルUI
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
//マテリアルUI Icon
import FullscreenIcon from '@material-ui/icons/Fullscreen';

const VideoFullScreen = (props) => {



    const toggleFullScreen = () => {
        console.log(props.videoFlag)
        if ( props.videoFlag ){
            if (!audio_player.fullscreenElement) {
                audio_player.requestFullscreen()
            }
            else {
                if (audio_player.exitFullscreen) {
                    audio_player.exitFullscreen()
                }
            }
        }
    }


    //
    // 翻訳コード
    //
    const [t_01, setT_01 ] = useState("")
    useEffect(()=>{
        const text_01 = Languages("FullScreen")
        setT_01(text_01)
    })

    //
    // Shortcut Key
    //
    useHotkeys('shift + f', useCallback(() => toggleFullScreen()), [props.videoFlag])


    return (
        <>
        {(props.videoSize > 0)
            ?<Tooltip title={t_01+" (Shift + f)"}>
                <Button
                    onClick={toggleFullScreen}
                    size="small"
                >
                    <FullscreenIcon />
                </Button>
            </Tooltip>
            :null
        }
        </>
    )
}

export default VideoFullScreen
