import React, {Component} from 'react';
import {setNewExerciseType, setNewExerciseID} from "../../store/actions/new_exercise";
import {withRouter} from "react-router-dom";
import { connect } from "react-redux";
import "../../css/NewExerciseTemplate.css"
import mcq from "../../images/mcq_image.jpg"
import cloze from "../../images/cloze_image.jpg"
import reorder from "../../images/list_reorder_image.png"

class NewExerciseTemplate extends Component {

    constructor(props){
        super(props);
    }

    mcqSelected= ()=>{
        this.props.setNewExerciseType("mcq");
        this.props.history.push('/new/mcq')
    };

    clozeSelected=()=> {
        this.props.setNewExerciseType("cloze");
        this.props.history.push('/')
    };

    reorderSelected=()=>{
        this.props.setNewExerciseType("reorder");
        this.props.history.push('/')
    };

    render() {
        return (
            <div className="container">
                <div className="d-flex h-100">
                    <div className="row justify-content-center align-self-center">
                        <div className="col-sm-4">
                            <div className="card">
                                <div className="card-img-container">
                                    {/*<img className="card-img-top" src={mcq}/>*/}
                                    <div className="card-img-top background-mcq"/>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">MCQ</h5>
                                    <p className="card-text">Build an exercise with questions and 4
                                        option choices.</p>
                                    <button className="btn btn-primary" onClick={this.mcqSelected}>Choose</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="card">
                                <div className="card-img-container">
                                    {/*<img className="card-img-top" src={cloze}/>*/}
                                    <div className="card-img-top background-cloze"/>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">CLOZE TEXT</h5>
                                    <p className="card-text">Build an exercise with questions that have blanks to be
                                        filled.</p>
                                    <button className="btn btn-primary" onClick={this.clozeSelected}>Choose</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="card">
                                <div className="card-img-container">
                                    {/*<img className="card-img-top" src={reorder}/>*/}
                                    <div className="card-img-top background-reorder"/>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">REORDER LIST</h5>
                                    <p className="card-text">Build an exercise with Jumbled Lists that need to be
                                        ordered.</p>
                                    <button className="btn btn-primary" onClick={this.reorderSelected}>Choose</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}


export default withRouter(connect(mapStateToProps, {setNewExerciseType, setNewExerciseID})(NewExerciseTemplate));