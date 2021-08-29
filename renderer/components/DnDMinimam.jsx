//React
import { useState, useEffect , useCallback} from 'react'
// ライブラリ
import Store from 'electron-store';
import { useHotkeys } from 'react-hotkeys-hook';
//スタイル群
import TV from '../style/track_view.module.css';
//コンポーネント
import Languages from '../components/Languages';
//マテリアルUI
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
//マテリアルUI ICONs
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';


const DnDMinimam = (props) => {

    const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
    const flag = store_audio_control.get('FOLD')
    // 他画面から戻ってきたらFlodの状態復帰する。
    useEffect(()=>{
        if(flag){
            // console.log("useEffect", flag)
            const ID_dnd_area = document.getElementById("dnd_area")
            ID_dnd_area.style.display ="none"
        }else{
            // console.log("useEffect", flag)
            const ID_dnd_area = document.getElementById("dnd_area")
            ID_dnd_area.style.display ="block"
        }
    },[flag])

    const minimam = () => {
        // console.log("minimam")
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        const ID_dnd_area = document.getElementById("dnd_area")
        if(props.dndMiniFlag){
            // console.log("minimam IF")
            props.setDnDMiniFlag(false)
            ID_dnd_area.style.display ="none"
            store_audio_control.set('FOLD',true) // Flagが真ならストアに真で保存。同期。
        } else {
            // console.log("minimam ELSE")
            props.setDnDMiniFlag(true)
            ID_dnd_area.style.display ="block"
            store_audio_control.set('FOLD',false)
        }
        // console.log("----------------------------")
    }

    //
    // 翻訳コード
    //
    const [t_01, setT_01 ] = useState("")
    const [t_02, setT_02 ] = useState("")
    useEffect(()=>{
        const text_01 = Languages("Fold")
        const text_02 = Languages("Extend")
        setT_01(text_01)
        setT_02(text_02)
    })

    //
    // Shortcut Key
    //
    useHotkeys('w', useCallback(() => minimam()), [ props.dndMiniFlag ])

    return (
        <>
        {props.dndMiniFlag
        ?
        <Tooltip title={t_01+" (w)"}>
            <Button onClick={minimam}　size="small">
                <VerticalAlignTopIcon className={TV.icon}　fontSize="small"/>
            </Button>
        </Tooltip>
        :
        <Tooltip title={t_02+" (w)"}>
            <Button onClick={minimam}　size="small">
                <VerticalAlignBottomIcon className={TV.icon}　fontSize="small"/>
            </Button>
        </Tooltip>
        }
        </>
    )
}

export default DnDMinimam

