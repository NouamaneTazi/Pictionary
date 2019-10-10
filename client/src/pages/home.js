import React from 'react';
import NavBar from "./navbar";
import Salons from "./lobby/salons"
import io from "socket.io-client";
import Salon from "./salon/salon";
import {Route,Switch} from "react-router-dom";
import Mots from "./mots"

export default class MemberHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            salons:{},
            mots:[],
        };
    }

    componentDidMount(){
        this.props.history.listen((location, action) => {
            if (location.pathname) console.log(action, location.pathname, location.state);
            if (location.state && location.state.prev_location && location.state.prev_location.pathname.slice(0,6)==="/salon") {
                //got out of salon
                const room_id=location.state.prev_location.pathname.slice(7);
                socket.emit('leaveRoom',room_id,this.props.user.username)
            }
        });
        // this.props.history.push('/home/oops', { some: 'state' });
        // unlisten();

        const socket = io("http://localhost:3001");
        socket.on('connect', () => {
            console.log('Connected');
        });
        socket.on('updateSalons',(salons)=>{
            this.setState({salons:salons})
        });
        socket.on('updateMots',(mots)=>{
            this.setState({mots:mots})
        });

        this.setState({socket});
    }

    render() {
        return (
            <>
                <NavBar user={this.props.user} history={this.props.history} />
                <Switch>
                    <Route path="/salon/:id"  render={ (props)=>{
                        const salons = Object.keys(this.state.salons);
                        if (salons.includes(props.match.params.id))
                            return (
                                <Salon {...props}
                                mots={this.state.mots}
                                user={this.props.user}
                                socket={this.state.socket}
                                history={this.props.history}
                                salon={this.state.salons[props.match.params.id]}
                                />
                            )
                    }} />
                    <Route path="/mots"  render={ ()=>{
                        if (this.props.user.isAdmin)
                            return (
                                <Mots
                                    username={this.props.user.username}
                                    socket={this.state.socket}
                                    mots={this.state.mots}
                                    history={this.props.history}
                                />
                            )
                    }} />

                    <Salons
                        username={this.props.user.username}
                        isAdmin={this.props.user.isAdmin}
                        socket={this.state.socket}
                        salons={this.state.salons}
                        history={this.props.history}
                    />

                </Switch>
            </>

        )

    }
}

