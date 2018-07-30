import React, {Component} from "react"
import {Bar, Line, Pie} from 'react-chartjs-2';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import {SCORES, TIME} from "../translation";


class PresenceScores extends Component {

    constructor(props) {
        super(props);

        let {intl} = this.props;
        this.intl = intl;

        this.state={
            chartScores:{
                chartData:{},
                options: {
                    title: {
                        display: true,
                        text: intl.formatMessage({id: SCORES}),
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

    componentWillReceiveProps(){
        if (this.props.location) {
            const {exercise}= this.props.location.state;
            console.log(exercise.shared_results);

            const {shared_results}= exercise;

            let users=[];
            let strokes=[];
            let fills=[];
            let scores=[];
            let times=[];

            shared_results.map((result,index)=>{
                users.push(result.user.name);
                strokes.push(result.user.colorvalue.stroke);
                fills.push(result.user.colorvalue.fill);
                scores.push(result.score);
                times.push(result.time);
            });

            this.setState({
                ...this.state,
                chartScores:{
                    chartData: {
                        labels:users,
                        datasets: [
                            {
                                label: this.intl.formatMessage({id: SCORES}),
                                yAxisID: 'A',
                                data: scores,
                                backgroundColor: fills,
                                borderColor:strokes,
                                borderWidth: 5
                            }]
                    }
                }
            })
        }
    }

    componentDidMount() {
        console.log("presence score mounted");
        
        if (this.props.location) {
            const {exercise}= this.props.location.state;
            console.log(exercise.shared_results);

            const {shared_results}= exercise;

            let users=[];
            let strokes=[];
            let fills=[];
            let scores=[];
            let times=[];

            shared_results.map((result,index)=>{
                users.push(result.user.name);
                strokes.push(result.user.colorvalue.stroke);
                fills.push(result.user.colorvalue.fill);
                scores.push(result.score);
                times.push(result.time);
            });

            this.setState({
                ...this.state,
                chartScores:{
                    chartData: {
                        labels:users,
                        datasets: [
                            {
                                label: this.intl.formatMessage({id: SCORES}),
                                yAxisID: 'A',
                                data: scores,
                                backgroundColor: fills,
                                borderColor:strokes,
                                borderWidth: 5
                            }]
                    }
                }
            })
        }
    }

    render() {
        return (
            <div>
                <Bar
                    data={this.state.chartScores.chartData}
                    options={this.state.chartScores.options}
                />
            </div>
        )
    }
}

function MapStateToProps(state) {
    return {}
}

export default injectIntl(withRouter(
    connect(MapStateToProps, {})(PresenceScores)));