import { useState } from "react";


function Tooltip(props){
    return (
        <div className="infoContainer">  
            <div className="flexRow">
                <span>Marker information:</span>
            </div>
            <div className="flexRow">
                <img src="/assets/map_pin_sprite.png" alt="Map pin sprite" /> <span>- Moonquake</span>
            </div>
            <div className="flexRow">
                <img src="/assets/moon_lander_sprite.png" alt="Map pin sprite" /> <span>- Landing</span>
            </div>
        </div>
    )
}

export default Tooltip