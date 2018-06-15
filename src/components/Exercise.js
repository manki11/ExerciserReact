import React, {Component} from 'react';
import '../css/Exercise.css'

class Exercise extends Component {
    render() {
        const {title, type, questions, topic, scores, onDelete, id} = this.props;
        let avg = 0;
        if (scores.length > 0) {
            let sum = scores.reduce(function (a, b) {
                return a + b;
            });
            avg = sum / scores.length;
        }

        return (
            <div className="col-md-6">
                <div className="card">
                    <div className="exercise-card-content">
                        <h3 className="card-title">{title}</h3>
                        <p>Questions: {questions.length}</p>
                        <p>Type: {type}</p>
                        <p>Average Score: {avg}</p>
                        <button type="button" className="btn btn-success">PLAY</button>
                        <button type="button" className="btn btn-info">EDIT</button>
                        <button type="button" className="btn btn-danger float-right" onClick={() => onDelete(id)}>DELETE</button>

                    </div>
                </div>
            </div>
        );
    }
}

export default Exercise;