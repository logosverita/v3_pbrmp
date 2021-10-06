// React
import { react, useState, useEffect } from 'react';
// ライブラリ
import ApexCharts from 'apexcharts';
//スタイル
import AM from '../style/archvement.module.css';
// コンポーネント

// マテリアルUI
//マテリアルUI Icon
const Archivement = () => {
    class ApexChart extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
            
                series: [{
                    name: 'Metric1',
                    data: generateData(18, {
                    min: 0,
                    max: 90
                    })
                },
                {
                    name: 'Metric2',
                    data: generateData(18, {
                    min: 0,
                    max: 90
                    })
                },
                {
                    name: 'Metric3',
                    data: generateData(18, {
                    min: 0,
                    max: 90
                    })
                },
                {
                    name: 'Metric4',
                    data: generateData(18, {
                    min: 0,
                    max: 90
                    })
                },
                {
                    name: 'Metric5',
                    data: generateData(18, {
                    min: 0,
                    max: 90
                    })
                },
                {
                    name: 'Metric6',
                    data: generateData(18, {
                    min: 0,
                    max: 90
                    })
                },
                {
                    name: 'Metric7',
                    data: generateData(18, {
                    min: 0,
                    max: 90
                    })
                },
                {
                    name: 'Metric8',
                    data: generateData(18, {
                    min: 0,
                    max: 90
                    })
                },
                {
                    name: 'Metric9',
                    data: generateData(18, {
                    min: 0,
                    max: 90
                    })
                }
                ],
                options: {
                    chart: {
                    height: 350,
                    type: 'heatmap',
                    },
                    dataLabels: {
                    enabled: false
                    },
                    colors: ["#008FFB"],
                    title: {
                    text: 'HeatMap Chart (Single color)'
                    },
                },
            }
        }
    }
    return (
        <>
        <div id="chart">
            <ReactApexChart options={this.state.options} series={this.state.series} type="heatmap" height={350} />
        </div>
        </>
    )
}

export default Archivement
