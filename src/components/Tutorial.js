import React, {Component} from 'react';
import Tour from 'reactour';
import '../css/Tutorial.css';
import '../css/bootstrap-tour-standalone.min.css'

export class Tutorial extends Component{

    constructor(props){
        super(props);
        this.state = {
            open: true
        }
    }

    MyCustomHelper = ({ current, content, totalSteps, gotoStep, close }) => {
        return (
          <div className='popover tour'>
            <h3 className='popover-title tutorial-title'>{content[0]}</h3>
            <table>
                <tbody>
                    <tr>
                        {/* <td style={{verticalAlign: 'top'}}>
                            <div id='icon-tutorial'></div>
                        </td> */}
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
                            this.setState({
                                open: !this.state.open
                            })
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
                            this.setState({
                                open: !this.state.open
                            })
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
            steps={this.props.tourConfig}
            isOpen={this.state.open}
            maskClassName="mask"
            className="helper"
                CustomHelper={this.MyCustomHelper}
          />   
        );
    }
}