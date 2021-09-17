//React
import { useState, useEffect } from 'react'
// ライブラリ
import Store from 'electron-store';
// コンポーネント
import Languages from './Languages';
//マテリアルUI
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


export const Notification = () => {

    const [open_snack, setOpen_snack] = useState(false)

    const handleClose_snack = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpen_snack(false)
    }


    const [ bootMessage , setBootMessage ] = useState("")
    useEffect(() => {
        //
        // 翻訳コード
        //
        const store_audio_control = new Store({name: 'store_audio_control'})    // 早送り巻き戻し管理ストア
        const boots_count = store_audio_control.get('BOOT')
        if(boots_count === 1){
            const message = Languages("boot_count_01")
            setBootMessage(message)
            setOpen_snack(true)

        } else if ( boots_count === 10 ) {
            const message = Languages("boot_count_10")
            setBootMessage(message)
            setOpen_snack(true)

        } else if ( boots_count === 50 ) {
            const message = Languages("boot_count_50")
            setBootMessage(message)
            setOpen_snack(true)

        } else if ( boots_count === 100 ) {
            const message = Languages("boot_count_100")
            setBootMessage(message)
            setOpen_snack(true)

        } else {
            console.log(boots_count)
        }
    }, [])

    return (
        <>
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={open_snack}
                autoHideDuration={10000}
                onClose={handleClose_snack}
                message={bootMessage}
                action={
                    <>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose_snack}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    </>
                }
            />
        </div>
        </>
    )
}

export default Notification;