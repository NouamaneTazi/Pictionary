import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import ReactDOM from 'react-dom';
import SignIn from "./pages/sign-in"
import SignUp from "./pages/sign-up"
import Home from "./pages/home";
import { BrowserRouter, Route, Switch, Redirect, Router } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios/index";
import {createBrowserHistory} from "history";
require('dotenv').config();

const theme = createMuiTheme({
        palette: {
            primary: {
                main: '#2b8ae3'
            }
        }
    },
);

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            user:{},
            is_fetching:false,
            history:createBrowserHistory(),
        };
        this.protectedRoute = this.protectedRoute.bind(this);
    }

    updatestatewithtoken(){
        const userId=Cookies.get('userId');
        // INFO create-react-app will automatically set the request origin to whatever the "proxy" setting is in
        // package.json while in development mode, but will reset it to wherever it is being served from in
        // production mode without you having to do anything!
        // that's why '/session-checker' instead of 'localhost:3001/session-checker'
        axios('/api/session-checker', {
            method: "post",
            data: {userId:userId},
            withCredentials: true
        }).then( res => {
            if (res.data.confirmation==="success"){
                this.setState({
                    user:{username:res.data.username, userId:userId, isAdmin:res.data.isAdmin},
                    is_fetching:false
                })
            }else{
                Cookies.remove('userId');
                this.setState({})
            }
        }).catch( err => {throw err});
    }

    protectedRoute(props,Component){
        if(this.state.user.userId) {
            return <Component {...props} user={this.state.user}/>
        } else if (Cookies.get('userId')){
            this.updatestatewithtoken()
        } else if(this.state.is_fetching) {
            return <h1> Loading </h1>
        } else {
            return <Redirect
                to={{pathname: "/signin",
                    state: {from: this.state.location}
                }}
            />
        }
    }

    render(){
        return (
            <div className="App">
                    <Router history={this.state.history}>
                        <Switch>
                            <Route exact path="/signin" component={SignIn}/>
                            <Route exact path="/signup" component={SignUp}/>
                            <Route path="/" render={ (props)=>this.protectedRoute(props,Home) } />
                            {/*<Route path="*" component={() => "404 NOT FOUND"} />*/}
                        </Switch>
                    </Router>
            </div>
        );
    }
}


const routes = (
    <BrowserRouter>
        <MuiThemeProvider theme={theme}>
            <App />
        </MuiThemeProvider>
    </BrowserRouter>
);

ReactDOM.render(routes, document.getElementById("root"));
