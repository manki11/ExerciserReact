import React, {Component} from 'react';
import {connect} from "react-redux"
import {MemoryRouter as Router} from "react-router-dom";

// Localization Dependencies
import {IntlProvider} from "react-intl";
import {addLocaleData} from "react-intl";
import messages from "../translations/lang"
import locale_en from 'react-intl/locale-data/en';
import locale_fr from 'react-intl/locale-data/fr';
import locale_es from 'react-intl/locale-data/es';

// Sugarizer Dependencies
import activity from 'lib/sugar-web/activity/activity'
import env from 'lib/sugar-web/env'
import presencepalette from 'lib/sugar-web/graphics/presencepalette'

//Components
import Main from "./Router";
import Navbar from '../components/Navbar'

import '../css/index.css';

// actions
import {setExercises} from "../store/actions/exercises";
import {setExerciseCounter} from "../store/actions/increment_counter";
import {setIsHost, setIsShared, addUser, removeUser} from "../store/actions/presence";


class Sugarizer extends Component {

    constructor(props) {
        super(props);

        addLocaleData([...locale_en, ...locale_fr, ...locale_es]);

        this.language = navigator.language.split(/[-_]/)[0];

        this.isHost = false;
        this.presence = null;
        this.onNetworkDataReceived= this.onNetworkDataReceived.bind(this);
        this.onNetworkUserChanged= this.onNetworkUserChanged.bind(this);
    }

    componentDidMount() {
        const {setExercises, setExerciseCounter, setIsHost, setIsShared} = this.props;
        activity.setup();

        let currentenv;
        let temp = this;
        env.getEnvironment(function (err, environment) {
            currentenv = environment;

            // Load from datastore
            if (!environment.objectId) {
                console.log("New instance");
            } else {
                activity.getDatastoreObject().loadAsText(function (error, metadata, data) {
                    if (error === null && data !== null) {
                        console.log("object found!");
                        let json = JSON.parse(data);
                        setExercises(json.exercises);
                        setExerciseCounter(json.counter);
                    }
                });
            }

            if (environment.sharedId) {
                console.log("Shared instance");
                temp.presence = activity.getPresenceObject(function(error, network) {
                    setIsShared(true);
                    network.onDataReceived(temp.onNetworkDataReceived);
                    network.onSharedActivityUserChanged(temp.onNetworkUserChanged);
                });
            }
        });

        let palette = new presencepalette.PresencePalette(document.getElementById("network-button"), undefined);
        palette.addEventListener('shared', function () {
            palette.popDown();
            console.log("Want to share");
            temp.presence = activity.getPresenceObject(function (error, network) {
                if (error) {
                    console.log("Sharing error");
                    return;
                }
                network.createSharedActivity('org.sugarlabs.Exerciser', function (groupId) {
                    console.log("Activity shared");
                    setIsHost(true);
                    setIsShared(true);
                    temp.isHost= true;
                    console.log("after sharing:");
                    console.log(temp.isHost);
                });
                network.onDataReceived(temp.onNetworkDataReceived);
                network.onSharedActivityUserChanged(temp.onNetworkUserChanged);
            });
        });
    }

    onNetworkDataReceived(msg) {
        console.log("data recieved");
        console.log("props are");

        if (this.presence.getUserInfo().networkId === msg.user.networkId) {
            console.log("fuck");
            return;
        }
        switch (msg.content.action) {
            case 'init':
                console.log("initial message");
                console.log(msg.content.data);
                this.props.setExercises(msg.content.data.shared_exercises);
                break;
            case 'update':
                console.log("update message");
                console.log(msg.content.data);
                this.props.setExercises(msg.content.data.shared_exercises);
                break;
        }
    };

    onNetworkUserChanged(msg){
        if (this.isHost) {
            console.log(msg.user);


            const{shared_exercises}= this.props;
            let data={
                shared_exercises:shared_exercises
            };
            let presence= this.presence;
            let isHost= this.isHost;
            presence.sendMessage(presence.getSharedInfo().id, {
                user: presence.getUserInfo(),
                content: {
                    action: 'init',
                    data: data
                }
            });
        }

        if(msg.move === 1) this.props.addUser(msg.user);
        else this.props.removeUser(msg.user);
        console.log("User " + msg.user.name + " " + (msg.move === 1 ? "join" : "leave"));
    };

    onExerciseUpdate=() =>{
        console.log("data updated");
        console.log("props are");
        console.log(this.props);

        const{shared_exercises}= this.props;
        let data={
            shared_exercises:shared_exercises
        };
        let presence= this.presence;
        let isHost= this.isHost;
        presence.sendMessage(presence.getSharedInfo().id, {
            user: presence.getUserInfo(),
            content: {
                action: 'update',
                data: data
            }
        });
    };

    stopActivity() {
        const {counter, exercises} = this.props;

        let json = {
            counter: counter,
            exercises: exercises
        };

        let jsonData = JSON.stringify(json);
        activity.getDatastoreObject().setDataAsText(jsonData);
        activity.getDatastoreObject().save(function (error) {
            if (error === null) {
                console.log("write done.");
            } else {
                console.log("write failed.");
            }
        });
    }

    render() {
        return (
            <IntlProvider locale={this.language} messages={messages[this.language]}>
                <Router>
                    <div className="App-container">
                        <Navbar onStop={() => this.stopActivity()}/>
                        <Main onUpdate={this.onExerciseUpdate}/>
                    </div>
                </Router>
            </IntlProvider>
        );
    }
}

function MapStateToProps(state) {
    return {
        counter: state.exercise_counter,
        exercises: state.exercises,
        shared_exercises: state.shared_exercises,
        isHost: state.isHost
    }
}

export default connect(MapStateToProps, {
    setExercises,
    setExerciseCounter,
    setIsHost,
    setIsShared,
    addUser,
    removeUser
})(Sugarizer);