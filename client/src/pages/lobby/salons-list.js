import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';import Typography from '@material-ui/core/Typography';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import axios from "axios/index";





export default function SalonsList(props) {
    const useStyles = makeStyles(theme => ({
        root: {
            width: '100%',
            maxWidth: props.width,
            backgroundColor: theme.palette.background.paper,
        },
    }));
    const classes = useStyles();
    const handleClick=(room_id)=>{
        axios.post('http://localhost:3001/salons/delete',{room_id:room_id})
            .catch(function (error) {
                console.log(error);
            })
    }
    let activeuser_salons = [], others_salons=[];
    console.log("salons",props.salons)
    if(props.salons){
        Object.values(props.salons).forEach((salon)=>{
            salon.created_by===props.username
                ? activeuser_salons.push(salon)
                : others_salons.push(salon)
        })
    }

    const generate=(salons,mine)=>{
        return salons.map((salon)=>
            <List component="nav" aria-label="by you" key={salon.name} >
                <ListItem button>
                    <ListItemIcon onClick={()=>props.history.push("/salon/"+salon._id,{prev_location:props.history.location})}>
                        <FolderIcon />
                    </ListItemIcon>
                    <ListItemText onClick={()=>props.history.push("/salon/"+salon._id,{prev_location:props.history.location})}
                        primary={salon.name}
                        secondary={"by "+salon.created_by}
                    />
                    <ListItemSecondaryAction>
                        <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textSecondary"
                        > {salon.users.length} players </Typography>
                        { (props.isAdmin || mine) &&
                            <IconButton edge="end" aria-label="delete" onClick={()=>{ handleClick(salon._id)}} >
                                <DeleteIcon />
                            </IconButton>
                        }
                    </ListItemSecondaryAction>
                </ListItem>
            </List>
        )
    }

    return (
        <div className={classes.root}>
            <Divider />
            <Typography variant="h6" >
                Created by You
            </Typography>
            <Divider />
            {generate(activeuser_salons,true)}
            <Typography variant="h6" >
                Created by Others
            </Typography>
            <Divider />
            {generate(others_salons,false)}
        </div>
    );
}