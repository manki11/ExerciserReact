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
            const {userScore, userTime, noOfQuestions} = this.props.location.state;
            const {stroke, fill}= this.props.current_user.colorvalue;

            let score = userScore / noOfQuestions * 100;
            let time = Math.ceil(userTime / 60);

            this.setState({
                ...this.state,
                chartData: {
                    ...this.state.chartData,
                    datasets: [
                        {
                            label: this.intl.formatMessage({id: SCORES}),
                            yAxisID: 'A',
                            data: [score],
                            backgroundColor: [
                                {fill},
                            ],
                        },
                        {
                            label: this.intl.formatMessage({id: TIME}),
                            yAxisID: 'B',
                            data: [time],
                            backgroundColor: [
                                {stroke},
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
    return {
        current_user: state.current_user
    }
}

export default injectIntl(withRouter(
    connect(MapStateToProps, {})(Scores)));