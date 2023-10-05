import * as THREE from 'three';
import { readJson } from './utils';


const vertexShader = `
attribute float size;
attribute vec3 customColor;

varying vec3 vColor;

void main() {

    vColor = customColor;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    gl_PointSize = size * ( 300.0 / -mvPosition.z );

    gl_Position = projectionMatrix * mvPosition;

}`

const fragmentShader = `uniform vec3 color;
uniform sampler2D pointTexture;

varying vec3 vColor;

void main() {

    gl_FragColor = vec4( color * vColor, 1.0 );
    gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );

}`



function createSky(amount, radius, offsetRadius, scene) {
    amount = 100000;
    radius = 500;
    offsetRadius = 300;

    readJson("../assets/nakamura_1979.json")

    const positions = new Float32Array( amount * 3 );
    const colors = new Float32Array( amount * 3 );
    const sizes = new Float32Array( amount );

    const vertex = new THREE.Vector3();
    const color = new THREE.Color( 0xffffff );

    for ( let i = 0; i < amount; i ++ ) {

        vertex.x = ( Math.random() * 2 - 1 ) * radius;
        vertex.y = ( Math.random() * 2 - 1 ) * radius;
        vertex.z = ( Math.random() * 2 - 1 ) * radius;

        let distance = Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y + vertex.z * vertex.z);
        if(distance >= offsetRadius)
            vertex.toArray( positions, i * 3 );

        color.toArray( colors, i * 3 );

        sizes[ i ] = 10;

    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
    geometry.setAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );

    const material = new THREE.ShaderMaterial( {

        uniforms: {
            color: { value: new THREE.Color( 0xffffff ) },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,

        blending: THREE.AdditiveBlending,
        depthTest: true,
        transparent: true

    } );
    // const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const starMaterial = new THREE.PointsMaterial({
  size: 0.1,
  vertexColors: THREE.VertexColors,
});

    let sphere = new THREE.Points( geometry, starMaterial );
    scene.add( sphere );
}

export default createSky;