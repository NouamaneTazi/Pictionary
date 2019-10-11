import React from 'react'
import GridSalon from './grid-salon'


export default class Salon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatMsgs:[],
            room_id:this.props.match.params.id,
            activeusers:{}, //[user:score]
            timeleft:[],
            time_is_up:false,
            drawer:"",
            currentMot:"",
            trois_mots:[],
            game_ended:false,
            timer:null,
            guessed_correctly:false
        };
    }

    componentDidMount() {
        // window.addEventListener("beforeunload", this.onUnload)
        if(!this.props.socket)
            this.props.history.push("/")
        else{
            console.log("connected to room")
            this.props.socket.emit('joinRoom' ,this.state.room_id,this.props.user.username);
            this.props.socket.on('userConnected',(username)=>{
                const chatMsgs=this.state.chatMsgs.concat([{"": username +" connected to room"}])
                this.setState({chatMsgs:chatMsgs})
                console.log(username +" connected to room")
            });
            this.props.socket.on('userDisonnected',(username)=>{
                const chatMsgs=this.state.chatMsgs.concat([{"":username +" disconnected to room"}])
                this.setState({chatMsgs:chatMsgs})
                console.log(username +" disconnected to room")
            });

            this.props.socket.on('chatter',(username,message)=>{
                let obj={};
                obj[username]=message;
                const chatMsgs=this.state.chatMsgs.concat([obj])
                this.setState({chatMsgs:chatMsgs})
            });
            this.props.socket.on('correctGuess',(username)=>{
                if (username===this.props.user.username) this.setState({guessed_correctly:true})
                const chatMsgs=this.state.chatMsgs.concat([{"": username +" guessed the correct word"}])
                this.setState({chatMsgs:chatMsgs})
            });

            this.props.socket.on('setTimeLeft',(timeleft,currentMot)=>{
                this.setState({timeleft:timeleft,currentMot:currentMot})
                function updateTime() {
                    let timeleft= this.state.timeleft-1;
                    this.setState({timeleft:timeleft})
                }
                this.setState({timer:setInterval(updateTime.bind(this), 1000)})
            });
            this.props.socket.on('timeUp',(drawer,trois_mots)=>{
                const chatMsgs=this.state.chatMsgs.concat([{"":"Time up"}]).concat([{"":"Drawer is : "+drawer}])
                this.setState({chatMsgs, time_is_up:true,game_ended:false, drawer, trois_mots, guessed_correctly:false})
            });
            this.props.socket.on('startGame',(drawer,trois_mots)=>{
                const chatMsgs=this.state.chatMsgs.concat([{"":"Drawer is : "+drawer}])
                this.setState({chatMsgs, time_is_up:true,game_ended:false, drawer, trois_mots})
            });
            this.props.socket.on('endGame',()=>{
                const chatMsgs=this.state.chatMsgs.concat([{"":"End of game."}])
                this.setState({chatMsgs:chatMsgs, game_ended:true})
            });
            this.props.socket.on('restartRound',(maxTime,currentMot)=>{
                console.log("restartRound")
                this.setState({timeleft:maxTime, time_is_up:false, maxTime:maxTime, currentMot:currentMot})
            });
        }
    }
    componentWillUnmount(){
        clearInterval(this.state.timer)
    }

    render() {
        return (
            <>
                <GridSalon
                    socket={this.props.socket}
                    room_id={this.state.room_id}
                    user={this.props.user}
                    users={this.props.salon.users}
                    chatMsgs={this.state.chatMsgs}
                    timeleft={this.state.timeleft}
                    drawer={this.state.drawer}
                    mots={this.props.mots}
                    time_is_up={this.state.time_is_up}
                    maxTime={this.state.maxTime}
                    currentMot={this.state.currentMot}
                    trois_mots={this.state.trois_mots}
                    game_ended={this.state.game_ended}
                    manche={this.props.salon.manche}
                    guessed_correctly={this.state.guessed_correctly}
                />
            </>
        );
    }
}