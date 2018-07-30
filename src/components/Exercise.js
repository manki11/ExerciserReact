import React, {Component} from 'react';
import '../css/Exercise.css'
import {FormattedMessage} from 'react-intl';
import {QUESTIONS, AVERAGE_SCORE, TYPE} from "../containers/translation";


class Exercise extends Component {

    constructor(props) {
        super(props);
        const {id, types} = this.props;

        this.state = {
            id: id,
        }

    }

    playExercise = () => {
        this.props.onPlay(this.state.id);
    };

    editExercise = () => {
        this.props.onEdit(this.state.id);
    };

    deleteExercise = () => {
        this.props.onDelete(this.state.id);
    };

    shareExercise = () => {
        this.props.onShare(this.state.id, !this.props.shared);
    };

    result = () => {

    }

    render() {
        const {title, type, questions, scores, answers, list, isShared, isHost, shared} = this.props;

        let avg = 0;
        if (scores.length > 0) {
            let sum = scores.reduce(function (a, b) {
                return a + b;
            });
            avg = sum / scores.length;
            avg = Math.round(avg * 100) / 100;
        }

        let play = (<button type="button" className="play-button" onClick={this.playExercise}/>);
        let edit = (<button type="button" className="edit-button" onClick={this.editExercise}/>);
        let cross = (<button type="button" className="delete-button float-right" onClick={this.deleteExercise}/>);
        let share = "";
        let results = "";

        if (isShared && !isHost) {
            edit = "";
            cross = "";
        }

        if (isShared && isHost) {
            let bg = "non-shared-exercise";
            if (shared) {
                bg = "shared-exercise";
                results = (<button type="button" className={"result-button"} onClick={this.result}/>);
            }
            share = (<button type="button" className={"share-button " + bg} onClick={this.shareExercise}/>);
            if (shared) {
                edit = "";
                cross = "";
            }
        }


        let length = 0;
        if (type === "MCQ") length = questions.length;
        if (type === "CLOZE") length = answers.length;
        if (type === "REORDER") length = list.length;

        return (
            <div className="col-md-12">
                <div className="card">
                    <div className="exercise-card-content">
                        <h3 className="card-title">{title}</h3>
                        <p><FormattedMessage id={QUESTIONS}/>: {length}</p>
                        <p><FormattedMessage id={TYPE}/>: {type}</p>
                        <p><FormattedMessage id={AVERAGE_SCORE}/>: {avg}</p>
                        {play}
                        {edit}
                        {cross}
                        {share}
                        {results}
                    </div>
                </div>
            </div>
        );
    }
}

export default Exercise;