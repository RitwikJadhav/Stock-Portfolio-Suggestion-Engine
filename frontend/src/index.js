import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import RouteApp from './RouteApp';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<RouteApp/>, document.getElementById('root'));

serviceWorker.unregister();
