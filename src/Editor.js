import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCircleCheck, faMaximize, faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons'
import { getCookie, imageBase64, setCookie, setImage } from ".";

export let color = "#000000";

export function resetColor() {
    color = "#000000"
}

export let wrap = false;

var interval = 5

let sx;
let sy;
let sw;
let sh;
let dw;
let dh;

let openedAdvancedMenu = false;

let scaleAspectRatio = false;

let precise = false;

//draws the new edited image to the canvas
function sync() {
    console.log(`${sx} ${sy} ${sw} ${sh}`)

    const image = new Image(),
        canvas = document.getElementById('editor-canvas'),
        ctx = canvas.getContext('2d');

    image.src = imageBase64

    image.addEventListener('load', () => {
        //fill the bg
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 16, 32);

        //draw the image
        ctx.drawImage(image,
            sx, sy,   // Start at 70/20 pixels from the left and the top of the image (crop),
            sw, sh,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
            0, 0,     // Place the result at 0, 0 in the canvas,
            dw, dh); // With as width / height: 100 * 100 (scale)

        //create the silhouette 
        ctx.fillStyle = '#36393f';
        ctx.fillRect(0, 0, 4, 8);
        ctx.fillRect(12, 0, 4, 8);
        ctx.fillRect(0, 20, 4, 12);
        ctx.fillRect(12, 20, 4, 12);
    })
}

//set the canvas image from outside the js file
export function setCanvasImg() {
    const image = new Image(),
        canvas = document.getElementById('editor-canvas'),
        ctx = canvas.getContext('2d');

    image.src = imageBase64

    image.addEventListener('load', () => {
        ctx.canvas.width = 16
        ctx.canvas.height = 32

        ctx.drawImage(image, 0, 0)

        //set initial values
        sx = 0
        sy = 0
        sw = image.width
        sh = image.height

        dw = (32 * image.width) / image.height
        dh = 32

        //set input range min
        document.getElementById('sx').min = -image.width
        document.getElementById('sy').min = -image.height

        //set input range maxes
        document.getElementById('sx').max = image.width
        document.getElementById('sy').max = image.height
        document.getElementById('sw').max = image.width * 2
        document.getElementById('sh').max = image.height * 2
        document.getElementById('size-aspect-ratio').max = image.width * 2


        //set input range value
        document.getElementById('sx').value = sx
        document.getElementById('sy').value = sy
        document.getElementById('sw').value = sw
        document.getElementById('sh').value = sh
        document.getElementById('size-aspect-ratio').value = sw

        sync()
    });
}

class Editor extends React.Component {
    componentDidMount() {
        if (getCookie("wrapimage") === "true") {
            document.getElementById('wrap-input').checked = true
            this.wrapInput()
            console.log("wrap image has been automatically set")
        }
        if (getCookie("aspectratio") === "true") {
            document.getElementById('aspect-ratio-input').checked = true
            this.aspectRatio()
            console.log("aspect ratio lock has been automatically set")
        }
        if (getCookie("preciseedit") === "true") {
            document.getElementById('precise-editing-input').checked = true
            this.preciseEditing()
            console.log("precise edit has been automatically set")
        }
    }

    constructor(props) {
        super(props);

        this.sx = this.sx.bind(this);
        this.sxM = this.sxM.bind(this);
        this.sxP = this.sxP.bind(this);

        this.sy = this.sy.bind(this);
        this.syM = this.syM.bind(this);
        this.syP = this.syP.bind(this);

        this.sw = this.sw.bind(this);
        this.swM = this.swM.bind(this);
        this.swP = this.swP.bind(this);

        this.sh = this.sh.bind(this);
        this.shM = this.shM.bind(this);
        this.shP = this.shP.bind(this);

        this.openAdvanced = this.openAdvanced.bind(this);
        this.colorInput = this.colorInput.bind(this);
        this.wrapInput = this.wrapInput.bind(this);
        this.aspectRatio = this.aspectRatio.bind(this);
        this.arM = this.arM.bind(this);
        this.arP = this.arP.bind(this);
        this.preciseEditing = this.preciseEditing.bind(this);

        this.finish = this.finish.bind(this);
    }

    sx() {
        sx = document.getElementById('sx').value
        sync()
    }

    sxM() {
        sx = parseInt(document.getElementById('sx').value) - interval
        document.getElementById('sx').value = sx
        sync()
    }

    sxP() {
        sx = parseInt(document.getElementById('sx').value) + interval
        document.getElementById('sx').value = sx
        sync()
    }

    sy() {
        sy = document.getElementById('sy').value
        sync()
    }

    syM() {
        sy = parseInt(document.getElementById('sy').value) - interval
        document.getElementById('sy').value = sy
        sync()
    }

    syP() {
        sy = parseInt(document.getElementById('sy').value) + interval
        document.getElementById('sy').value = sy
        sync()
    }

    sw() {
        sw = document.getElementById('sw').value
        sync()
    }

    swM() {
        sw = parseInt(document.getElementById('sw').value) - interval
        document.getElementById('sw').value = sw
        sync()
    }

    swP() {
        sw = parseInt(document.getElementById('sw').value) + interval
        document.getElementById('sw').value = sw
        sync()
    }

    sh() {
        sh = document.getElementById('sh').value
        sync()
    }

    shM() {
        sh = parseInt(document.getElementById('sh').value) - interval
        document.getElementById('sh').value = sh
        sync()
    }

    shP() {
        sh = parseInt(document.getElementById('sh').value) + interval
        document.getElementById('sh').value = sh
        sync()
    }

    sizeAspectRatio() {
        sh = (document.getElementById('size-aspect-ratio').value * sh) / sw
        sw = document.getElementById('size-aspect-ratio').value

        document.getElementById('sw').value = sw
        document.getElementById('sh').value = sh
        sync()
    }

    openAdvanced() {
        if (openedAdvancedMenu) {
            document.getElementById('advanced-dropdown-div').style.display = "none"
            openedAdvancedMenu = false
        } else {
            document.getElementById('advanced-dropdown-div').style.display = "block"
            openedAdvancedMenu = true
        }
    }

    colorInput() {
        color = document.getElementById('clr-input').value
        sync()
    }

    wrapInput() {
        if (wrap) {
            setCookie("wrapimage", "false", 9999999999)
            wrap = false;
        } else {
            setCookie("wrapimage", "true", 9999999999)
            wrap = true;
        }
    }

    aspectRatio() {
        if (scaleAspectRatio) {
            setCookie("aspectratio", "false", 9999999999)
            scaleAspectRatio = false;

            document.getElementById('editor-size-control-div').style.display = "block"
            document.getElementById('editor-aspect-ratio-size-control-div').style.display = "none"
        } else {
            setCookie("aspectratio", "true", 9999999999)
            scaleAspectRatio = true;

            document.getElementById('editor-size-control-div').style.display = "none"
            document.getElementById('editor-aspect-ratio-size-control-div').style.display = "block"
        }
    }

    arM() {
        sh = ((parseInt(document.getElementById('size-aspect-ratio').value) - interval) * sh) / sw
        sw = parseInt(document.getElementById('size-aspect-ratio').value) - interval

        document.getElementById('size-aspect-ratio').value = sw

        document.getElementById('sw').value = sw
        document.getElementById('sh').value = sh
        sync()
    }

    arP() {
        sh = ((parseInt(document.getElementById('size-aspect-ratio').value) + interval) * sh) / sw
        sw = parseInt(document.getElementById('size-aspect-ratio').value) + interval

        document.getElementById('size-aspect-ratio').value = sw

        document.getElementById('sw').value = sw
        document.getElementById('sh').value = sh
        sync()
    }

    preciseEditing() {
        if (precise) {
            setCookie("preciseedit", "false", 9999999999)
            precise = false;

            document.getElementById('precise-div-1').style.display = "none"
            document.getElementById('precise-div-2').style.display = "none"
            document.getElementById('precise-div-3').style.display = "none"
            document.getElementById('precise-div-4').style.display = "none"
            document.getElementById('precise-div-5').style.display = "none"
        } else {
            setCookie("preciseedit", "true", 9999999999)
            precise = true;

            document.getElementById('precise-div-1').style.display = "block"
            document.getElementById('precise-div-2').style.display = "block"
            document.getElementById('precise-div-3').style.display = "block"
            document.getElementById('precise-div-4').style.display = "block"
            document.getElementById('precise-div-5').style.display = "block"
        }
    }

    finish() {
        //make editor content invisible and show finish content
        document.getElementById('editor').style.display = "none"
        document.getElementById('finish').style.display = "block"

        //save the canvas
        setImage(document.getElementById('editor-canvas').toDataURL())

        document.getElementById('finish-img').src = document.getElementById('editor-canvas').toDataURL()
    }

    render() {
        return (
            <div id="editor" className="editor-grid">
                <div className="editor-grid-top">
                    <span className="editor-text">Edit Image</span>
                    <br />
                    <span>Use the sliders to edit skin.</span>
                </div>

                <div className="editor-grid-left">
                    <div>
                        <span className="editor-input-label"><FontAwesomeIcon icon={faUpDownLeftRight} /> Move Left & Right</span>
                        <input id="sx" className="editor-range-input" onChange={this.sx} type="range" min="1" max="100"></input>

                        <div id="precise-div-1" className="editor-precise-div">
                            <button onClick={this.sxM} className="editor-precise-button">-</button>
                            <button onClick={this.sxP} className="editor-precise-button editor-precise-left-button">+</button>
                        </div>
                    </div>

                    <div>
                        <span className="editor-input-label"><FontAwesomeIcon icon={faUpDownLeftRight} /> Move Up & Down</span>
                        <input id="sy" className="editor-range-input" onChange={this.sy} type="range" min="1" max="100"></input>

                        <div id="precise-div-2" className="editor-precise-div">
                            <button onClick={this.syM} className="editor-precise-button">-</button>
                            <button onClick={this.syP} className="editor-precise-button editor-precise-left-button">+</button>
                        </div>
                    </div>

                    <div id="editor-size-control-div">
                        <div>
                            <span className="editor-input-label"><FontAwesomeIcon icon={faMaximize} /> Size Left & Right</span>
                            <input id="sw" className="editor-range-input invert-input" onChange={this.sw} type="range" min="1" max="100"></input>

                            <div id="precise-div-3" className="editor-precise-div">
                                <button onClick={this.swP} className="editor-precise-button">-</button>
                                <button onClick={this.swM} className="editor-precise-button editor-precise-left-button">+</button>
                            </div>
                        </div>

                        <div>
                            <span className="editor-input-label"><FontAwesomeIcon icon={faMaximize} /> Size Up & Down</span>
                            <input id="sh" className="editor-range-input invert-input" onChange={this.sh} type="range" min="1" max="100"></input>

                            <div id="precise-div-4" className="editor-precise-div">
                                <button onClick={this.shP} className="editor-precise-button">-</button>
                                <button onClick={this.shM} className="editor-precise-button editor-precise-left-button">+</button>
                            </div>
                        </div>
                    </div>

                    <div id="editor-aspect-ratio-size-control-div" className="editor-aspect-ratio-size-control-div">
                        <span className="editor-input-label"><FontAwesomeIcon icon={faMaximize} /> Size Aspect Ratio</span>
                        <input id="size-aspect-ratio" className="editor-range-input invert-input" onChange={this.sizeAspectRatio} type="range" min="1" max="100"></input>

                        <div id="precise-div-5" className="editor-precise-div">
                            <button onClick={this.arP} className="editor-precise-button">-</button>
                            <button onClick={this.arM} className="editor-precise-button editor-precise-left-button">+</button>
                        </div>
                    </div>

                    <div className="advanced-dropdown-bg">
                        <button onClick={this.openAdvanced} className="advanced-button"><FontAwesomeIcon icon={faBars} /> Advanced Settings</button>

                        <div id="advanced-dropdown-div" className="advanced-dropdown-div">
                            <div>
                                <input onChange={this.colorInput} type="color" id="clr-input" className="clr-input" />
                                <span className="editor-input-label"> Rest of Skin Color</span>
                            </div>

                            <div>
                                <input onClick={this.wrapInput} type="checkbox" id="wrap-input" className="wrap-input" />
                                <span className="editor-input-label"> Wrap Image (2px)</span>
                            </div>

                            <div>
                                <input onClick={this.aspectRatio} type="checkbox" id="aspect-ratio-input" className="aspect-ratio-input" />
                                <span className="editor-input-label"> Scale to Aspect Ratio</span>
                            </div>

                            <div>
                                <input onClick={this.preciseEditing} type="checkbox" id="precise-editing-input" className="precise-editing-input" />
                                <span className="editor-input-label"> Precise Editing (5px)</span>
                            </div>
                        </div>
                    </div>

                    <button onClick={this.finish} className="editor-finish-button"><FontAwesomeIcon icon={faCircleCheck} /> Finish Edit</button>
                </div>

                <div className="editor-grid-right">
                    <canvas id="editor-canvas" className="editor-canvas"></canvas>
                </div>
            </div>
        );
    }
}

export default Editor;
