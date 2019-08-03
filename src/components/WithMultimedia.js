import React from 'react';
import datastore from 'lib/sugar-web/datastore';
import chooser from 'lib/sugar-web/graphics/journalchooser';
import env from 'lib/sugar-web/env';
import meSpeak from 'mespeak';
import Modal from 'react-modal';
import ImageEditor from '../components/ImageEditor';
import '../css/ImageEditor.css';

const modalStyle = {
    content : {
        top : '55%',
        left : '50%',
        right : 'auto',
        bottom : 'auto',
        marginRight : '-50%',
        transform : 'translate(-50%, -50%)',
        height : '85%',
        width : '80%',
        backgroundColor: '#e5e5e5'
    }
};

const withMultimedia = (defaultThumbnail) => (Component) => {
	class MultimediaHoc extends React.Component {
        
        constructor(props) {
            super(props);            
            this.state = {
                thumbnail: '',
                userLanguage: '',
                modalSource: '',
                modalMediaType: '',
                modalIsOpen: false,
            }
        }

		componentDidMount() {
	        if (this.props.location.state) {
	            const { thumbnail, userLanguage } = this.props.location.state.exercise;
				let newThumbnail = thumbnail;
                
                // For default exercises
	            if(thumbnail && !thumbnail.startsWith('data:image')  && !thumbnail.includes('/static/'))
	                newThumbnail = require(`../images/defaultExerciseThumbnail/${thumbnail}`);
                
	            this.setState({
	                ...this.state,
                    thumbnail: newThumbnail,
                    userLanguage: userLanguage
	            });
            }
            this.textToSpeechSetup();
	    }

        textToSpeechSetup = () => {
            env.getEnvironment((err, environment) => {
                var defaultLanguage = (typeof window.chrome !== 'undefined' && window.chrome.app && window.chrome.app.runtime) ? window.chrome.i18n.getUILanguage() : navigator.language;
                if (!environment.user) environment.user = { language: defaultLanguage };
                let userLanguage = environment.user.language;
                try{
                    if(userLanguage.startsWith('en'))
                        require(`mespeak/voices/en/${userLanguage}.json`);
                    else
                        require(`mespeak/voices/${userLanguage}.json`);
                } catch(error) {
                    userLanguage = 'en';
                }
                this.setState({
                    ...this.state,
                    userLanguage: userLanguage
                }, () => {
                    if(userLanguage.startsWith('en'))
                        meSpeak.loadVoice(require(`mespeak/voices/en/${this.state.userLanguage}.json`));
                    else
                        meSpeak.loadVoice(require(`mespeak/voices/${this.state.userLanguage}.json`));
                })
            });
        }

        insertThumbnail = () => {
            env.getEnvironment( (err, environment) => {
                if(environment.user) {
                    // Display journal dialog popup
                    chooser.show((entry) => {
                        if (!entry) {
                              return;
                        }
                        var dataentry = new datastore.DatastoreObject(entry.objectId);
                        dataentry.loadAsText((err, metadata, text) => {
                            console.log(text);
                            this.setState({
                                ...this.state,
                                thumbnail: text
                            }); 
                        });
                    }, {mimetype: 'image/png'}, {mimetype: 'image/jpeg'});
                }
            });
        };
         
        closeModal = () => {
            this.setState({
                ...this.state,
                modalIsOpen: false
            });
        }

        showMedia = (imageSource, mediaType = 'img', setImageEditorSource = null) => {
            this.setState({
                ...this.state,
                modalSource: imageSource,
                modalMediaType: mediaType,
                modalIsOpen: true,
                setImageEditorSource: setImageEditorSource
            })
        }

        showModalWindow = () => {
            return (
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={modalStyle}
                >
                    {this.state.modalMediaType === 'img' && 
                        <img src = {this.state.modalSource} controls
                            alt="non-editable img"
                            className = "center-element">
                        </img>}
                    {this.state.modalMediaType === 'video' && 
                        <video src = {this.state.modalSource} controls
                                className = "center-element">
                        </video>}
                    <button onClick = {this.closeModal} 
                            id='close-button' 
                            className = "modal-close-button">
                    </button>
                </Modal>
            );
        }

        showEditableModalWindow = () => {
            return (
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={modalStyle}
                >
                    {this.state.modalMediaType === 'img' && 
                        <ImageEditor mediaSource = {this.state.modalSource}
                                    setMediaSource = {this.state.setImageEditorSource}
                        />
                    }
                    {this.state.modalMediaType === 'video' && 
                        <video src = {this.state.modalSource} controls
                            className = "center-element">
                        </video>}
                    <button onClick = {this.closeModal} 
                            id='close-button'
                            className = "modal-close-button">
                    </button>
                </Modal>
            );
        }
        
		deleteThumbnail = () => {
			this.setState({
				...this.state,
				thumbnail:''
			});
		}

		render() {

            // Thumbnail
            let thumbnail;
            if(this.state.thumbnail === '') {
                thumbnail = (
                    <div className = "media-background">
                        <img src = {defaultThumbnail}
                            style = {{height: '200px'}}
                            onClick = {() => {this.showMedia(defaultThumbnail, 'img', (url)=>{
                                this.setState({...this.state, thumbnail: url})
                            })}}
                            alt="Thumbnail"/>
                    </div>
                );
            } else {
                thumbnail = (
                    <div className = "media-background">
                        <img src = {this.state.thumbnail}
                                style = {{height: '200px'}}
                                onClick = {() => {this.showMedia(this.state.thumbnail, 'img', (url)=>{
                                    this.setState({...this.state, thumbnail: url})
                                })}}
                                alt="Thumbnail"/>
                        <button className="btn button-cancel" 
                            onClick={this.deleteThumbnail}>
                        </button>
                    </div>
                );
            }

            return (
				<Component
                    {...this.props}
                    srcThumbnail={this.state.thumbnail}
                    userLanguage={this.state.userLanguage}
					thumbnail={thumbnail}
					insertThumbnail={this.insertThumbnail}
                    showMedia={this.showMedia}
                    ShowModalWindow = {this.showModalWindow}
                    ShowEditableModalWindow = {this.showEditableModalWindow}
                />
			);
		}
	}

	return MultimediaHoc;
}

export default withMultimedia