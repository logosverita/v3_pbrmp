// React
import { useState, useEffect ,useCallback } from 'react'
// ライブラリ
import Store from 'electron-store';
import { useHotkeys } from 'react-hotkeys-hook';
//スタイル群
// コンポーネント群
import Languages from '../components/Languages';
// マテリアルUI
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
//マテリアルUI Icon
import ShuffleIcon from '@material-ui/icons/Shuffle';
import RepeatIcon from '@material-ui/icons/Repeat';
import RepeatOneIcon from '@material-ui/icons/RepeatOne';


const AudioShuffleRepeat = (props) => {
    const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア
    // オーディオ再生のフラグだけ管理する
    const audio_shuffle = () => {
        if( !props.repeatOn ) { // リピートフラグがオフなら有効
            let flag = !props.shuffleOn
            props.setShuffleOn(flag)
        }
    }
    const audio_repeat = () => {
        if( !props.shuffleOn ) {  // シャッフルフラグがオフなら有効
            let flag = !props.repeatOn
            props.setRepeatOn(flag)
        }
    }

    //
    // 翻訳コード
    //
    const [t_01, setT_01 ] = useState("")
    const [t_02, setT_02 ] = useState("")
    useEffect(()=>{
        const text_01 = Languages("Shuffle")
        const text_02 = Languages("Repeat")
        setT_01(text_01)
        setT_02(text_02)
    })


    //
    // Shortcut Key
    //
    useHotkeys('t', useCallback(() => audio_shuffle()), [ props.repeatOn , props.shuffleOn ])
    useHotkeys('r', useCallback(() => audio_repeat()), [ props.repeatOn , props.shuffleOn ])



    return (
        <>

            <Tooltip title={t_02+" (r)"}>
            <Button onClick={ audio_repeat }  >
                {props.repeatOn
                    ?<RepeatOneIcon variant="contained" color="primary"　fontSize="small"/>
                    :<RepeatIcon fontSize="small"/>
                }
            </Button>
            </Tooltip>

            <Tooltip title={t_01+" (t)"}>
            <Button onClick={ audio_shuffle }  >
                {props.shuffleOn
                    ?<ShuffleIcon variant="contained" color="primary"　fontSize="small"/>
                    :<ShuffleIcon fontSize="small"/>
                }
            </Button>
            </Tooltip>
        </>
    )
}

export default AudioShuffleRepeat;
