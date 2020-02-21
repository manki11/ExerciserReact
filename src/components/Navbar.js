import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import '../css/Navbar.css'
import { injectIntl } from 'react-intl';
import { MY_ACTIVITY, HOME, ADD_EXERCISE, STOP, NETWORK, HELP, EDITOR, PLAY,UNFULL_SCREEN,FULL_SCREEN } from "../containers/translation";
import Tutorial from '../components/Tutorial';

class Navbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showTutorial: false
		}
	}

	// redirect to new exercise template
	directToNew = () => {
		this.props.history.push('/new');
	};

	// redirect to home screen
	directToHome = () => {
		this.props.history.push('/');
	};

	enterEditMode = () => {
		this.props.toggleEditMode(true)
	}

	exitEditMode = () => {
		this.props.toggleEditMode(false)
		this.props.history.push('/')
	}

	startTutorial = () => {
		this.setState({
			showTutorial: true
		})
	}

	stopTutorial = () => {
		this.setState({
			showTutorial: false
		})
	}

	render() {
		let { intl } = this.props;
		let activityTitle = intl.formatMessage({ id: MY_ACTIVITY });
		let homeTitle = intl.formatMessage({ id: HOME });
		let addTitle = intl.formatMessage({ id: ADD_EXERCISE });
		let networkTitle = intl.formatMessage({ id: NETWORK });
		let stopTitle = intl.formatMessage({ id: STOP });
		let helpTitle = intl.formatMessage({ id: HELP });
		let editorButton = intl.formatMessage({ id: EDITOR});
		let playButton = intl.formatMessage({ id: PLAY});
		let fullScreen = intl.formatMessage({id:FULL_SCREEN});
		let unfullScreen = intl.formatMessage({id:UNFULL_SCREEN});
		return (
			<div>
				<div id="main-toolbar" className="toolbar">
				<button
					className="toolbutton"
					id="activity-button"
					title={activityTitle} />
				<button
					className="toolbutton"
					id="network-button"
					title={networkTitle} />
				{!this.props.inEditMode &&
				!this.props.location.pathname.startsWith('/edit') &&
				!this.props.location.pathname.startsWith('/play') &&
				!this.props.location.pathname.startsWith('/scores') &&
					<button
						className="toolbutton"
						id="editor-button"
						title={editorButton}
						onClick={this.enterEditMode} />
				}	
				{this.props.inEditMode &&
					<button
						className="toolbutton"
						id="play-button"
						title={playButton}
						onClick={this.exitEditMode} />
				}
				{this.props.location.pathname !== '/' &&
					<button
						className="toolbutton"
						id="home-button"
						title={homeTitle}
						onClick={this.directToHome} />
				}
				{!this.props.location.pathname.startsWith('/new') &&
				!this.props.location.pathname.startsWith('/edit') &&
				!this.props.location.pathname.startsWith('/play') &&
				!this.props.location.pathname.startsWith('/scores') &&
				this.props.inEditMode &&
					<button
						className="toolbutton"
						id="add-button"
						title={addTitle}
						onClick={this.directToNew} />
				}
				<button
					className="toolbutton pull-right"
					id="stop-button"
					title={stopTitle}
					onClick={this.props.onStop} />
				<button
					className="toolbutton pull-right"
					id="full-screen"
					title={fullScreen}
					onClick={this.goFullscreen} />
				<button
					className="toolbutton pull-right"
					id="help-button"
					title={helpTitle}
					onClick={this.startTutorial} />
				{this.state.showTutorial &&
					<Tutorial unmount={this.stopTutorial}
						pathname={this.props.history.location.pathname}
					/>
				}
			</div>
			<div id="main-toolbar" style={this.state.ElementStyle2} ><button 
				className="toolbutton main-toolbar pull-right "
				id="unfull-screen"
				title={unfullScreen}
				onClick={this.gounFullScreen} />
			</div>
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
