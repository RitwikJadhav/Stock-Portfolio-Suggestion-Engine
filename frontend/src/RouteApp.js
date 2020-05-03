import React, { Component } from 'react';
import './App.css';
import { Router, Route, Switch } from 'react-router-dom';
import App from './App';
import ResultApp from './ResultApp';
import { history } from './history';

class RouteApp extends Component {


    render() {

        return (
            <div className="RouteApp">
                <Router history={history}>
                    <Switch>
                        <Route exact path="/" component={App}/>
                        <Route path="/results" component={ResultApp}/>
                    </Switch>
                </Router>

            </div>
        );
    }
}


export default RouteApp;
