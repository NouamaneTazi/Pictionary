import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        // justifyContent:'flex-start',
        alignContent:'stretch',
        alignItems:'stretch',
        // flexWrap: 'wrap',
        // backgroundColor:'white'
    },
    textField: {
        backgroundColor:'white',
        margin:0
    },
}));

export default function ChatForm(props) {
    const classes = useStyles();
    const [message, setMessage] = React.useState('');

    React.useEffect(()=>{
        console.log("mot",props.currentMot)
    },[props.currentMot])
    const handleChange =  event => {
        setMessage(event.target.value);
    };
    const handleSubmit =  e => {
        if (props.socket && !props.guessed_correctly) {
            if(props.drawer!==props.user.username && message.toLowerCase()===props.currentMot.toLowerCase()) {
                props.socket.emit('correctGuess',props.room_id,props.user.username)
            }else{
                props.socket.emit('chatter',props.room_id,props.user.username,message);
            }
        }
        setMessage("");
        e.preventDefault();
    };
    return (
        <form className={classes.container} onSubmit={handleSubmit} >
            <TextField
                fullWidth
                margin="dense"
                variant="outlined"
                placeholder="Type your guess here..."
                className={classes.textField}
                value={message}
                onChange={handleChange}
            />
        </form>
    )
}