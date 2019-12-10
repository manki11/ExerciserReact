import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './containers/App';
import { unregister } from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');
ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
unregister();
