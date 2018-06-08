import React, {Component} from 'react';
import Navbar from '../components/Navbar'
import activity from 'lib/sugar-web/activity/activity'
import env from 'lib/sugar-web/env'
import '../css/index.css';

class App extends Component {

    componentDidMount() {
        activity.setup();

        let currentenv;
        let temp = this;
        env.getEnvironment(function (err, environment) {
            currentenv = environment;

            // Set current language to Sugarizer
            // let defaultLanguage = (typeof chrome != 'undefined' && chrome.app && chrome.app.runtime) ? chrome.i18n.getUILanguage() : navigator.language;
            // let language = environment.user ? environment.user.language : defaultLanguage;
            // webL10n.language.code = language;

            // Load from datastore
            if (!environment.objectId) {
                console.log("New instance");
            } else {
                activity.getDatastoreObject().loadAsText(function (error, metadata, data) {
                    if (error === null && data !== null) {
                        console.log("object found!");
                        let state = JSON.parse(data);
                        temp.setState(state);
                    }
                });
            }
        })
    }

    stopActivity(){

    }

    render() {
        return (
            <div className="App">
                <Navbar onStop={() => this.stopActivity()}/>
            </div>
        );
    }
}

export default App;
