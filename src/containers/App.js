import React, { Component } from "react";
import { Provider } from "react-redux";
import { configureStore } from "../store";
// import { DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend"

import Sugarizer from "./Sugarizer";

import "../css/index.css";

const store = configureStore();

class App extends Component {
	render() {
		return (
			<div className='App'>
				{/* <DndProvider backend={HTML5Backend}> */}
				<Provider store={store}>
					<Sugarizer />
				</Provider>
				{/* </DndProvider> */}
			</div>
		);
	}
}

export default App;
