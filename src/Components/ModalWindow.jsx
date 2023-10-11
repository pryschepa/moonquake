import { useState } from "react";


function ModalWindow(props){
    const [long, setLong] = useState('')
    const [lat, setLat] = useState('')
    const [mag, setMag] = useState('')
    const [error, setError] = useState('')

    const tryAdd = () => {
        try{
            let longFloat = parseFloat(long)
            let latFloat = parseFloat(lat)
            let magFloat = parseFloat(mag)
            if (isNaN(longFloat) || isNaN(latFloat)){
                throw new Error('Not a number')
            }
            if (longFloat < -180 || longFloat > 180 || latFloat < -90 || latFloat > 90){
                throw new Error('Out of range')
            }
            props.onAdd(longFloat, latFloat, magFloat)
        }
        catch(e){
            console.log(e)
            setError('Please enter a valid longitude and latitude')
            return
        }
    }

    return (
        <>
            <div className="modalWindow">
                <div className="formContainer">
                    <div className="formFlexRow">
                        <h2>
                            Add your own moonquake
                        </h2>
                    </div>
                    <div className="formFlexRow">
                        <span>Longitude:</span>
                    </div>
                    <div className="formFlexRow">
                        <input type="number" onChange={(e) => setLong(e.target.value)} value={long} min="-180" max="180"/>
                    </div>
                    <div className="formFlexRow">
                        <span>Latitude:</span>
                    </div>
                    
                    <div className="formFlexRow">
                        <input type="number" onChange={(e) => setLat(e.target.value)} value={lat} min="-90" max="90"/>
                    </div>

                    <div className="formFlexRow">
                        <span>Magnitude:</span>
                    </div>
                    
                    <div className="formFlexRow">
                        <input type="number" onChange={(e) => setMag(e.target.value)} value={mag} min="0" max="20"/>
                    </div>
                    
                    <div className="formFlexRow">
                        <span>{error}</span>
                    </div>

                    <div className="formFlexRow">
                        <button className="formButton" onClick={() => tryAdd()}>Add a moonquake</button>
                    </div>
                    <div className="formFlexRow">
                        <button className="formButton" onClick={() => props.onClose()}>Cancel</button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default ModalWindow