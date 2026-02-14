import * as THREE from 'three'
import { ZOOM_DURATION, ZOOM_END_DISTANCE, ZOOM_START_DISTANCE } from '../config/viewConfig.js'

export function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3)
}

export function updateZoomIn(now, zoomStartTime, camera, orbit, zoomEndPos) {
    if (zoomStartTime === 0) {
        orbit.enabled = false
    }
    const startTime = zoomStartTime > 0 ? zoomStartTime : now
    const elapsed = (now - startTime) / 1000
    const t = Math.min(elapsed / ZOOM_DURATION, 1)
    const eased = easeOutCubic(t)

    camera.position.lerpVectors(
        new THREE.Vector3(0, ZOOM_START_DISTANCE, ZOOM_START_DISTANCE),
        zoomEndPos,
        eased
    )
    camera.lookAt(0, 0, 0)

    if (t >= 1) {
        orbit.enabled = true
        orbit.saveState()
        return { done: true }
    }
    return { done: false, zoomStartTime: startTime }
}
