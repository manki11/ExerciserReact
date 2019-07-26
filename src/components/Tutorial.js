import React, {Component} from 'react';
import Tour from 'reactour';
import {TutorialSteps} from '../tutorialSteps';
import '../css/Tutorial.css';

class Tutorial extends Component{

    MyCustomHelper = ({ current, content, totalSteps, gotoStep, close}) => {
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
            <div className='popover-navigation' style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
                <div className='tutorial-prev-icon icon-button' 
                    onClick={()=>{
                        if(current > 0)
                            gotoStep(current-1);
                    }}
                    data-role='prev'>
                    <div className='tutorial-prev-icon1 web-activity'>
                        <div className='tutorial-prev-icon2 web-activity-icon'></div>
                    </div>
                    <div className='icon-tutorial-text'
                        style={{color: `${current === 0?'black':'white'}`}}
                        >Prev</div>
                </div>
                <span data-role='separator' style={{margin: '4px'}}>|</span>
                <div className='tutorial-next-icon icon-button' 
                    onClick={()=>{
                        if(current !== (totalSteps-1))
                            gotoStep(current+1);
                        else {
                            this.props.unmount();
                        }
                    }} data-role='next'>
                    <div className='tutorial-next-icon1 web-activity'>
                        <div className='tutorial-next-icon2 web-activity-icon'></div>
                    </div>
                    <div className='icon-tutorial-text'
                        style={{color: `${current === (totalSteps-1)?'black':'white'}`}}                    
                        >Next</div>
                </div>
                <div className='tutorial-end-icon icon-button' 
                        onClick={()=>{
                            this.props.unmount();
                        }} data-role='end'>
                    <div className='tutorial-end-icon1 web-activity'>
                        <div className='tutorial-end-icon2 web-activity-icon'></div>
                    </div>
                    <div className='icon-tutorial-text'>End</div>
                </div>
            </div>
        </div>
        )
    }
    
    render() {
        return (
            <Tour
                steps={TutorialSteps(this.props.pathname)}
                isOpen={true}
                maskClassName="mask"
                className="helper"
                CustomHelper={this.MyCustomHelper}
          />   
        );
    }
}

export default Tutorial;