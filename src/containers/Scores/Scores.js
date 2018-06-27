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
                    fontSize: 40
                },
                legend: {
                    position: 'right'
                },
                scales: {
                    yAxes: [{
                        id: 'A',
                        type: 'linear',
                        position: 'left',
                        ticks: {
                            beginAtZero: true,
                            min: 0,
                            max: 100
                        }
                    },{
                        id: 'B',
                        type: 'linear',
                        position: 'right',
                        ticks:{
                            beginAtZero: true,
                            min: 0
                        }
                    }],
                    xAxes: [{
                        // Change here
                        barThickness: 50,
                        ticks:{
                            fontSize: 25
                        }
                    }]
                }
            }
        }
    }

    componentDidMount() {
        if (this.props.location) {
            const {scores, userScore, times, userTime, noOfQuestions} = this.props.location.state;
            let avgScore = 0, avgTime=0;
            if (scores.length) {
                let sum = scores.reduce(function (a, b) {
                    return a + b;
                });
                avgScore = sum / scores.length;
                avgScore = Math.round(avgScore);
                avgScore= avgScore / noOfQuestions * 100;

                let score= userScore / noOfQuestions * 100;

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
                                label: 'Scores (%)',
                                yAxisID: 'A',
                                data: [avgScore, score],
                                backgroundColor: [
                                    '#C0392B',
                                    '#C0392B',
                                ],
                            },
                            {
                                label: 'Time (Minutes)',
                                yAxisID: 'B',
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