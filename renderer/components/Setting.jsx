
//React
import { useState, useEffect } from 'react'
// ライブラリ
import Store from 'electron-store';
//スタイル
import ST from '../style/setting.module.css';
//コンポーネント
import Languages from '../components/Languages';
//マテリアルUI
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
//マテリアルUI ICONs
import TranslateIcon from '@material-ui/icons/Translate';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import CloseIcon from '@material-ui/icons/Close';



const Setting = (props) => {


    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Volume 関係処理群
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // Volume
    const [ saveVolume, setSaveVolume ] = useState(0.0)
    function loadVolume() {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
            if ( store_audio_control.has('volume')){
                const def_volume = store_audio_control.get('volume')
                return Number(def_volume)
            } else {
                return Number(0.2)
            }
    }
    useEffect(()=>{
        setSaveVolume(loadVolume())
    },[])
    /////////////////////////////////////////////////////////////////////////////////////////////////////


    const handleChange_volume = (event, newValue) => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        setSaveVolume(Number(newValue))
        store_audio_control.set('volume',newValue)
    }
    const handleChange_TC_LR = (event, newValue) => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setLR(Number(newValue))
        store_audio_control.set('LARGE_REPLAY',newValue)
    }
    const handleChange_TC_SR = (event, newValue) => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setSR(Number(newValue))
        store_audio_control.set('SMALL_REPLAY',newValue)
    }
    const handleChange_TC_SF = (event, newValue) => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setSF(Number(newValue))
        store_audio_control.set('SMALL_FORWARD',newValue)
    }
    const handleChange_TC_LF = (event, newValue) => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setLF(Number(newValue))
        store_audio_control.set('LARGE_FORWARD',newValue)
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const marks_pbr_set_STANDARD = [
        {value: 1,label: '1',},
        {value: 2,label: '2',},
        {value: 3},
        {value: 4,label: '4',},
        {value: 5},
        {value: 6},
        {value: 7},
        {value: 8,label: '8',},
        {value: 9},
        {value: 10},
        {value: 11},
        {value: 12},
        {value: 13},
        {value: 14},
        {value: 15},
        {value: 16,label: '16',}
    ]

    const marks_pbr_def_STANDARD  = [
        {value: 0.1},
        {value: 1,label: '1',},
        {value: 2,label: '2',},
        {value: 3},
        {value: 4,label: '4',},
        {value: 5},
        {value: 6},
        {value: 7},
        {value: 8,label: '8',},
        {value: 9},
        {value: 10},
        {value: 11},
        {value: 12},
        {value: 13},
        {value: 14},
        {value: 15},
        {value: 16,label: '16',}
    ]

    const marks_pbr_step = [
        {value: 0.01,label: '0.01'},
        {value: 0.02},
        {value: 0.03},
        {value: 0.04},
        {value: 0.05},
        {value: 0.1},
        {value: 0.2},
        {value: 0.3},
        {value: 0.4},
        {value: 0.5,label: '0.5'},
        {value: 1,label: '1',},
        {value: 2},
        {value: 3},
        {value: 4,label: '4'},
    ]
    const marks_pbr_max_STANDARD = [
        {value: 1,label: '1',},
        {value: 2,label: '2',},
        {value: 3},
        {value: 4,label: '4',},
        {value: 5},
        {value: 6},
        {value: 7},
        {value: 8,label: '8',},
        {value: 9},
        {value: 10},
        {value: 11},
        {value: 12},
        {value: 13},
        {value: 14},
        {value: 15},
        {value: 16,label: '16',}
    ]

    const marks_pbr_min = [
        {value: 0.07,label: '0.07'},
        {value: 0.08},
        {value: 0.09},
        {value: 0.1},
        {value: 0.2},
        {value: 0.3},
        {value: 0.4},
        {value: 0.5,label: '0.5'},
        {value: 1,label: '1',},
    ]
    const marks_vol_def = [
        {value: 0.0,label: '0'},
        {value: 0.1},
        {value: 0.2,label: '0.2'},
        {value: 0.3},
        {value: 0.4},
        {value: 0.5,label: '0.5'},
        {value: 0.6},
        {value: 0.7},
        {value: 0.8},
        {value: 0.9},
        {value: 1.0,label: '1.0'},
    ]
    const marks_TC = [
        {value: 5,},
        {value: 10,},
        {value: 15,},
        {value: 30,},
        {value: 60,},
        {value: 120,},
        {value: 80,label: 'OP/ED'},
        {value: 180,},
        {value: 300,label: '5m'},
        {value: 600,label: '10m'},
        {value: 900,label: '15m'},
    ]
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // PlayBackRate 関係処理群
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    const handleChange_pbr_set_1 = (event, newValue) => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setPBR_set_1(Number(newValue))
        store_audio_control.set('pbr_set_1',newValue)
    }
    const handleChange_pbr_set_2 = (event, newValue) => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setPBR_set_2(Number(newValue))
        store_audio_control.set('pbr_set_2',newValue)
    }
    const handleChange_pbr_default= (event, newValue) => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setPBR_default(Number(newValue))
        store_audio_control.set('pbr_default',newValue)
    }
    const handleChange_pbr_step = (event, newValue) => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setPBR_step(Number(newValue))
        store_audio_control.set('pbr_step',newValue)
    }
    const handleChange_pbr_max = (event, newValue) => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setPBR_max(Number(newValue))
        store_audio_control.set('prb_max',newValue)
    }
    const handleChange_pbr_min = (event, newValue) => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setPBR_min(Number(newValue))
        store_audio_control.set('pbr_min',newValue)
    }


    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const Reset_pbr_set_1 = () => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setPBR_set_1(2.0)
        store_audio_control.set('pbr_set_1',Number("2.0"))
    }
    const Reset_pbr_set_2 = () => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setPBR_set_2(3.0)
        store_audio_control.set('pbr_set_2',Number("3.0"))
    }
    const Reset_pbr_default = () => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setPBR_default(1.0)
        store_audio_control.set('pbr_default',Number("1.0"))
    }
    const Reset_pbr_step = () => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setPBR_step(0.1)
        store_audio_control.set('pbr_default',Number("0.1"))
    }
    const Reset_pbr_max = () => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setPBR_max(4.0)
        store_audio_control.set('prb_max',Number("4.0"))
    }
    const Reset_pbr_min = () => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setPBR_min(0.1)
        store_audio_control.set('pbr_min',Number("0.1"))
    }



    const Reset_volume_value = () => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setSaveVolume(0.2)
        store_audio_control.set('volume',Number("0.2"))
    }


    const Reset_time_controll_LR = () => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setLR(60)
        store_audio_control.set('LARGE_REPLAY',Number("60"))
    }
    const Reset_time_controll_SR = () => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setSR(5)
        store_audio_control.set('SMALL_REPLAY',Number("5"))
    }
    const Reset_time_controll_SF = () => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setSF(5)
        store_audio_control.set('SMALL_FORWARD',Number("5"))
    }
    const Reset_time_controll_LF = () => {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        props.setLF(60)
        store_audio_control.set('LARGE_FORWARD',Number("60"))
    }











    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // AudioForwartRewind 関係処理群
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    function change_timeCtrl(value,opt) {
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        if ( value > 0 ){
            if(opt==="LR"){
                props.setLR(value)
                store_audio_control.set('LARGE_REPLAY',Number(value))

            }else if(opt==="SR"){
                props.setSR(value)
                store_audio_control.set('SMALL_REPLAY',Number(value))

            }else if(opt==="SF"){
                props.setSR(value)
                store_audio_control.set('SMALL_FORWARD',Number(value))


            }else if(opt==="LF"){
                props.setSR(value)
                store_audio_control.set('LARGE_FORWARD',Number(value))
            }else{
                null
            }
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // i18n 関係処理群
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // i18n
    const handleChange_i18n = (event) => {
        props.setLang(event.target.value)
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        store_audio_control.set('LANG',event.target.value)
        // 二列の時に言語変更すると、プロパティの読み込みでバグるので一列にする。
        if(props.switchColumn){
            props.setSwitchColumn(false)
            handleClick()
        }
    }

    const [open, setOpen] = useState(false)

    const handleClick = () => {
        setOpen(true)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return
        }

        setOpen(false)
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // 関係処理群
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    //
    // 翻訳コード
    //
    const [t_01, setT_01 ] = useState("")
    const [t_02, setT_02 ] = useState("")
    const [t_03, setT_03 ] = useState("")
    const [t_04, setT_04 ] = useState("")
    const [t_05, setT_05 ] = useState("")
    const [t_06, setT_06 ] = useState("")
    const [t_07, setT_07 ] = useState("")
    const [t_08, setT_08 ] = useState("")
    const [t_09, setT_09 ] = useState("")
    const [t_10, setT_10 ] = useState("")
    const [t_11, setT_11 ] = useState("")
    const [t_12, setT_12 ] = useState("")
    const [t_13, setT_13 ] = useState("")
    const [t_14, setT_14 ] = useState("")
    const [t_15, setT_15] = useState("")
    const [t_16, setT_16 ] = useState("")
    const [t_17, setT_17 ] = useState("")
    const [t_18, setT_18 ] = useState("")

    useEffect(()=>{
        const text_01 = Languages("Setting")
        const text_02 = Languages("Lang")
        const text_03 = Languages("PBR")
        const text_04 = Languages("Vol")
        const text_05 = Languages("Time")
        const text_06 = Languages("SetLang")
        const text_07 = Languages("UseLang")
        const text_08 = Languages("SetPBR_Set1")
        const text_09 = Languages("SetPBR_Set2")
        const text_10 = Languages("SetPBR_def")
        const text_11 = Languages("SetPBR_step")
        const text_12 = Languages("SetPBR_max")
        const text_13 = Languages("SetPBR_min")
        const text_14 = Languages("SetVol")
        const text_15 = Languages("SetRewind_L")
        const text_16 = Languages("SetRewind_S")
        const text_17 = Languages("SetForward_S")
        const text_18 = Languages("SetForward_L")
        setT_01(text_01)
        setT_02(text_02)
        setT_03(text_03)
        setT_04(text_04)
        setT_05(text_05)
        setT_06(text_06)
        setT_07(text_07)
        setT_08(text_08)
        setT_09(text_09)
        setT_10(text_10)
        setT_11(text_11)
        setT_12(text_12)
        setT_13(text_13)
        setT_14(text_14)
        setT_15(text_15)
        setT_16(text_16)
        setT_17(text_17)
        setT_18(text_18)
    })

    return (
        <>
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={open}
            autoHideDuration={3600}
            onClose={handleClose}
            message="画面配置を初期化しました。"
            action={
                <>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </>
            }
        />

        <div className={ST.grid_container}>
            <div className={ST.sidebar_left}></div>
            <div className={ST.content}>



            {/* 設定 */}
            <div className={ST.title}>{t_01}</div>
            {/* 言語 */}
            <span className={ST.link_title}><a href="#lang">{t_02}</a></span>
            <span className={ST.slash}>/</span>
            {/* 再生速度 */}
            <span className={ST.link_title}><a href="#pbr">{t_03}</a></span>
            <span className={ST.slash}>/</span>
            {/* 音量 */}
            <span className={ST.link_title}><a href="#vol">{t_04}</a></span>
            <span className={ST.slash}>/</span>
            {/* 時間操作 */}
            <span className={ST.link_title}><a href="#time_controll">{t_05}</a></span>
            <span className={ST.slash}>/</span>

            {/* 言語設定 */}
            <div id="lang" className={ST.subtitle}>{t_06}</div>

                <div className={ST.box_wrap}>
                    <div className={ST.box_left}>
                    {/* 使用言語 */}
                    {t_07}
                    </div>
                    <div className={ST.box_right}>
                        <FormControl >
                            <Select
                                startAdornment={
                                    <InputAdornment position="start">
                                    <TranslateIcon />
                                    </InputAdornment>
                                }
                                labelId="lang_i18n"
                                id="lang_i18n"
                                value={props.lang}
                                // defaultValue={"en"}
                                onChange={handleChange_i18n}
                            >
                                <MenuItem value={"en"}>English</MenuItem>
                                <MenuItem value={"it"}>Italiano</MenuItem>
                                <MenuItem value={"et"}>Eesti</MenuItem>
                                <MenuItem value={"nl"}>Nederlands</MenuItem>
                                <MenuItem value={"el"}>Ελληνική</MenuItem>
                                <MenuItem value={"sv"}>Svenska</MenuItem>
                                <MenuItem value={"es"}>Español</MenuItem>
                                <MenuItem value={"sk"}>Slovenská</MenuItem>
                                <MenuItem value={"sl"}>Slovenski</MenuItem>
                                <MenuItem value={"cs"}>Česky</MenuItem>
                                <MenuItem value={"da"}>Dansk</MenuItem>
                                <MenuItem value={"de"}>Deutsch</MenuItem>
                                <MenuItem value={"hu"}>Magyar</MenuItem>
                                <MenuItem value={"fi"}>Suomalainen</MenuItem>
                                <MenuItem value={"fr"}>Français</MenuItem>
                                <MenuItem value={"bg"}>Български</MenuItem>
                                <MenuItem value={"pl"}>Polski</MenuItem>
                                <MenuItem value={"pt"}>Português</MenuItem>
                                <MenuItem value={"lv"}>Latviešu</MenuItem>
                                <MenuItem value={"lt"}>Lietuvių kalba</MenuItem>
                                <MenuItem value={"ro"}>Românesc</MenuItem>
                                <MenuItem value={"ru"}>Русский</MenuItem>
                                <MenuItem value={"zh"}>中文</MenuItem>
                                <MenuItem value={"ja"}>日本語</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>




                {/* 再生速度 */}
                <div id="pbr" className={ST.subtitle}>{t_03}</div>




                    <div className={ST.box_wrap}>
                        <div className={ST.box_left}>
                        {/* 再生速度１を登録する */}
                        {t_08}
                        </div>
                        <div className={ST.box_right}>
                            <div className={ST.box_conf_left}>{props.pbr_set_1}</div>
                            <div className={ST.box_conf_center}>
                                <Slider
                                    value={props.pbr_set_1}
                                    onChange={handleChange_pbr_set_1}
                                    aria-labelledby="setting_pbr_slider"
                                    valueLabelDisplay="auto"
                                    step={null}
                                    marks={marks_pbr_set_STANDARD}
                                    min={1.0}
                                    max={16.0}
                                />
                            </div>
                            <div className={ST.box_conf_right}>
                                <Tooltip title="Reset"><RotateLeftIcon onClick={ Reset_pbr_set_1 }/></Tooltip>
                            </div>
                        </div>
                    </div>



                    <div className={ST.box_wrap}>
                        <div className={ST.box_left}>
                        {/* 再生速度２を登録する */}
                        {t_09}
                        </div>
                        <div className={ST.box_right}>
                            <div className={ST.box_conf_left}>{props.pbr_set_2}</div>
                            <div className={ST.box_conf_center}>
                                <Slider
                                    value={props.pbr_set_2}
                                    onChange={handleChange_pbr_set_2}
                                    aria-labelledby="setting_pbr_slider"
                                    valueLabelDisplay="auto"
                                    step={null}
                                    marks={marks_pbr_set_STANDARD}
                                    min={1.0}
                                    max={16.0}
                                />
                            </div>
                            <div className={ST.box_conf_right}>
                                <Tooltip title="Reset"><RotateLeftIcon onClick={ Reset_pbr_set_2 }/></Tooltip>
                            </div>
                        </div>
                    </div>






                    <div className={ST.box_wrap}>
                        <div className={ST.box_left}>
                        {/* 再生速度の初期値 */}
                        {t_10}
                        </div>
                        <div className={ST.box_right}>
                            <div className={ST.box_conf_left}>{props.pbr_default}</div>
                            <div className={ST.box_conf_center}>
                                <Slider
                                    value={props.pbr_default}
                                    onChange={handleChange_pbr_default}
                                    aria-labelledby="setting_pbr_slider"
                                    valueLabelDisplay="auto"
                                    // step={0.5}
                                    step={null}
                                    marks={marks_pbr_def_STANDARD}
                                    min={0.1}
                                    max={16.0}
                                />
                            </div>
                            <div className={ST.box_conf_right}>
                                <Tooltip title="Reset"><RotateLeftIcon onClick={ Reset_pbr_default }/></Tooltip>
                            </div>
                        </div>
                    </div>






                    <div className={ST.box_wrap}>
                        <div className={ST.box_left}>
                        {/* 再生速度の刻み */}
                        {t_11}
                        </div>
                        <div className={ST.box_right}>
                            <div className={ST.box_conf_left}>{props.pbr_step}</div>
                            <div className={ST.box_conf_center}>
                                <Slider
                                    value={props.pbr_step}
                                    onChange={handleChange_pbr_step}
                                    aria-labelledby="setting_pbr_slider"
                                    valueLabelDisplay="auto"
                                    // step={0.01}
                                    step={null}
                                    marks={marks_pbr_step}
                                    min={0.01}
                                    max={4.0}
                                />
                            </div>
                            <div className={ST.box_conf_right}>
                                <Tooltip title="Reset"><RotateLeftIcon onClick={ Reset_pbr_step }/></Tooltip>
                            </div>
                        </div>
                    </div>


                    <div className={ST.box_wrap}>
                        <div className={ST.box_left}>
                        {/* 再生速度の最大値 */}
                        {t_12}
                        </div>
                        <div className={ST.box_right}>
                            <div className={ST.box_conf_left}>{props.pbr_max}</div>
                            <div className={ST.box_conf_center}>
                                <Slider
                                    value={props.pbr_max}
                                    onChange={handleChange_pbr_max}
                                    aria-labelledby="setting_pbr_slider"
                                    valueLabelDisplay="auto"
                                    step={null}
                                    marks={marks_pbr_max_STANDARD}
                                    min={1}
                                    max={16}
                                />
                            </div>
                            <div className={ST.box_conf_right}>
                                <Tooltip title="Reset"><RotateLeftIcon onClick={ Reset_pbr_max }/></Tooltip>
                            </div>
                        </div>
                    </div>


                    <div className={ST.box_wrap}>
                        <div className={ST.box_left}>
                        {/* 再生速度の最小値 */}
                        {t_13}
                        </div>
                        <div className={ST.box_right}>
                            <div className={ST.box_conf_left}>{props.pbr_min}</div>
                            <div className={ST.box_conf_center}>
                                <Slider
                                    value={props.pbr_min}
                                    onChange={handleChange_pbr_min}
                                    aria-labelledby="setting_pbr_slider"
                                    valueLabelDisplay="auto"
                                    // step={0.01}
                                    step={null}
                                    marks={marks_pbr_min}
                                    min={0.07}
                                    max={1}
                                />
                            </div>
                            <div className={ST.box_conf_right}>
                                <Tooltip title="Reset"><RotateLeftIcon onClick={ Reset_pbr_min }/></Tooltip>
                            </div>
                        </div>
                    </div>






                {/* 音量 */}
                <div id="vol" className={ST.subtitle}>
                    {t_04}
                </div>



                    <div className={ST.box_wrap}>
                        <div className={ST.box_left}>
                            {/* 音量の設定 */}
                            {t_14}
                        </div>
                        <div className={ST.box_right}>
                            <div className={ST.box_conf_left}>
                                {/* {(saveVolume >= 0.5 )?<VolumeUp />:null}
                                {(saveVolume >= 0.15 && saveVolume < 0.5 )?<VolumeDown />:null}
                                {(saveVolume !== 0 && saveVolume < 0.15 )?<VolumeMuteIcon />:null}
                                {(saveVolume === 0)?<VolumeOffIcon />:null} */}
                                {saveVolume}
                            </div>
                            <div className={ST.box_conf_center}>
                                <Slider
                                    value={saveVolume}
                                    onChange={handleChange_volume}
                                    aria-labelledby="setting_volume_slider"
                                    valueLabelDisplay="auto"
                                    step={null}
                                    marks={marks_vol_def}
                                    min={0}
                                    max={1}
                                />
                            </div>
                            <div className={ST.box_conf_right}>
                                <Tooltip title="Reset"><RotateLeftIcon onClick={ Reset_volume_value }/></Tooltip>
                            </div>
                            </div>
                    </div>






                    <div id="time_controll" className={ST.subtitle}>
                        {/* 時間操作 */}
                        {t_05}
                    </div>




                    <div className={ST.box_wrap}>
                        <div className={ST.box_left}>
                            {/* 巻き戻し（大） */}
                            {t_15}
                        </div>
                        <div className={ST.box_right}>
                            <div className={ST.box_conf_left}>{props.LR}</div>
                            <div className={ST.box_conf_center}>
                                <Slider
                                    defaultValue={props.LR}
                                    value={props.LR}
                                    onChange={handleChange_TC_LR}
                                    aria-labelledby="setting_time_controll_slider"
                                    valueLabelDisplay="auto"
                                    step={null}
                                    marks={marks_TC}
                                    min={5}
                                    max={900}
                                    />
                            </div>
                            <div className={ST.box_conf_right}>
                                <Tooltip title="Reset"><RotateLeftIcon onClick={ Reset_time_controll_LR }/></Tooltip>
                            </div>
                        </div>
                    </div>


                    <div className={ST.box_wrap}>
                        <div className={ST.box_left}>
                            {/* 巻き戻し（小） */}
                            {t_16}
                        </div>
                        <div className={ST.box_right}>
                            <div className={ST.box_conf_left}>{props.SR}</div>
                            <div className={ST.box_conf_center}>
                                <Slider
                                    defaultValue={props.SR}
                                    value={props.SR}
                                    onChange={handleChange_TC_SR}
                                    aria-labelledby="setting_time_controll_slider"
                                    valueLabelDisplay="auto"
                                    step={null}
                                    marks={marks_TC}
                                    min={5}
                                    max={900}
                                />
                            </div>
                            <div className={ST.box_conf_right}>
                                <Tooltip title="Reset"><RotateLeftIcon onClick={ Reset_time_controll_SR }/></Tooltip>
                            </div>
                        </div>
                    </div>



                    <div className={ST.box_wrap}>
                        <div className={ST.box_left}>
                            {/* 早送り（小） */}
                            {t_17}
                        </div>
                        <div className={ST.box_right}>
                            <div className={ST.box_conf_left}>{props.SF}</div>
                            <div className={ST.box_conf_center}>
                            <Slider
                                defaultValue={props.SF}
                                value={props.SF}
                                onChange={handleChange_TC_SF}
                                aria-labelledby="setting_time_controll_slider"
                                valueLabelDisplay="auto"
                                step={null}
                                marks={marks_TC}
                                min={5}
                                max={900}
                            />
                            </div>
                            <div className={ST.box_conf_right}>
                                <Tooltip title="Reset"><RotateLeftIcon onClick={ Reset_time_controll_SF }/></Tooltip>
                            </div>
                        </div>
                    </div>



                    <div className={ST.box_wrap}>
                        <div className={ST.box_left}>
                            {/* 早送り（大） */}
                            {t_18}
                        </div>
                        <div className={ST.box_right}>
                            <div className={ST.box_conf_left}>{props.LF}</div>
                            <div className={ST.box_conf_center}>
                            <Slider
                                defaultValue={props.LF}
                                value={props.LF}
                                onChange={handleChange_TC_LF}
                                aria-labelledby="setting_time_controll_slider"
                                valueLabelDisplay="auto"
                                step={null}
                                marks={marks_TC}
                                min={5}
                                max={900}
                            />
                            </div>
                            <div className={ST.box_conf_right}>
                                <Tooltip title="Reset"><RotateLeftIcon onClick={ Reset_time_controll_LF }/></Tooltip>
                            </div>
                        </div>
                    </div>


            </div>





            <div className={ST.sidebar_right}></div>
        </div>
        </>
    )
}

export default Setting

