import React, { Component } from "react";
import Tour from "reactour";
import { tutorialSteps } from "../tutorialSteps";
import { injectIntl } from "react-intl";
import { FormattedMessage } from "react-intl";
import { NEXT_SHORT, PREV, END } from "../containers/translation";
import "../css/Tutorial.css";

class Tutorial extends Component {
	MyCustomHelper = ({ current, content, totalSteps, gotoStep, close }) => {
		return (
			<div className='popover tour'>
				<h3 className='popover-title tutorial-title'>{content[0]}</h3>
				<table>
					<tbody>
						<tr>
							<td>
								<div className='popover-content'>{content[1]}</div>
							</td>
						</tr>
					</tbody>
				</table>
				<div
					className='popover-navigation'
					style={{
						display: "flex",
						flexWrap: "wrap",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<div
						className='tutorial-prev-icon icon-button'
						onClick={() => {
							if (current > 0) gotoStep(current - 1);
						}}
						data-role='prev'
					>
						<div className='tutorial-prev-icon1 web-activity'>
							<div className='tutorial-prev-icon2 web-activity-icon'></div>
						</div>
						<div
							className='icon-tutorial-text'
							style={{ color: `${current === 0 ? "black" : "white"}` }}
						>
							<FormattedMessage id={PREV} />
						</div>
					</div>
					<span data-role='separator' style={{ margin: "4px" }}>
						|
					</span>
					<div
						className='tutorial-next-icon icon-button'
						onClick={() => {
							if (current !== totalSteps - 1) gotoStep(current + 1);
							else {
								this.props.unmount();
							}
						}}
						data-role='next'
					>
						<div className='tutorial-next-icon1 web-activity'>
							<div className='tutorial-next-icon2 web-activity-icon'></div>
						</div>
						<div
							className='icon-tutorial-text'
							style={{
								color: `${current === totalSteps - 1 ? "black" : "white"}`,
							}}
						>
							<FormattedMessage id={NEXT_SHORT} />
						</div>
					</div>
					<div
						className='tutorial-end-icon icon-button'
						onClick={() => {
							this.props.unmount();
						}}
						data-role='end'
					>
						<div className='tutorial-end-icon1 web-activity'>
							<div className='tutorial-end-icon2 web-activity-icon'></div>
						</div>
						<div className='icon-tutorial-text'>
							<FormattedMessage id={END} />
						</div>
					</div>
				</div>
			</div>
		);
	};

	requestClose = (e) => {
		e.preventDefault();
	};

	render() {
		return (
			<Tour
				steps={tutorialSteps(this.props.pathname, this.props.intl)}
				isOpen={true}
				maskClassName='mask'
				className='helper'
				CustomHelper={this.MyCustomHelper}
				onRequestClose={this.requestClose}
			/>
		);
	}
}

export default injectIntl(Tutorial);
