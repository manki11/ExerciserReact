import React from 'react';
import datastore from 'lib/sugar-web/datastore';
import chooser from 'lib/sugar-web/graphics/journalchooser';
import env from 'lib/sugar-web/env';
import picoModal from 'picomodal';
import meSpeak from 'mespeak';

const withMultimedia = (defaultThumbnail) => (Component) => {
	class MultimediaHoc extends React.Component {
        
        constructor(props) {
            super(props);            
            this.state = {
                thumbnail: '',
                userLanguage: ''
            }
        }

		componentDidMount() {
	        if (this.props.location.state) {
	            const { thumbnail, userLanguage } = this.props.location.state.exercise;
				let newThumbnail = thumbnail;
                
                // For default exercises
	            if(thumbnail && !thumbnail.startsWith('data:image'))
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
                            this.setState({
                                ...this.state,
                                thumbnail: text
                            }); 
                        });
                    }, {mimetype: 'image/png'}, {mimetype: 'image/jpeg'});
                }
            });
        };

        showMedia = (imageSource) => {
            picoModal({
                content: (
                    `<img src = ${imageSource} \
                        style='max-height: 100%;\
                            max-width: 100%;\
                            margin: auto;\
                            left: 0;\
                            right: 0;\
                            top: 0;\
                            bottom: 0;\
                            position: absolute;'>\
                    </img>\
                    <button id='close-button' style='background-image: url(${require('../icons/exercise/delete.svg')});\
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
                            onClick = {() => {this.showMedia(defaultThumbnail)}}
                            alt="Thumbnail"/>
                    </div>
                );
            } else {
                thumbnail = (
                    <div className = "media-background">
                        <img src = {this.state.thumbnail}
                                style = {{height: '200px'}}
                                onClick = {() => {this.showMedia(this.state.thumbnail)}}
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
                />
			);
		}
	}

	return MultimediaHoc;
}

export default withMultimedia