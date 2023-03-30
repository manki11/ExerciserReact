import rootReducer from "./reducers";
import { createStore } from "redux";

export function configureStore() {
	const store = createStore(rootReducer);
	return store;
}