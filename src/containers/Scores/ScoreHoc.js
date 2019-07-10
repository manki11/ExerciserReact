import React from 'react';
import picoModal from 'picomodal';
import meSpeak from 'mespeak';

const withScoreHOC = () => (Component) => {
	class ScoreHoc extends React.Component {
        
        constructor(props) {
            super(props);  
            this.multimedia = {
                text: 'text',
                image: 'image',
                audio: 'audio',
                textToSpeech: 'text-to-speech',
                video: 'video'
            };          
        }

        speak = (elem, text) => {
            let audioElem = elem;
            let myDataUrl = meSpeak.speak(text, {rawdata: 'data-url'});
            let sound = new Audio(myDataUrl);
            audioElem.classList.remove("button-off");
            audioElem.classList.add("button-on");
            sound.play();
            sound.onended = () => {
                audioElem.classList.remove("button-on");
                audioElem.classList.add("button-off");
            }
        }
    
        showMedia = (imageSource, mediaType = 'img') => {
            picoModal({
                content: (
                    `<${mediaType} src = ${imageSource} \
                        controls
                        style='max-height: 100%;\
                            max-width: 100%;\
                            margin: auto;\
                            left: 0;\
                            right: 0;\
                            top: 0;\
                            bottom: 0;\
                            position: absolute;'>\
                    </${mediaType}>\
                    <button id='close-button' style='background-image: url(${require('../../icons/exercise/delete.svg')});\
                            position: absolute; right: 0px; width: 50px; height: 50px; margin-top: 5px;\
                            border-radius: 25px; background-position: center; background-size: contain; \
                            background-repeat: no-repeat'>\
                    </button>`),
                closeButton: false,
                modalStyles: {
                    backgroundColor: "#e5e5e5",
                    height: "400px",
                    width: "600px",
                    maxWidth: "90%"
                }
            })
            .afterShow(function(modal) {
                let closeButton = document.getElementById('close-button');
                closeButton.addEventListener('click', function() {
                    modal.close();
                });
            })
            .afterClose((modal) => {
                modal.destroy();
            })
            .show();
        };
    
        getResultsTableElement = (element) => {
            if(element.type === this.multimedia.text){
                return (
                    element.data
                );    
            }
            if(element.type === this.multimedia.audio){
                return (
                    <audio  
                            style={{minWidth: '200px'}}
                            className="audio-option"
                            src={element.data}
                            controls>
                    </audio>
                ); 
            }
            if(element.type === this.multimedia.image){
                return (
                    <img src = {element.data}
                            style = {{height: '100px'}}
                            onClick = {()=>{this.showMedia(element.data)}}
                            alt="Option"/>
                ); 
            }
            if(element.type === this.multimedia.video){
                return (
                    <video  src={element.data} controls
                        onClick = {()=>{this.showMedia(element.data, this.multimedia.video)}}
                            height="100px">
                    </video>
                ); 
            }
            if(element.type === this.multimedia.textToSpeech){
                return (
                    <div>
                        <img className="button-off"
                            alt="text-to-speech-option"
                            onClick={(e)=>this.speak(e.target, element.data)}
                        />
                    </div>
                ); 
            }
        }
    
        getWrongRightMarker = (element) => {
            let correctAns = element.correctAns;
            let userAns = element.userAns;
            if(correctAns.data === userAns.data){
                return (
                    <img src = {require("../../icons/exercise/correct.png")}
                        alt="correct-mark">
                    </img> 
                )
            } else {
                return (
                    <img src = {require("../../icons/exercise/wrong.png")}
                        alt="wrong-mark">
                    </img> 
                )
            }
        }    

		render() {
            return (
				<Component
                    {...this.props}
                    speak = {this.speak}
                    showMedia={this.showMedia}
                    getResultsTableElement = {this.getResultsTableElement}
                    getWrongRightMarker = {this.getWrongRightMarker}
                />
			);
		}
	}

	return ScoreHoc;
}

export default withScoreHOC