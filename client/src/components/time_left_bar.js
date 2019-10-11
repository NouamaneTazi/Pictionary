import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        // background:'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default function TimeLeftBar(props) {
    const classes = useStyles();

    const process_timeleft= timeleft => {
        if (timeleft>=props.maxTime) return props.maxTime;
        if (timeleft<0) return 0;
        return timeleft;
    }
    return (
        <Container className={classes.root}>
            <Typography align={'center'}>
                Time left : {process_timeleft(props.timeleft)}
            </Typography>
            <LinearProgress variant="determinate" value={(process_timeleft(props.timeleft))*100/props.maxTime} />
            <br/>
        </Container>

    );
}