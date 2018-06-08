import React, {Component} from 'react';
import Exercise from '../components/Exercise'
import '../css/ExerciseList.css'

class RecipeList extends Component {

    render() {
        const {onDelete}= this.props;
        const exercises = this.props.exercises.map((r, index) => (<Exercise onDelete={onDelete} key={r.id} {...r}/>));

        return (
            <div className="recipe-list">
                {exercises}
            </div>
        );
    }
}


export default RecipeList;