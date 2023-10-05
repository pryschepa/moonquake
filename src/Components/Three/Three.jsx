import * as THREE from 'three';

import { useEffect, useRef, useState } from "react";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as TWEEN from '@tweenjs/tween.js'

import geoCoordsTo3D, { moonquakeDataToDate, readJson } from './utils.js'
import { callbackObjectsFromFilename, getRandomColor } from './utils.js'
import Tooltip from '../Tooltip.jsx';
import createSky from './starrySky.js'
import DateController from '../DateController.jsx';
import DateSlider from '../DateSlider';
import { dateToDays, daysToDate, dateToStr } from './utils';


function ThreeScene(props) {
  const sceneRef = useRef(null);
  // const cubes = useRef([]);
  const [tooltipInfo, setTooltipInfo] = useState({hidden: true, name:"", date:0, lat: 0, long: 0})
  const [moonquakes, setMoonquakes] = useState([])

  let radius = useRef(0);

  // const scene = new THREE.Scene();
  const scene = useRef(new THREE.Scene()).current;
  let size = new THREE.Vector3()

  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set( 0, 0, 200 );
    camera.lookAt( 0, 0, 0 )

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    sceneRef.current && sceneRef.current.appendChild( renderer.domElement );

    const loader = new GLTFLoader();

    let load_moon = async () => {
      return await loader.loadAsync( 
        '../assets/Moon_1_3474.glb', 
        function ( gltf ) {
            // console.log(gltf)
        }, undefined,
        function ( error ) {
            console.error( error );
    
        } );
    }

    let controls = new OrbitControls( camera, renderer.domElement );

    load_moon().then((obj) => {
      let moon = obj.scene.children[0]

      moon.material.map.flipY = false;
      moon.scale.set(0.1, 0.1, 0.1)

      let bbox = new THREE.Box3().setFromObject(moon);
      radius.current = bbox.getSize(new THREE.Vector3()).x / 2;

      callbackObjectsFromFilename("../assets/moonquakes.json", createObject)

      // moon.rotateY(2.6)

      createSky(100000, 100, radius * 2, scene)

      controls.minDistance = radius.current + 10;
      controls.maxDistance = radius.current * 10;

      scene.add(moon)
    });

    const light = new THREE.AmbientLight( 0xffffff ); // soft white light
    scene.add( light );
    
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 1;

    const mouse = new THREE.Vector2();

    window.addEventListener('click', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((event.clientY) / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
    
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        for (let i of intersects){
          if (i.object.name == "Cube008" || i.object.name == "") {
            continue
          }

          if(i.object.type == 'moonquake'){
            setTooltipInfo({hidden:false, date: dateToStr(moonquakeDataToDate(i.object.data)), lat: i.object.lat, long: i.object.long, mag: i.object.data.Magnitude})
          }
          else
            setTooltipInfo({hidden:false, name:i.object.name, lat: i.object.lat, long: i.object.long})

          break;
        }
      }
      else{
        setTooltipInfo({hidden: true, ...tooltipInfo})
      }
    });

    window.addEventListener('resize', () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
  
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
  
      renderer.setSize(newWidth, newHeight);
    });

    var animate = function () {
      requestAnimationFrame(animate);

      controls.update();

      renderer.render(scene, camera);
    };
    animate();

    // read moonquakes from file
    readJson("../assets/nakamura_1979.json").then((data) => {
      setMoonquakes(data)
      TWEEN.update()
      console.log(data)
    })

    return () => {
      renderer.dispose();
    };  
  }, []);

  const createObject = (name, long, lat, year, scale=1) => {
    const geometry = new THREE.SphereGeometry();

    const material = new THREE.MeshBasicMaterial({ color: getRandomColor() });
    const sphere = new THREE.Mesh(geometry, material);

    sphere.position.set(...Object.values(geoCoordsTo3D(lat, long, radius.current)))

    sphere.scale.set(scale, scale, scale)

    sphere.name = name
    sphere.lat = lat
    sphere.long = long
    sphere.year = year

    scene.add(sphere);
    // return sphere;
  };

  const createMoonquake = (name, long, lat, year, data) => {
    const geometry = new THREE.SphereGeometry();

    const material = new THREE.MeshBasicMaterial({ color: getRandomColor() });
    const sphere = new THREE.Mesh(geometry, material);

    sphere.position.set(...Object.values(geoCoordsTo3D(lat, long, radius.current)))

    sphere.name = name
    sphere.lat = lat
    sphere.long = long
    sphere.year = year
    sphere.data = data
    sphere.type= 'moonquake'

    return sphere;
  }

  function changeDate(startDate, endDate){
    // go through moonquakes and see if any match the date
    for (let object of moonquakes){
      const date = dateToDays(moonquakeDataToDate(object))

      if (date >= startDate && date <= endDate) {
        if (!object.inScene) {

          let mesh = createMoonquake('Moonquake', object.Long, object.Lat, object.Year, object)
          scene.add(mesh);

          object.inScene = true; // Track whether the object is in the scene.
          object.id = mesh.id;
        }
      } else {
        if (object.inScene) {
          for(let child of scene.children){
            if (child.id == object.id){
              scene.remove(child)
            }
          }
          
          object.inScene = false;
        }
      }
      
    }
  }

  return (
    <>
      <div className="overlay">
        <div className="header">Moonquake map 2.0! </div>
        <div className="dateSlider">
        {moonquakes[0] ? <DateSlider
            minDate = {moonquakeDataToDate(moonquakes[0])}
            maxDate = {moonquakeDataToDate(moonquakes[moonquakes.length - 1])}
            marks = {moonquakes}
            onDateChange={(startDate, endDate) => {changeDate(startDate, endDate)}}
            ></DateSlider> : null}
        </div>
        
        <Tooltip hidden={tooltipInfo.hidden} name={tooltipInfo.name} year={tooltipInfo.date} long={tooltipInfo.long} lat={tooltipInfo.lat} mag={tooltipInfo.mag}/>

        <button className='overlayButton' onClick={(e) => {createObject("anObject", 10, 10, 10, 1)}}>Create Object</button>
        <div className="footer"></div>
      </div>
      <div ref={sceneRef}></div>
    </>
  );
}

export default ThreeScene