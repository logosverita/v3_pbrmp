// React
import { useState, useEffect , useCallback} from 'react'
// ライブラリ
import { useHotkeys } from 'react-hotkeys-hook';
//スタイル
// コンポーネント
import Languages from './Languages';

// マテリアルUI
import Button from '@material-ui/core/Button';

import Tooltip from '@material-ui/core/Tooltip';
//マテリアルUI Icon
import ReorderIcon from '@material-ui/icons/Reorder';

const AudioMinimumBack = (props) => {


    const minimam_back = () => {
        // console.log(props.miniFlag)
        if( props.miniFlag ){ // SC用条件分岐
            props.setMiniFlag(false)
            window.resizeTo(props.windowSizeWidth,props.windowSizeHeight)
        }
    }

    //
    // 翻訳コード
    //
    const [t_01, setT_01 ] = useState("")
    useEffect(()=>{
        const text_01 = Languages("RestoreWindow")
        setT_01(text_01)
    })

    //
    // Shortcut Key
    //
    useHotkeys('q', useCallback(() => minimam_back()), [ props.miniFlag , props.windowSizeWidth,props.windowSizeHeight ])



    return (
        <>
        {(props.miniFlag)
            ?<Tooltip title={t_01+" (q)"} placement="left" >
                <Button onClick={minimam_back}>
                    <ReorderIcon  />
                </Button>
            </Tooltip>
            :null
        }
        </>
    )
}

export default AudioMinimumBack
