// React
import { react, useState, useEffect } from 'react';
// ライブラリ
import CalendarHeatmap from '@hackclub/react-calendar-heatmap'
//スタイル
import AM from '../style/archvement.module.css';
import '@hackclub/react-calendar-heatmap/dist/styles.css'
// コンポーネント

// マテリアルUI
//マテリアルUI Icon
const Archivement = () => {

    const date = [
        { date: '2021-01-01', count: 1222 },
        { date: '2021-01-02', count: 12 },
        { date: '2021-01-03', count: 12 },
        { date: '2021-01-22', count: 122 },
        { date: '2021-01-30', count: 38 },
        { date: '2021-12-30', count: 38 },
        { date: '2021-12-30', count: 38 },
    ]
    return (
        <>
        <div className={AM.heatmap}>
            <div>2021</div>
            <CalendarHeatmap
                startDate={new Date('2021-01-01')}
                endDate={new Date('2021-12-31')}
                showWeekdayLabels={true}
                showOutOfRangeDays={true}
                values={date}
                onMouseOver={ ( event, value ) =>{ value?console.log(value.date, value.count):null}}
            />
        </div>

        <div>実績</div>
        </>
    )
}

export default Archivement
