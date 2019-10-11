import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import auth from "../components/auth";
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    homeButton: {
        marginRight: theme.spacing(2),
    },
}));

export default function NavBar (props)  {
    const classes = useStyles();
    const handleClick=()=>{
        auth.logout(props.user.username,()=>{
            window.location="/"
        })
    }
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        className={classes.homeButton}
                        color="inherit"
                        aria-label="open drawer"
                        onClick={()=>props.history.push("/",{prev_location:props.history.location})}
                    >
                        <HomeIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.toolbarTitle}>
                        Pictionary
                    </Typography>
                    <Typography variant="h6" className={classes.toolbarTitle}>
                        Welcome {props.user.username}
                    </Typography>
                    { (props.user.isAdmin) &&
                        <nav>
                            <Link variant="button" color="inherit" href="/mots" className={classes.link}>
                                Mots
                            </Link>
                        </nav>
                    }
                    <Button onClick={handleClick} color="inherit" variant="outlined" className={classes.link}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}