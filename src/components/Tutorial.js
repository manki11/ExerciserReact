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
			  options={{
				"nextLabel": this.props.intl.formatMessage({ id: NEXT_SHORT }),
				"prevLabel": this.props.intl.formatMessage({ id: PREV }),
				"exitOnOverlayClick": false,
                "nextToDone": false,
				"showBullets": false,
				"tooltipClass": 'customTooltip',
			  }}
			  initialStep= {0}
			  onExit= {() => {this.props.unmount();}}
			  onBeforeChange={(stepIntex)=>{
                if (stepIntex >=0 && Object.keys(tutorialSteps(this.props.pathname, this.props.intl)[stepIntex+1]).length) return true;
				document.querySelector(".introjs-nextbutton") ? document.querySelector(".introjs-nextbutton").classList.add("introjs-disabled"): "";
				return false;
			  }}
            />
		);
	}
}

export default injectIntl(Tutorial);
