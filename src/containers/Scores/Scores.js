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
            const {scores, userScore} = this.props.location.state;
            let avg = 0;
            if (scores.length) {
                let sum = scores.reduce(function (a, b) {
                    return a + b;
                });
                avg = sum / scores.length;
                avg = Math.round(avg * 100) / 100;
                this.setState({
                    ...this.state,
                    chartData: {
                        ...this.state.chartData,
                        datasets: [
                            {
                                label: 'Scores',
                                data: [avg, userScore],
                                backgroundColor: [
                                    '#C0392B',
                                    '#C0392B',
                                ],
                            },
                            {
                                label: 'Time (Minutes)',
                                data:[3,5],
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