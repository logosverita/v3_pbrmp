
//React
import { useState, useEffect } from 'react'
// ライブラリ
// import Store from 'electron-store';
//スタイル
//コンポーネント
import Languages from '../components/Languages';
//マテリアルUI

//マテリアルUI Icon
const VideoSizeChanger = (props) => {


    useEffect( () => {
        window.addEventListener('resize', ()=>{
            // console.log("Width:" + window.innerWidth)
            // console.log("Height:" + window.innerHeight)
            if ( props.videoFlag === true ){
                // const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
                let width_size = window.innerWidth*0.55-116
                width_size = width_size.toFixed(0)
                props.setVideoSize(width_size)
                // store_audio_control.set('VIDEO_SIZE',Number(width_size))
            }
        })
    })

    //
    // 翻訳コード
    //

    return (
        <>
        </>
    )
}

export default VideoSizeChanger;