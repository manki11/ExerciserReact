import React, {Component} from 'react';
import {Provider} from "react-redux"
import {configureStore} from "../store";

import Sugarizer from "./Sugarizer";

import '../css/index.css';

const store = configureStore();

class App extends Component {
    render() {
        return (
            <div className="App">
                <Provider store={store}>
                    <Sugarizer/>
                </Provider>
            </div>
        );
    }
}

export default App;
