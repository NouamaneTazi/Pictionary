import React from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';


function Form(props) {
    const useStyles = makeStyles(theme => ({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: props.width,
        },
    }));
    const classes = useStyles();
    const [values, setValues] = React.useState({
        name: '',
    });

    const toggleCase = s => s.substr(0, 1).toUpperCase() + s.substr(1).toLowerCase();

    const handleChange =  event => {
        setValues({ name: toggleCase(event.target.value)});
    };
    const handleSubmit =  e => {
        e.preventDefault(); //prevents reloading...
        if (values.name.length<3 || props.mots.includes(values.name)) return setValues({ name: "" });
        axios.post('/mots/add',{username:props.username,mot:values.name})
            .catch(function (error) {
                console.log(error);
            });
        setValues({ name: "" });
    };
    return (
        <form className={classes.container} onSubmit={handleSubmit} autoComplete="off">
            <TextField
                id="standard-name"
                label="Ajouter un mot"
                className={classes.textField}
                value={values.name}
                onChange={handleChange}
                margin="normal"
                variant={'outlined'}
            />
        </form>
    )
}

export default function Mots(props) {
    const handleClick=(mot)=>{
        axios.post('http://localhost:3001/mots/delete',{mot:mot})
            .catch(function (error) {
                console.log(error);
            })
    }
    const listItems = props.mots.map((mot,index) =>
        <div key={index}>
            <ListItem button dense={true}>
                <ListItemText button
                    onClick={()=>handleClick(mot)}
                    primary={mot}
                    align={"center"}
                />
            </ListItem>
        </div>
    );

    const messagesEndRef = React.useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }

    React.useEffect(scrollToBottom, [props.mots]);

    return (
            <Grid container direction="column" justify="center" alignItems="center" style={{marginTop:'30px'}}>
                <Typography align={'center'}  component={'span'}> {/* component={'span'} cz error <div> cannot appear as a descendant of <p>.*/}
                    <Box fontWeight="fontWeightBold" m={1} >
                        Sélectionner un mot pour le supprimer :
                    </Box>
                </Typography>
                <Paper style={{width:300, maxHeight: 300, overflow: 'auto'}}>
                    <List>
                        {listItems}
                    </List>
                    <div ref={messagesEndRef} />
                </Paper>
                <Form width={300} socket={props.socket} username={props.username} mots={props.mots}/>

            </Grid>
    )



}

