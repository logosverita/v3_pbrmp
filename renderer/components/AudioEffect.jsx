//React
// import { useReducer, useCallback ,useMemo,useEffect,useState } from 'react';
// ライブラリ
import Store from 'electron-store';
//スタイル群
import EZ from '../style/ez.module.css';
//コンポーネント
//マテリアルUI
//マテリアルUI ICONs

const AudioEffect = (props) => {
    const store_track_view_info = new Store({name: 'store_track_view_info'})    // トラックVIEW管理用ストア

    const current_row = (index) => {
        const playing_uuid = store_track_view_info.get('playing_uuid')
        const uuid = store_track_view_info.get('uuid')

        if ( playing_uuid === uuid[index] ) {
            return true
        }
        else {
            return false
        }
    }





    const start_tag = () => {
        return(
            <div className={EZ.equalizer}>
                <span className={EZ.eq1}></span>
                <span className={EZ.eq2}></span>
                <span className={EZ.eq3}></span>
            </div>
        )
    }
    const stop_tag = () => {
        return(
            <div className={EZ.equalizer}>
                <span className={EZ.eq4}></span>
                <span className={EZ.eq5}></span>
                <span className={EZ.eq6}></span>
            </div>
        )
    }
    const blank_tag = () => {
        return(
            <div className={EZ.equalizer_cell}></div>
        )
    }


    return (
        <>
        {current_row(props.index)
            ?(props.nowPlaying
                ?start_tag()
                :stop_tag()
            )
            :blank_tag()
        }

        </>
    )
}

export default AudioEffect
