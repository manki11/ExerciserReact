import React, {Component} from 'react';
import '../css/ImageEditor.css';

class ImageEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mediaSource: ''
        }
    }

    componentDidMount () {
        const {mediaSource} = this.props;
        this.setState({
            mediaSource: mediaSource
        })
    }

    render () {
        return (
            <div>
                <img src = {this.state.mediaSource} controls
                   alt="editable-img"
                   className = "center-element">
                </img>
                <button onClick = {(e)=>{console.log(e)}} 
                    id='edit-button'
                    className = "modal-edit-button">
                </button>
            </div>
        )
    }
}

export default ImageEditor;