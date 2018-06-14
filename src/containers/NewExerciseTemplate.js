import React, {Component} from 'react';
import {Link} from "react-router-dom";
import "../css/NewExerciseTemplate.css"
import mcq from "../images/mcq_image.jpg"
import cloze from "../images/cloze_image.jpg"
import reorder from "../images/list_reorder_image.png"

class NewExerciseTemplate extends Component {

    render() {
        return (
            <div className="container">
                <div className="container d-flex h-100">
                    <div className="row justify-content-center align-self-center">
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="card">
                                    <img className="card-img-top" src={mcq}/>
                                    <div className="card-body">
                                        <h5 className="card-title">MCQ</h5>
                                        <p className="card-text">Build an exercise with questions and answers with 4
                                            option choices.</p>
                                        <Link to="/new/mcq" className="btn btn-primary">Choose</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card">
                                    <img className="card-img-top" src={cloze}/>
                                    <div className="card-body">
                                        <h5 className="card-title">CLOZE TEXT</h5>
                                        <p className="card-text">Build an exercise with questions that have blanks to be
                                            filled.</p>
                                        <Link to="/new/mcq" className="btn btn-primary">Choose</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card">
                                    <img className="card-img-top" src={reorder}/>
                                    <div className="card-body">
                                        <h5 className="card-title">Reorder List</h5>
                                        <p className="card-text">Build an exercise with Jumbled Lists that need to be
                                            ordered.</p>
                                        <Link to="/new/mcq" className="btn btn-primary">Choose</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default NewExerciseTemplate;