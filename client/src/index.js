import React from 'react';
import ReactDOM from 'react-dom';
import SignIn from "./pages/sign-in"
import Home from "./pages/home";
import { BrowserRouter, Route, Switch, Redirect, Router } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios/index";
import {createBrowserHistory} from "history";

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
        axios('http://localhost:3001/session-checker', {
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
                Cookies.remove('userId')
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
                <Switch>
                    <Router history={this.state.history}>
                        <Route exact path="/signin" component={SignIn}/>
                        <Route path="/" render={ (props)=>this.protectedRoute(props,Home) } />
                        {/*<Route path="*" component={() => "404 NOT FOUND"} />*/}
                    </Router>
                </Switch>
            </div>
        );
    }
}


const routes = (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

ReactDOM.render(routes, document.getElementById("root"));
