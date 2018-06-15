import React, {Component} from 'react';
import Navbar from '../components/Navbar'
import activity from 'lib/sugar-web/activity/activity'
import env from 'lib/sugar-web/env'
import {Provider} from "react-redux"
import {configureStore} from "../store";
import {MemoryRouter as Router} from "react-router-dom";
import Main from "./Main";
import '../css/index.css';

const store = configureStore();

class App extends Component {

    constructor(props){
        super(props);
    }

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
                <Provider store={store}>
                    <Router>
                        <div className="App-container">
                            <Navbar onStop={() => this.stopActivity()}/>
                            <Main/>
                        </div>
                    </Router>
                </Provider>
            </div>
        );
    }
}

export default App;
