import * as THREE from 'three'
import { SPRING_DAMPING, SPRING_STIFFNESS, SPRING_THRESHOLD } from '../config/viewConfig.js'

export function updateSpring(dt, orbit, camera, springPosVel, springTargetVel) {
    const toTarget = new THREE.Vector3().subVectors(orbit.target0, orbit.target)
    springTargetVel.add(toTarget.multiplyScalar(SPRING_STIFFNESS * dt))
    springTargetVel.multiplyScalar(SPRING_DAMPING)
    orbit.target.add(springTargetVel.clone().multiplyScalar(dt))

    const toPos = new THREE.Vector3().subVectors(orbit.position0, camera.position)
    springPosVel.add(toPos.multiplyScalar(SPRING_STIFFNESS * dt))
    springPosVel.multiplyScalar(SPRING_DAMPING)
    camera.position.add(springPosVel.clone().multiplyScalar(dt))

    camera.lookAt(orbit.target)

    const dist = camera.position.distanceTo(orbit.position0) + orbit.target.distanceTo(orbit.target0)
    return dist < SPRING_THRESHOLD
}
