import React, {Component} from 'react';
import Exercise from '../components/Exercise'
import '../css/ExerciseList.css'

class ExerciseList extends Component {

    render() {
        const {onDelete} = this.props;
        let exercises = <p>Exercise List</p>;
        if (this.props.exercises) {
            exercises = this.props.exercises.map((r, index) => (
                <Exercise onDelete={onDelete} key={r.id} {...r}/>));
        }

        return (
            <div className="exercise-list">
                {exercises}
            </div>
        );
    }
}


export default ExerciseList;