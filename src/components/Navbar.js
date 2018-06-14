import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {withRouter} from "react-router-dom";
import '../css/Navbar.css'

class Navbar extends Component {

    constructor(props){
        super(props);

    }

    static defaultProps= {
        onShowForm(){}
    };

    directToNew=()=>{
        this.props.history.push('/new')
    };

    static propTypes={
        onShowForm: PropTypes.func,
        onStop: PropTypes.func
    };
    render() {
        return (
            <div id="main-toolbar" className="toolbar">
                <button className="toolbutton" id="activity-button" title="My Activity"/>
                <button className="toolbutton" id="add-button" title="Add Exercise" onClick={this.directToNew}/>
                <button className="toolbutton" id="network-button" title="Network"/>
                <button className="toolbutton pull-right" id="stop-button" title="Stop" onClick={this.props.onStop}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        exercises: state.exercises
    };
}

export default withRouter(connect(mapStateToProps)(Navbar));