import React, {Component} from "react"
import {Bar, Line, Pie} from 'react-chartjs-2';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {addScore} from "../../store/actions/exercises";
import {injectIntl, intlShape, FormattedRelative} from 'react-intl';
import {SCORES, TIME, YOUR_RESULTS, AVERAGE} from "../translation";
import "../../css/Scores.css"


class Scores extends Component {

    constructor(props) {
        super(props);

        let {intl} = this.props;
        this.intl = intl;

        this.state = {
            chartData: {
                labels: [
                    intl.formatMessage({id: AVERAGE}),
                    "User"
                ],
                datasets: []
            },
            options: {
                title: {
                    display: true,
                    text: intl.formatMessage({id: YOUR_RESULTS}),
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
                    }, {
                        id: 'B',
                        type: 'linear',
                        position: 'right',
                        ticks: {
                            beginAtZero: true,
                            min: 0
                        }
                    }],
                    xAxes: [{
                        // Change here
                        barThickness: 50,
                        ticks: {
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
            let avgScore = 0, avgTime = 0;
            let sum = scores.reduce(function (a, b) {
                return a + b;
            });
            avgScore = sum / scores.length;
            avgScore = Math.round(avgScore);
            avgScore = avgScore / noOfQuestions * 100;

            let score = userScore / noOfQuestions * 100;

            let timeSum = times.reduce(function (a, b) {
                return a + b;
            });
            avgTime = timeSum / times.length;
            avgTime = Math.ceil(avgTime / 60);
            let time = Math.ceil(userTime / 60);

            this.setState({
                ...this.state,
                chartData: {
                    ...this.state.chartData,
                    datasets: [
                        {
                            label: this.intl.formatMessage({id: SCORES}),
                            yAxisID: 'A',
                            data: [avgScore, score],
                            backgroundColor: [
                                '#C0392B',
                                '#C0392B',
                            ],
                        },
                        {
                            label: this.intl.formatMessage({id: TIME}),
                            yAxisID: 'B',
                            data: [avgTime, time],
                            backgroundColor: [
                                '#2980B9',
                                '#2980B9',
                            ]
                        }]
                }
            })
        }
    }

    redo = () => {
        const {type, exercise} = this.props.location.state;
        if (type === 'MCQ') {
            this.props.history.push('/play/mcq', {exercise: exercise})
        }
        if (type === 'CLOZE') {
            this.props.history.push('/play/cloze', {exercise: exercise})
        }
        if (type === 'REORDER') {
            this.props.history.push('/play/reorder', {exercise: exercise})
        }
    };

    render() {
        return (
            <div>
                <Bar
                    data={this.state.chartData}
                    options={this.state.options}
                />
                <div className="row button-container">
                    <button className="button-redo" onClick={this.redo}/>
                </div>
            </div>
        )
    }
}

function MapStateToProps(state) {
    return {}
}

export default injectIntl(withRouter(
    connect(MapStateToProps, {})(Scores)));