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
            previousUrl: '',
            type: '',
            url: '',
            enableEditor: false
        } ;

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

            crop: ({ detail }) => {
              if (detail.width > 0 && detail.height > 0 && !this.state.cropping) {
                this.update({
                  cropping: true,
                });
              }
            },
          });
    }

    crop = () => {
        const { cropper} = this;
        const { cropping, url, type } = this.state;

        if (cropping) {
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

    save = () => {
      const { cropper} = this;
      const {url, type } = this.state;

      if(cropper) {
        this.update({
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
        const { previousUrl } = this.state;
        if (previousUrl) {
            this.setState({
                ...this.state,
                cropper: false,
                cropping: false,
                previousUrl: '',
                url: this.state.previousUrl
            }, () => {
                    this.updateCropper();
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
                this.updateCropper();
                this.props.setMediaSource(this.state.url);
                this.props.onClose();
            }
        });
    }

    updateCropper = () => {
        if(this.cropper)
            this.cropper.destroy();
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
                this.save();
                break;

                case 'zoom-out':
                cropper.zoom(-0.1);
                this.save();
                break;

                case 'rotate-left':
                cropper.rotate(-90);
                this.save();
                break;

                case 'rotate-right':
                cropper.rotate(90);
                this.save();
                break;

                case 'flip-horizontal':
                cropper.scaleX(-cropper.getData().scaleX || -1);
                this.save();
                break;

                case 'flip-vertical':
                cropper.scaleY(-cropper.getData().scaleY || -1);
                this.save();
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
                        className = "image center-element"
                        >
                    </img>
                </div>
                {!this.state.enableEditor &&
                    <div>
                        <button onClick = {this.enableEditor}
                            id='edit-button'
                            className = "modal-edit-button">
                        </button>,
                        <button onClick = {this.props.onClose}
                            id='save-button'
                            className = "modal-save-button">
                        </button>
                    </div>
                }
                {this.state.enableEditor &&
                    <div>
                        <button onClick={()=>{
                            if(this.state.cropping) {
                                this.crop();
                            } else {
                                this.props.setMediaSource(this.state.url);
                                this.props.onClose();
                            }
                            }}
                            id='save-button'
                            className = "modal-save-button">
                        </button>
                        <button onClick = {()=>{
                                this.clear();
                                this.props.onClose()
                            }}
                            id='close-button'
                            className = "editor-close-button">
                        </button>
                    </div>
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
                    </div>
                }
        </div>
        )
    }
}

export default ImageEditor;
