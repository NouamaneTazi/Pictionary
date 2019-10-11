import React from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SalonsList from './salons-list'
import Grid from '@material-ui/core/Grid';

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

    const handleChange =  event => {
        setValues({ name: event.target.value });
    };
    const handleSubmit =  e => {
        axios.post('http://localhost:3001/salons/add',{username:props.username,name:values.name})
            .catch(function (error) {
                console.log(error);
            });
        setValues({ name: "" });
        e.preventDefault(); //prevents reloading...
    };
    return (
        <form className={classes.container} onSubmit={handleSubmit} noValidate autoComplete="off">
            <TextField
                id="standard-name"
                label="Ajouter un salon"
                className={classes.textField}
                value={values.name}
                onChange={handleChange}
                margin="normal"
                variant={'outlined'}
            />
        </form>
    )
}

export default class Salons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Grid container direction="column" justify="center" alignItems="center" style={{marginTop:'30px'}}>
                <Form width={700} socket={this.props.socket} username={this.props.username} salons={this.props.salons}/>
                <SalonsList width={700} history={this.props.history} salons={this.props.salons} isAdmin={this.props.isAdmin} username={this.props.username}/>
            </Grid>
        );
    }
}

