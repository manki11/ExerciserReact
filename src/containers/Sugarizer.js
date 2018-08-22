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
import {setUser} from "../store/actions/sugarizer";
import {setExerciseCounter} from "../store/actions/increment_counter";
import {setIsHost, setIsShared, addUser, removeUser, addSharedResult} from "../store/actions/presence";


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
        const {setExercises, setExerciseCounter, setIsHost, setIsShared, setUser} = this.props;
        activity.setup();

        let currentenv;
        let temp = this;
        env.getEnvironment(function (err, environment) {
            currentenv = environment;

            if(environment.user){
                let user={
                    name: environment.user.name,
                    colorvalue: environment.user.colorvalue
                };
                setUser(user);
                temp.language= environment.user.language;
            }

            // Load from datastore
            if (!environment.objectId) {
                temp.setDefaultExercises();
            } else {
                activity.getDatastoreObject().loadAsText(function (error, metadata, data) {
                    if (error === null && data !== null) {
                        // console.log("object found!");
                        let json = JSON.parse(data);
                        setExercises(json.exercises);
                        setExerciseCounter(json.counter);
                    }
                });
            }

            if (environment.sharedId) {
                // console.log("Shared instance");
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
            // console.log("Want to share");
            temp.presence = activity.getPresenceObject(function (error, network) {
                if (error) {
                    // console.log("Sharing error");
                    return;
                }
                network.createSharedActivity('org.sugarlabs.Exerciser', function (groupId) {
                    // console.log("Activity shared");
                    setIsHost(true);
                    setIsShared(true);
                    temp.isHost= true;
                    // console.log("after sharing:");
                });
                network.onDataReceived(temp.onNetworkDataReceived);
                network.onSharedActivityUserChanged(temp.onNetworkUserChanged);
            });
        });
    }

    onNetworkDataReceived(msg) {

        if (this.presence.getUserInfo().networkId === msg.user.networkId) {
            return;
        }
        switch (msg.content.action) {
            case 'init':
                this.props.setExercises(msg.content.data.shared_exercises);
                break;
            case 'update':
                this.props.setExercises(msg.content.data.shared_exercises);
                break;
            case 'result':
                if(this.isHost){
                    this.props.addSharedResult(msg.content.result);
                }
        }
    };

    onNetworkUserChanged(msg){
        if (this.isHost) {

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
        // console.log("User " + msg.user.name + " " + (msg.move === 1 ? "join" : "leave"));
    };

    onExerciseUpdate=() =>{
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

    onExerciseResult = (id, score, time)=>{
        let presence= this.presence;
        presence.sendMessage(presence.getSharedInfo().id, {
            user: presence.getUserInfo(),
            content:{
                action: 'result',
                result: {
                    user: presence.getUserInfo(),
                    id:id,
                    score: score,
                    time: time
                }
            }
        });
    };

    stopActivity() {
        const {counter, exercises,setIsHost, setIsShared} = this.props;

        let json = {
            counter: counter,
            exercises: exercises,
        };

        let jsonData = JSON.stringify(json);
        activity.getDatastoreObject().setDataAsText(jsonData);
        activity.getDatastoreObject().save(function (error) {
            if (error === null) {
                // console.log("write done.");
            } else {
                // console.log("write failed.");
            }
        });
    }

    render() {
        return (
            <IntlProvider locale={this.language} messages={messages[this.language]}>
                <Router>
                    <div className="App-container">
                        <Navbar onStop={() => this.stopActivity()}/>
                        <Main
                            onUpdate={this.onExerciseUpdate}
                            onSharedResult={this.onExerciseResult}
                        />
                    </div>
                </Router>
            </IntlProvider>
        );
    }

    setDefaultExercises() {
		// Default Exercises list
		let defaultExercises = [
			{
				"id": 1,
				"list": ["I", "IV", "V", "VI", "IX", "X", "L", "C", "D", "M"],
				"question": "Order Roman numerals from the smaller to the greater",
				"scores": [],
				"times": [],
				"title": "Learn Roman numerals",
				"shared": false,
				"type": "REORDER"
			},
			{
				"id": 2,
				"answers": ["cow", "bitch", "lioness", "hen", "mare", "ewe"],
				"clozeText": "The female bull is -1-.\nThe female dog is -2-.\nThe female lion is -3-.\nThe female rooster is -4-.\nThe female stallion is -5-.\nThe female ram is -6-.",
				"question": "Find female name for animals",
				"scores": [],
				"times": [],
				"title": "Animals female name",
				"shared": false,
				"type": "CLOZE",
				"writeIn": "WRITEIN"
			},
			{
				"id": 3,
				"answers": ["is", "am", "are", "is", "is", "are", "is", "am", "are", "is"],
				"clozeText": "It -1- cold today.\nI -2- at home now.\nThey -3- French.\nThere -4- a pen on the book.\nMy name -5- John.\nWe -6- from Spain.\nThat -7- right.\nI -8- OK, thanks.\nKevin and Kate -9- married.\nShe -10- an English teacher.",
				"question": "Chose the correct form of the verb to be",
				"scores": [],
				"times": [],
				"title": "Conjugate \"to be\"",
				"shared": false,
				"type": "CLOZE",
				"writeIn": "OPTIONS"
			},
			{
				"id": 4,
				"title": "Capitals of the World",
				"questions": [
					{
						"id": 1,
						"question": "What is the Capital of India?",
						"correctAns": "New Delhi",
						"answers": ["New Delhi", "Bangalore", "Mumbai", "Hyderabad"]
					},
					{
						"id": 2,
						"question": "What is the Capital of France?",
						"correctAns": "Paris",
						"answers": ["Paris", "Brussels", "Lyon", "Marseille"]
					},
					{
						"id": 3,
						"question": "What is the Capital of UK?",
						"correctAns": "London",
						"answers": ["London","Manchester", "Glasgow", "Liverpool"]
					},
					{
						"id": 4,
						"question": "What is the Capital of USA?",
						"correctAns": "Washington DC",
						"answers": ["Washington DC", "New York", "San Francisco", "Boston"]
					},
					{
						"id": 5,
						"question": "What is the Capital of Germany?",
						"correctAns": "Berlin",
						"answers": ["Berlin", "Munich", "Frankfurt", "Hamburg"]
					},
					{
						"id": 6,
						"question": "What is the Capital of Japan?",
						"correctAns": "Tokyo",
						"answers": ["Tokyo", "Kyoto", "Seoul", "Hiroshima"]
					},
					{
						"id": 7,
						"question": "What is the Capital of China?",
						"correctAns": "Beijing",
						"answers": ["Beijing", "Shanghai", "Hong Kong", "Shenzhen"]
					},
					{
						"id": 8,
						"question": "What is the Capital of Australia?",
						"correctAns": "Canberra",
						"answers": ["Canberra", "Melbourne", "Perth", "Sydney"]
					}
				],
				"scores": [],
				"times": [],
				"shared": false,
				"type": "MCQ"
			},
		];

		// Translate questions/answers
		var temp = this;
		var translate = function(text) {
			if (!messages[temp.language]) return text;
			var translated = messages[temp.language][text];
			return translated || text;
		}
		var translateItem = function(item) {
			var localized = ["title", "question","clozeText","answers","correctAns"];
			for(var property in item) {
				if (localized.indexOf(property) == -1) {
					continue;
				}
				if (!Array.isArray(item[property])) {
					item[property] = translate(item[property]);
				} else {
					var elements = [];
					for (var j = 0 ; j < item[property].length ; j++) {
						elements.push(translate(item[property][j]));
					}
					item[property] = elements;
				}
			}
			return item;
		}
		for (var i = 0 ; i < defaultExercises.length ; i++) {
			var exercice = defaultExercises[i];
			translateItem(exercice);
			if (exercice.type == "MCQ") {
				var questions = [];
				for (var j = 0 ; j < exercice.questions.length ; j++) {
					questions.push(translateItem(exercice.questions[j]));
				}
				exercice.questions = questions;
			}
		}

		// Add to Exercise list
		this.props.setExercises(defaultExercises);
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
    setUser,
    removeUser,
    addSharedResult
})(Sugarizer);
