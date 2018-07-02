import React, {Component} from 'react';
import '../css/Exercise.css'

class Exercise extends Component {

    constructor(props){
        super(props);
        const {id, types}= this.props;

        this.state={
            id: id
        }

    }

    playExercise=()=>{
        this.props.onPlay(this.state.id);
    };

    editExercise=()=>{
        this.props.onEdit(this.state.id);
    };

    deleteExercise=()=>{
        this.props.onDelete(this.state.id);
    };

    render() {
        const {title, type, questions, scores, id} = this.props;
        let avg = 0;
        if (scores.length > 0) {
            let sum = scores.reduce(function (a, b) {
                return a + b;
            });
            avg = sum / scores.length;
            avg= Math.round(avg * 100) / 100;
        }

        return (
            <div className="col-md-12">
                <div className="card">
                    <div className="exercise-card-content">
                        <h3 className="card-title">{title}</h3>
                        <p>Questions: {questions.length}</p>
                        <p>Type: {type}</p>
                        <p>Average Score: {avg}</p>
                        <button type="button" className="play-button" onClick={this.playExercise}/>
                        <button type="button" className="edit-button" onClick={this.editExercise}/>
                        <button type="button" className="delete-button float-right" onClick={this.deleteExercise}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Exercise;