import React, {Component} from "react"
import {Bar, Line, Pie} from 'react-chartjs-2';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {addScore} from "../../store/actions/exercises";


class Scores extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chartData: {
                labels: ['Average', 'User'],
                datasets: []
            },
            options: {
                title: {
                    display: true,
                    text: "Your Results",
                    fontSize: 25
                },
                legend: {
                    position: 'right'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            min: 0,
                            max: 10
                        }
                    }],
                    xAxes: [{
                        // Change here
                        barThickness: 100
                    }]
                }
            }
        }
    }

    componentDidMount() {
        if (this.props.location) {
            const {scores, userScore, times, userTime} = this.props.location.state;
            let avgScore = 0, avgTime=0;
            if (scores.length) {
                let sum = scores.reduce(function (a, b) {
                    return a + b;
                });
                avgScore = sum / scores.length;
                avgScore = Math.round(avgScore);

                let timeSum= times.reduce(function (a, b) {
                    return a + b;
                });
                avgTime= timeSum/ times.length;
                avgTime= Math.ceil(avgTime/60);
                let time= Math.ceil(userTime/60);

                this.setState({
                    ...this.state,
                    chartData: {
                        ...this.state.chartData,
                        datasets: [
                            {
                                label: 'Scores',
                                data: [avgScore, userScore],
                                backgroundColor: [
                                    '#C0392B',
                                    '#C0392B',
                                ],
                            },
                            {
                                label: 'Time (Minutes)',
                                data:[avgTime,time],
                                backgroundColor: [
                                    '#2980B9',
                                    '#2980B9',
                                ]
                            }]
                    }
                })
            }
        }
    }


    render() {
        return (
            <div>
                <Bar
                    data={this.state.chartData}
                    options={this.state.options}
                />
            </div>
        )
    }
}

function MapStateToProps(state) {
    return {}
}

export default withRouter(
    connect(MapStateToProps, {})(Scores));