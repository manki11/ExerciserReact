import React, { Component } from 'react';


class UserIcon extends Component{
    render(){
        const {stroke_color, fill_color, width, height}= this.props;

        return(
            <svg
                width={width}
                height={height}
                viewBox="0 0 100 100"
            >
                <g
                    id="layer1"
                    transform="translate(-70.329532,-115.26482)">
                    <g
                        id="g6359"
                        transform="matrix(0.30369126,0,0,0.30369187,50.048643,57.867202)"
                        fill={fill_color}
                        stroke={stroke_color}
                        >
                        <path
                            transform="matrix(0.969697,0,0,0.969697,-90.879133,125.06999)"
                            d="m 382.60403,134.2677 c 0,28.28848 -22.93234,51.22083 -51.22082,51.22083 -28.28848,0 -51.22083,-22.93235 -51.22083,-51.22083 0,-28.28848 22.93235,-51.220825 51.22083,-51.220825 28.28848,0 51.22082,22.932345 51.22082,51.220825 z"
                            id="path2307"
                            fill={fill_color}
                            stroke={stroke_color}
                            stroke-width="20"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-miterlimit="4"
                            stroke-opacity="1"
                            stroke-dasharray="none"
                            stroke-dashoffset="0"
                            />
                        <path
                            id="path5343"
                            d="m 290.55846,302.47333 -58.81513,59.20058 -59.39461,-59.40024 c -25.19828,-24.48771 -62.7038,13.33148 -38.1941,37.98719 l 60.04451,58.9817 -59.73639,59.42563 c -24.83976,24.97559 12.91592,63.26505 37.66786,37.75282 l 59.95799,-59.28294 58.75912,59.21065 c 24.50656,25.09065 62.43116,-13.00322 37.87956,-37.85772 l -59.24184,-59.02842 58.87574,-59.14782 c 25.1689,-25.18348 -13.0489,-62.75154 -37.80271,-37.84143 z"
                            fill={fill_color}
                            stroke={stroke_color}
                            stroke-width="20"
                            stroke-linecap="round"
                            stroke-linejoin="miter"
                            stroke-miterlimit="4"
                            stroke-opacity="1"
                            stroke-dasharray="none"
                            stroke-dashoffset="0"
                            />
                    </g>
                </g>
            </svg>
        )
    }
}

export default UserIcon;