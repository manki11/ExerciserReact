import React, {Component} from 'react';
import {setNewExerciseType, setNewExerciseID} from "../../store/actions/new_exercise";
import {withRouter} from "react-router-dom";
import { connect } from "react-redux";
import "../../css/NewExerciseTemplate.css"
import mcq from "../../images/mcq_image.jpg"
import cloze from "../../images/cloze_image.jpg"
import reorder from "../../images/list_reorder_image.png"
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';
import {MCQ_TEMPLATE_STRING, CLOZE_TEMPLATE_STRING, REORDER_TEMPLATE_STRING, CHOOSE} from "../translation";

class Template extends Component {

    constructor(props){
        super(props);
    }

    mcqSelected= ()=>{
        this.props.setNewExerciseType("mcq");
        this.props.history.push('/new/mcq')
    };

    clozeSelected=()=> {
        this.props.setNewExerciseType("cloze");
        this.props.history.push('/new/cloze')
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
                                    <div className="card-img-top background-mcq"/>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">MCQ</h5>
                                    <p className="card-text">
                                        <FormattedMessage id={MCQ_TEMPLATE_STRING}/>
                                    </p>
                                    <button className="button-choose" onClick={this.mcqSelected}>
                                        <FormattedMessage id={CHOOSE}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="card">
                                <div className="card-img-container">
                                    <div className="card-img-top background-cloze"/>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">CLOZE TEXT</h5>
                                    <p className="card-text">
                                        <FormattedMessage id={CLOZE_TEMPLATE_STRING}/>
                                    </p>
                                    <button className="button-choose" onClick={this.clozeSelected}>
                                        <FormattedMessage id={CHOOSE}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="card">
                                <div className="card-img-container">
                                    <div className="card-img-top background-reorder"/>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">REORDER LIST</h5>
                                    <p className="card-text">
                                        <FormattedMessage id={REORDER_TEMPLATE_STRING}/>
                                    </p>
                                    <button className="button-choose" onClick={this.reorderSelected}>
                                        <FormattedMessage id={CHOOSE}/>
                                    </button>
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


export default withRouter(connect(mapStateToProps, {setNewExerciseType, setNewExerciseID})(Template));