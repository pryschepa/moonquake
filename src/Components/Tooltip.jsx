import { useState } from "react";


function Tooltip(props){
    return (
        <>  
        {props.hidden ? null : <div className="tooltip">
                Selected moonquake <br />
                { props.name ? <>Station name: {props.name} <br/></> : null}
                { props.year? <> Date: {props.year} <br/></> : null}
                { props.lat ? <>Latitude: {props.lat} <br/> </> : null}
                { props.long ? <>Longtitude: {props.long} <br/> </> : null}
                { props.mag ? <>Magnitude: {props.mag} <br/> </> : null}
                { props.comment ? <>Comment: {props.comment} <br/></> : null}
            </div>}
            
        </>
    )
}

export default Tooltip