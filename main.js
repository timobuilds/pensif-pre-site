import * as THREE from 'three'
import { MapControls } from 'three/addons/controls/OrbitControls.js'
import { Galaxy } from './objects/galaxy.js'
import { createRenderPipeline } from './scene/renderPipeline.js'
import { updateSpring } from './animations/springBack.js'
import { updateZoomIn } from './animations/zoomIn.js'
import {
    CAMERA_FAR,
    CAMERA_FOV,
    CAMERA_NEAR,
    GALAXY_ROTATION_SPEED,
    ZOOM_END_DISTANCE,
    ZOOM_START_DISTANCE
} from './config/viewConfig.js'

let canvas, renderer, camera, scene, orbit, pipeline
let galaxy
let lastTime = performance.now()
let springingBack = false
let zoomInOnLoad = true
let zoomStartTime = 0
const zoomEndPos = new THREE.Vector3(0, ZOOM_END_DISTANCE, ZOOM_END_DISTANCE)
const springPosVel = new THREE.Vector3()
const springTargetVel = new THREE.Vector3()

function initThree() {
    canvas = document.querySelector('#canvas')

    scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0xebe2db, 0.00003)

    camera = new THREE.PerspectiveCamera(
        CAMERA_FOV,
        window.innerWidth / window.innerHeight,
        CAMERA_NEAR,
        CAMERA_FAR
    )
    camera.position.set(0, ZOOM_START_DISTANCE, ZOOM_START_DISTANCE)
    camera.up.set(0, 0, 1)
    camera.lookAt(0, 0, 0)

    orbit = new MapControls(camera, canvas)
    orbit.enableDamping = true
    orbit.dampingFactor = 0.05
    orbit.screenSpacePanning = false
    orbit.minDistance = 1
    orbit.maxDistance = 16384
    orbit.minPolarAngle = 0
    orbit.maxPolarAngle = Math.PI

    orbit.addEventListener('end', () => {
        springingBack = true
        springPosVel.set(0, 0, 0)
        springTargetVel.set(0, 0, 0)
    })

    pipeline = createRenderPipeline(canvas, scene, camera)
    renderer = pipeline.renderer
}

function render() {
    const now = performance.now()
    const dt = Math.min((now - lastTime) / 1000, 0.1)

    if (zoomInOnLoad) {
        const result = updateZoomIn(now, zoomStartTime, camera, orbit, zoomEndPos)
        zoomStartTime = result.zoomStartTime ?? zoomStartTime
        if (result.done) {
            zoomInOnLoad = false
        }
    } else if (springingBack) {
        const done = updateSpring(dt, orbit, camera, springPosVel, springTargetVel)
        if (done) {
            orbit.reset()
            springingBack = false
        }
    } else {
        orbit.update()
    }

    pipeline.resizeToDisplaySize()

    galaxy.updateRotation((now - lastTime) * GALAXY_ROTATION_SPEED)
    lastTime = now

    galaxy.updateScale(camera)

    pipeline.render()

    requestAnimationFrame(render)
}

function startGalaxy() {
    initThree()
    galaxy = new Galaxy(scene)
    canvas.classList.add('loaded')
    document.querySelector('.folder-container').classList.add('loaded')
    requestAnimationFrame(render)
}

const folderPreload = new Image()
folderPreload.onload = startGalaxy
folderPreload.src = 'folder.svg'
