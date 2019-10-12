import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ChatForm from '../../components/chat-form'
import DrawingApp from '../../components/drawing-app'
import TimeLeftBar from '../../components/time_left_bar'
import DrawerDialog from '../../components/drawer-dialog'
import GameEndDialog from '../../components/game-end-dialog'
import brush from '../../Icons/paint-brush.svg'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.grey[200],
        },
        ul: {
            margin: 0,
            padding: 0,
        },
        li: {
            listStyle: 'none',
        },
    },
    root: {
        // padding: theme.spacing(2),
        backgroundColor: theme.palette.grey[200],
        flexGrow:1
        // marginTop:theme.spacing(0),
    },
    toolbox: {
        backgroundColor : theme.palette.grey[300],
    },
    chat: {
        height:400,
        overflow: 'auto'
    },
    message: {
        marginBottom:-4,
        marginLeft:5,
    },
}));

export default function GridSalon(props) {
    const classes = useStyles();

    const messagesEndRef = React.useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" }); //doesnt scroll when user is drawer
        setTimeout(function(){
            if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }, 500);
    }

    React.useEffect(scrollToBottom, [props.chatMsgs]);

    const generate_chat=(chatMsgs)=>{
        return chatMsgs.map((obj,index)=>{
            let [username,message]=Object.entries(obj)[0]
            return (
                <Typography className={classes.message} component={'div'} key={index}>
                    {username ? (
                        // Box better than typography for bold text
                        <>
                            <Box fontWeight="fontWeightBold" display={"inline"} color={"#000000"} >
                                {username+" : "}
                            </Box>
                            {message}
                        </>
                        ) : (
                            <Box fontWeight="fontWeightBold" color={"#00AA00"} >
                                {message}
                            </Box>
                        )
                    }
                </Typography>
                )
            }
        )
    }
    const generate_users=(users)=>{
        return (
            <div >
                <Paper>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={2} align="center">Manche : {props.manche}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Users</TableCell>
                                <TableCell align="right">Score</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.username}>
                                    <TableCell component="th" scope="row">
                                        {user.username+"  "}
                                        {user.username===props.drawer&&
                                            <img src={brush} alt="Brush" width={20}/>
                                        }
                                    </TableCell>
                                    <TableCell align="right">{user.score}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }
    const sortUsers= users=>{
        users.sort((a, b) => (a.score < b.score || (a.score===b.score && a.username > b.username)) ? 1 : -1)
        return users
    }
    return (
        <div className={classes.root}>
            <Card className={classes.root}>
                <TimeLeftBar
                    socket={props.socket}
                    room_id={props.room_id}
                    timeleft={props.timeleft}
                    maxTime={props.maxTime}
                />
            </Card>

            <Grid container className={classes.root} spacing={1}>
                <Grid item key={"users"} xs>
                        {generate_users(sortUsers(props.users))}
                </Grid>

                <Grid item key={"drawing"} xs={6} >
                    <DrawingApp
                        socket={props.socket}
                        room_id={props.room_id}
                        drawer={props.drawer}
                        username={props.user.username}
                        time_is_up={props.time_is_up}
                        currentMot={props.currentMot}
                        class={classes.root}
                    />
                </Grid>

                <Grid item key={"chat"}  xs={4} >
                    <Card className={classes.chat}>
                        {generate_chat(props.chatMsgs)}
                        <div ref={messagesEndRef} />
                    </Card>
                    { (props.socket) &&
                    <ChatForm guessed_correctly={props.guessed_correctly} room_id={props.room_id} drawer={props.drawer} user={props.user} socket={props.socket} currentMot={props.currentMot}/>
                    }
                </Grid>

            </Grid>

            <GameEndDialog users={props.users} game_ended={props.game_ended}/>
            {props.user.username===props.drawer &&
            <DrawerDialog mots={props.mots} time_is_up={props.time_is_up} room_id={props.room_id} trois_mots={props.trois_mots} socket={props.socket}/>
            }

        </div>
    );
}