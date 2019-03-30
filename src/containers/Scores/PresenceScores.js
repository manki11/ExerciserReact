import React, {Component} from "react"
import {Bar, Line, Pie} from 'react-chartjs-2';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import {SCORES, TIME, YOUR_RESULTS} from "../translation";
import "../../css/PresenceScores.css"


class PresenceScores extends Component {

    constructor(props) {
        super(props);

        let {intl} = this.props;
        this.intl = intl;

        this.state = {
            score: true,
            time: false,
            answer: false,
            results: [],
            chartScores: {
                chartData: {},
                options: {
                    title: {
                        display: true,
                        text: intl.formatMessage({id: YOUR_RESULTS}),
                        fontSize: 40
                    },
                    legend: {
                        display: false,
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
                        }],
                        xAxes: [{
                            barThickness: 30,
                            ticks: {
                                fontSize: 15
                            }
                        }]
                    }
                }
            },
            chartTimes: {
                chartData: {},
                options: {
                    title: {
                        display: true,
                        text: intl.formatMessage({id: YOUR_RESULTS}),
                        fontSize: 40
                    },
                    legend: {
                        display: false,
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
                                max: 10,
                                gridLines: {
                                    drawTicks: false,
                                }
                            }
                        }],
                        xAxes: [{
                            barThickness: 30,
                            ticks: {
                                fontSize: 15
                            }
                        }]
                    }
                }

            }
        }
    }

    compare_score = (a, b) => {
        if (a.score < b.score) {
            return 1;
        }
        if (b.score < a.score) {
            return -1;
        }
        return 0;
    };

    compare_time = (a, b) => {
        if (a.time > b.time) {
            return 1;
        }
        if (b.time < a.time) {
            return -1;
        }
        return 0;
    };

    componentWillReceiveProps() {
        if (this.props.location) {
            this.setChart();
        }
    }

    componentDidMount() {
        if (this.props.location) {
            this.setChart();
        }
    }

    setChart = () => {
        const {exercise} = this.props.location.state;
        const {score, time} = this.state;

        const {shared_results} = exercise;

        let users = [];
        let strokes = [];
        let fills = [];
        let scores = [];
        let times = [];
        let results = [];

        if (score) shared_results.sort(this.compare_score);
        else shared_results.sort(this.compare_time);

        console.log(shared_results);

        shared_results.map((result, index) => {
            users.push(result.user.name);
            strokes.push(result.user.colorvalue.stroke);
            fills.push(result.user.colorvalue.fill);
            scores.push(result.score);
            times.push(result.time);

            let r = {
                user: result.user.name,
                score: result.score,
                time: result.time,
                scoreSheet: result.scoreSheet
            };
            results.push(r)
        });

        if (score) {
            this.setState({
                ...this.state,
                results: results,
                chartScores: {
                    ...this.state.chartScores,
                    chartData: {
                        labels: users,
                        datasets: [
                            {
                                label: this.intl.formatMessage({id: SCORES}),
                                yAxisID: 'A',
                                data: scores,
                                backgroundColor: fills,
                                borderColor: strokes,
                                borderWidth: 5
                            }]
                    }
                }
            })
        } else {
            this.setState({
                ...this.state,
                chartTimes: {
                    ...this.state.chartTimes,
                    chartData: {
                        labels: users,
                        datasets: [
                            {
                                label: this.intl.formatMessage({id: TIME}),
                                yAxisID: 'A',
                                data: times,
                                backgroundColor: fills,
                                borderColor: strokes,
                                borderWidth: 5
                            }]
                    }
                }
            })
        }
    };

    score = () => {
        this.setState({
            score: true,
            time: false,
            answer: false,
        }, () => {
            this.setChart();
        })
    };

    time = () => {
        this.setState({
            score: false,
            time: true,
            answer: false,
        }, () => {
            this.setChart();
        })
    };

    answer = () => {
        this.setState({
            score: false,
            time: false,
            answer: true,
        })
    };

    showResult = (i) => {
        const {results} = this.state;
        const {exercise} = this.props.location.state;

        let result = results[i];

        if (exercise.type === "MCQ") {
            this.props.history.push('/result/mcq', {
                userScore: result.score,
                userTime: result.time,
                noOfQuestions: exercise.questions.length,
                exercise: exercise,
                scoreSheet: result.scoreSheet,
                type: "MCQ",
                isPresence: true
            });
        }
    };

    render() {

        let score_active = "";
        let time_active = "";
        let answer_active = "";

        if (this.state.score)
            score_active = "active";
        else if (this.state.time)
            time_active = "active";
        else
            answer_active = "active";

        let score = (<button type="button" className={"score-button " + score_active} onClick={this.score}/>);
        let time = (<button type="button" className={"time-button " + time_active} onClick={this.time}/>);
        let answer = (<button type="button" className={"answer-button " + answer_active} onClick={this.answer}/>)

        let body = "";
        let chart = "";
        let list = "";

        if (this.state.score)
            chart = (<Bar data={this.state.chartScores.chartData} options={this.state.chartScores.options}/>);
        else
            chart = (<Bar data={this.state.chartTimes.chartData} options={this.state.chartTimes.options}/>);

        if (this.state.score || this.state.time) body = chart;
        else body = this.state.results.map((result, i) => {
            return (
                    <div className="col-sm-5">
                        <div className="jumbotron">
                            <div className="col-sm-6">
                                <p style={{fontSize: "20px"}}>{result.user}</p>
                            </div>
                            <div className="col-sm-4">
                                <button type="button" className={"answer-button"} onClick={() => this.showResult(i)}/>
                            </div>
                        </div>
                    </div>
            )
        });

        return (
            <div className="container">
                <div className="container-fluid">
                    <div className="row">
                        {score}
                        {time}
                        {answer}
                        <div className="container-fluid">
                        {body}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function MapStateToProps(state) {
    return {}
}

export default injectIntl(withRouter(
    connect(MapStateToProps, {})(PresenceScores)));