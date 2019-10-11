import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles(theme =>({
    root: {
        // width: 250,
        // backgroundColor: theme.palette.grey[300],
        flexGrow:1,
    },
    input: {
        // width: 42,
    },
}));

export default function PenSlider(props) {
    const classes = useStyles();
    const [size, setSize] = React.useState(props.brushSize);

    const handleSliderChange = (event, newSize) => {
        props.onChange(newSize)
        setSize(newSize);
    };

    const handleInputChange = event => {
        props.onChange(Number(event.target.value))
        setSize(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
        if (size < 0) {
            setSize(0);
        } else if (size > 60) {
            setSize(60);
        }
    };

    return (
        <div className={classes.root}>
            {/*<Typography id="input-slider" gutterBottom>*/}
                {/*Size*/}
            {/*</Typography>*/}
            <Grid className={classes.root} container direction="row" justify="space-evenly" alignItems="center" style={{height:"75px"}}>
                <Grid item  xs={1}>
                    <FiberManualRecordIcon style={{fontSize:`${size+10}px`, color:`rgb(${props.brushColor.r},${props.brushColor.g},${props.brushColor.b})`}} />
                </Grid>
                <Grid item  xs={4}>
                    <Slider
                        value={typeof size === 'number' ? size : 0}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        max={60}
                        min={1}
                    />
                </Grid>
                <Grid item xs={1}>
                    <Input
                        className={classes.input}
                        value={size}
                        margin="dense"
                        disableUnderline={true}
                        varient={"outlined"}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: 10,
                            min: 0,
                            max: 60,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    );
}