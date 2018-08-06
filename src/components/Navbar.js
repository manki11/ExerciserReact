import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {withRouter} from "react-router-dom";
import '../css/Navbar.css'
import {injectIntl} from 'react-intl';
import {MY_ACTIVITY,HOME, ADD_EXERCISE, STOP, NETWORK} from "../containers/translation";


class Navbar extends Component {

    constructor(props){
        super(props);

        let {intl} = this.props;
        this.intl = intl;
    }

    directToNew=()=>{
        this.props.history.push('/new')
    };

    directToHome=()=>{
        this.props.history.push('/')
    };

    render() {
        return (
            <div id="main-toolbar" className="toolbar">
                <button
                    className="toolbutton"
                    id="activity-button"
                    title={this.intl.formatMessage({id: MY_ACTIVITY})}/>
                <button
                    className="toolbutton"
                    id="home-button"
                    title={this.intl.formatMessage({id: HOME})}
                    onClick={this.directToHome}/>
                <button
                    className="toolbutton"
                    id="add-button"
                    title={this.intl.formatMessage({id: ADD_EXERCISE})}
                    onClick={this.directToNew}/>
                <button
                    className="toolbutton"
                    id="network-button"
                    title={this.intl.formatMessage({id: NETWORK})}/>
                <button
                    className="toolbutton pull-right"
                    id="stop-button"
                    title={this.intl.formatMessage({id: STOP})}
                    onClick={this.props.onStop}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        exercises: state.exercises
    };
}

export default injectIntl(withRouter(connect(mapStateToProps)(Navbar)));