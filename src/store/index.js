import rootReducer from "./reducers";
import { createStore, compose } from "redux";

export function configureStore() {
    const store = createStore(
        rootReducer,
        compose(
            window.devToolsExtension ? window.devToolsExtension() : f => f
        )
    );

    return store;
}