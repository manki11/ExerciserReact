import React, {Component} from 'react';
import '../css/Exercise.css'

class Exercise extends Component {
    render() {
        const {title, questions, topic, avg_score, onDelete, id} = this.props;
        return (
            <div className="exercise-card">
                <div className="exercise-card-content">
                    <h3 className="exercise-title">{title}</h3>
                    <p>Questions: {questions}</p>
                    <p>Topic: {topic}</p>
                    <p>Average Score: {avg_score}</p>
                    <button type="button" className="delete-button" onClick={()=> onDelete(id)}>DELETE</button>
                    <button type="button" className="play-button" onClick={()=> onDelete(id)}>PLAY</button>
                    <button type="button" className="edit-button" onClick={()=> onDelete(id)}>EDIT</button>
                </div>
            </div>
        );
    }
}

export default Exercise;