import React, { Component } from "react";
import { tutorialSteps } from "../tutorialSteps";
import { injectIntl } from "react-intl";
import { NEXT_SHORT, PREV, END } from "../containers/translation";
import "../css/Tutorial.css";
import 'intro.js/introjs.css';
import { Steps } from 'intro.js-react';

class Tutorial extends Component {

	render() {
		return (
			<Steps
			  enabled={true}
              steps={tutorialSteps(this.props.pathname, this.props.intl)}
	          prevLabel = {this.props.intl.formatMessage({ id: PREV })}
	          nextLabel = {this.props.intl.formatMessage({ id: NEXT_SHORT })}
			  options={{
				"exitOnOverlayClick": false,
                "nextToDone": false,
				"showBullets": false,
				"tooltipClass": 'customTooltip'
			  }}
			  initialStep= {0}
			  onExit= {() => {console.log("tutorial")}}
            />
		);
	}
}

export default injectIntl(Tutorial);
