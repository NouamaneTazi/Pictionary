import React, { Component } from 'react';
import {SliderPicker } from 'react-color'
import PenSlider from './pen-slider'
import eraser from '../Icons/eraser.svg'
import brush from '../Icons/paint-brush.svg'
import clear from '../Icons/clear.svg'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

class DrawingApp extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.display = React.createRef();
        this.handleClearClick=this.handleClearClick.bind(this)
        this.state = {
            brushColor: {r:0, g: 0, b: 0, a: 255},
            brushSize: 5,
            toolId: 'brush',
            isBrushDown: false,
            mouseX: 0,
            mouseY: 0,
            prevX: 0,
            prevY: 0,
        }
    }
    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted){
            this.props.socket.on('line', data => {
                const [x1,y1,x2,y2] = data.lineCoordinates;
                if (this.display.current){
                    const displayCtx = this.display.current.getContext('2d')
                    displayCtx.lineWidth = data.lineWidth;
                    displayCtx.strokeStyle = `rgba(${data.lineColor.r},${data.lineColor.g},${data.lineColor.b},${data.lineColor.a})`;
                    displayCtx.beginPath();
                    displayCtx.moveTo(x1,y1);
                    displayCtx.lineTo(x2,y2);
                    displayCtx.stroke();
                }
            });

            this.props.socket.on('resetCanvas', () =>{
                if (this.display.current){
                    const displayCtx = this.display.current.getContext('2d');
                    displayCtx.clearRect(0, 0, displayCtx.canvas.width, displayCtx.canvas.height);
                }
            })
        }
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    handleToolClick(e,toolId) {
        if (toolId==="clear") {
            this.handleClearClick()
        }else {
            this.setState({toolId});
        }
    }
    handleClearClick() {
        this.props.socket.emit('resetCanvas',this.props.room_id)
    }
    handleColorChange(color) {
        this.setState({brushColor: color.rgb});
    }
    handleDisplayMouseMove(e) {
        this.setState({
            mouseX: e.clientX,
            mouseY: e.clientY
        });
        if(this.state.isBrushDown && this.display.current) {
            this.display.current.getContext('2d').lineCap = 'round';
            const {top, left} = this.display.current.getBoundingClientRect();
            switch(this.state.toolId) {
                case 'brush':
                    this.props.socket.emit('line',{
                        room_id:this.props.room_id,
                        lineWidth: this.state.brushSize,
                        lineColor: this.state.brushColor,
                        lineCoordinates: [this.state.prevX - left, this.state.prevY - top, this.state.mouseX - left, this.state.mouseY - top],
                    });
                    break;
                case 'eraser':
                    this.props.socket.emit('line',{
                        room_id:this.props.room_id,
                        lineWidth: this.state.brushSize,
                        lineColor: {r: 255, g: 255, b: 255, a: this.state.brushColor.a},
                        lineCoordinates: [this.state.prevX - left, this.state.prevY - top, this.state.mouseX - left, this.state.mouseY - top],
                    });
                    break;
                default:
            }
        }
        this.setState({
            prevX: this.state.mouseX,
            prevY: this.state.mouseY
        });
        if(!this.state.isBrushDown) {
            this.setState({
                prevX: e.clientX,
                prevY: e.clientY
            });
        }
    }
    handleDisplayMouseDown(e) {
        this.setState({isBrushDown: true});
    }
    handleDisplayMouseUp(e) {
        this.setState({isBrushDown: false});
    }
    handleBrushResize(value) {
        this.setState({brushSize: value})
    }

    render() {
        return (
            <div>
                <Grid container direction="column" style={{border: "2px solid grey", borderRadius: "5px"}}>
                    {this.props.username===this.props.drawer && !this.props.time_is_up?
                        <div >
                            <Grid item style={{backgroundColor:"white"}}>
                                <canvas  width={"729"} height={"350"} className="display"  ref={this.display} onMouseMove={this.handleDisplayMouseMove.bind(this)} onMouseDown={this.handleDisplayMouseDown.bind(this)} onMouseUp={this.handleDisplayMouseUp.bind(this)}/>
                            </Grid>
                            <Grid item>
                                <Typography align={'center'}  component={'div'}> {/* component={'span'} cz error <div> cannot appear as a descendant of <p>.*/}
                                    You are drawing :
                                    <Box fontWeight="fontWeightBold" m={1} display={"inline"}>{this.props.currentMot}</Box>
                                </Typography>
                            </Grid>
                            <Grid item  >
                                <SliderPicker width={'100%'} color={this.state.brushColor} onChange={this.handleColorChange.bind(this)} />
                            </Grid>
                            <Grid item >
                                <div align="center" style={{marginTop:"15px"}}>
                                    <ToggleButtonGroup
                                        size="large"
                                        value={this.state.toolId}
                                        exclusive
                                        onChange={this.handleToolClick.bind(this)}
                                        aria-label="tools"
                                    >
                                        <ToggleButton value="brush" size={"small"}>
                                            <img src={brush} alt="Brush" width={50}/>
                                        </ToggleButton>
                                        <ToggleButton value="eraser" >
                                            <img src={eraser} alt="Eraser" width={50}/>
                                        </ToggleButton>
                                        <ToggleButton value="clear" >
                                            <img src={clear} alt="Clear" width={50}/>
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </div>
                            </Grid>
                            <Grid item className={this.props.class} >
                                <PenSlider class={this.props.class} onChange={this.handleBrushResize.bind(this)} brushSize={this.state.brushSize} brushColor={this.state.brushColor} type="range" min="0" max="60"/>
                            </Grid>
                        </div>
                        : <canvas style={{backgroundColor:"white"}}  width="729" height="400" ref={this.display}/>
                    }
                </Grid>
            </div>
        )

    }
}

export default DrawingApp;