import React, {Component} from 'react';
import Cropper from 'cropperjs';
import 'font-awesome/css/font-awesome.min.css';
import 'cropperjs/dist/cropper.css';
import '../css/ImageEditor.css';

class ImageEditor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cropped: false,
            cropping: false,
            name: '',
            previousUrl: '',
            type: '',
            url: '',
            enableEditor: false
        } ;

        this.canvasData = null;
        this.cropBoxData = null;
        this.croppedData = null;
        this.cropper = null;
    }

    componentDidMount () {
        const {mediaSource} = this.props;
        this.setState({
            ...this.state,
            url: mediaSource
        })
    }

    cropperSetup=()=>{

        const image = document.getElementsByClassName('image')[0];
        this.cropper = new Cropper(image, {
            autoCrop: false,
            dragMode: 'move',
            background: false,
  
            ready: () => {
              if (this.croppedData) {
                this.cropper
                  .crop()
                  .setData(this.croppedData)
                  .setCanvasData(this.canvasData)
                  .setCropBoxData(this.cropBoxData);
  
                this.croppedData = null;
                this.canvasData = null;
                this.cropBoxData = null;
              }
            },
  
            crop: ({ detail }) => {
              if (detail.width > 0 && detail.height > 0 && !this.state.cropping) {
                this.update({
                  cropping: true,
                });
              }
            },
          });
    }

    stop() {
        if (this.cropper) {
            this.cropper.destroy();
            this.canvasData = null;
            this.cropBoxData = null;
            this.croppedData = null;
            this.cropper = null;
        }
    }

    crop = () => {
        const { cropper} = this;
        const { cropping, url, type } = this.state;

        if (cropping) {
            this.croppedData = cropper.getData();
            this.canvasData = cropper.getCanvasData();
            this.cropBoxData = cropper.getCropBoxData();
            this.update({
                cropped: true,
                cropping: false,
                previousUrl: url,
                url: cropper.getCroppedCanvas(type === 'image/png' ? {} : {
                    fillColor: '#fff',
                }).toDataURL(type),
            });
            cropper.clear();
        }
    }

    clear = () => {
        const { cropping } = this.state;
        if (cropping) {
            this.cropper.clear();
            this.update({
                cropping: false,
            });
        }
    }

    restore = () => {
        const { cropped } = this.state;
        if (cropped) {
            this.setState({
                ...this.state,
                cropped: false,
                previousUrl: '',
                url: this.state.previousUrl
            }, () => {
                    this.cropper.destroy();
                    this.cropper = null;
                    this.cropperSetup();
                }
            );
        }
    }

    update = (updatedData) => {
        this.setState({
            ...this.state,
            ...updatedData
        }, () => {
            if(this.state.cropped) {
                this.cropper.destroy();
                this.cropper = null;
                this.cropperSetup();
            }
        });
    }

    updateCropper = () => {
        if(this.cropper)
            this.cropper.destroy();
        this.canvasData = null;
        this.cropBoxData = null;
        this.croppedData = null;
        this.cropper = null;
        this.cropperSetup();
    }

    editAction = (e) => {
        if(this.state.url!=='') {
            const { cropper } = this;
            let action = e.currentTarget.dataset.action; 
            switch (action) {
                case 'move':
                break;

                case 'crop':
                cropper.setDragMode(action);
                break;
    
                case 'zoom-in':
                cropper.zoom(0.1);
                break;
    
                case 'zoom-out':
                cropper.zoom(-0.1);
                break;
    
                case 'rotate-left':
                cropper.rotate(-90);
                break;
    
                case 'rotate-right':
                cropper.rotate(90);
                break;
    
                case 'flip-horizontal':
                cropper.scaleX(-cropper.getData().scaleX || -1);
                break;
    
                case 'flip-vertical':
                cropper.scaleY(-cropper.getData().scaleY || -1);
                break;
    
                default:
            }
        }
    }

    enableEditor = () => {
        this.setState({
            ...this.state,
            enableEditor: true
        });
        this.cropperSetup();
    }

    render () {
        return (
            <div>
                <div className="canvas-image-editor">
                    <img src = {this.state.url} controls
                        alt="editable-img"
                        className = "image"
                        >
                    </img>
                </div>
                {!this.state.enableEditor && <button onClick = {this.enableEditor} 
                        id='edit-button'
                        className = "modal-edit-button">
                    </button>
                }
                {this.state.enableEditor && 
                    <div className="toolbar-image-editor">
                        <button className="toolbar__button" data-action="move" title="Move (M)" onClick={this.editAction}><span className="fa fa-arrows"></span></button>
                        <button className="toolbar__button" data-action="crop" title="Crop (C)" onClick={this.editAction}><span className="fa fa-crop"></span></button>
                        <button className="toolbar__button" data-action="zoom-in" title="Zoom In (I)" onClick={this.editAction}><span className="fa fa-search-plus"></span></button>
                        <button className="toolbar__button" data-action="zoom-out" title="Zoom Out (O)" onClick={this.editAction}><span className="fa fa-search-minus"></span></button>
                        <button className="toolbar__button" data-action="rotate-left" title="Rotate Left (L)" onClick={this.editAction}><span className="fa fa-rotate-left"></span></button>
                        <button className="toolbar__button" data-action="rotate-right" title="Rotate Right (R)" onClick={this.editAction}><span className="fa fa-rotate-right"></span></button>
                        <button className="toolbar__button" data-action="flip-horizontal" title="Flip Horizontal (H)" onClick={this.editAction}><span className="fa fa-arrows-h"></span></button>
                        <button className="toolbar__button" data-action="flip-vertical" title="Flip Vertical (V)" onClick={this.editAction}><span className="fa fa-arrows-v"></span></button>
                        <button className="toolbar__button" data-action="restore" title="Undo (Ctrl + Z)" onClick={this.restore}><span className="fa fa-undo"></span></button>
                        <button className="toolbar__button" data-action="clear" title="Cancel (Esc)" onClick={this.clear}><span className="fa fa-ban"></span></button>
                        <button className="toolbar__button" data-action="crop" title="OK (Enter)" onClick={this.crop}><span className="fa fa-check"></span></button>
                        <button className="toolbar__button" data-action="save" title="Save" onClick={()=>{this.props.setMediaSource(this.state.url)}}><span className="fa fa-floppy-o"></span></button>                    
                    </div>
                }
        </div>
        )
    }
}

export default ImageEditor;