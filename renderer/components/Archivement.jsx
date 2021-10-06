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
    return (
        <>
        <div className={AM.heatmap}>
            <CalendarHeatmap
                startDate={new Date('2021-01-01')}
                endDate={new Date('2021-12-31')}
                showWeekdayLabels={true}
                values={[
                    { date: '2021-01-01', count: 12 },
                    { date: '2021-01-22', count: 122 },
                    { date: '2021-01-30', count: 38 },
                    // ...and so on
                ]}
            />
        </div>
        </>
    )
}

export default Archivement
