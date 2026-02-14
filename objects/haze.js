import { BASE_LAYER, HAZE_DISTANCE_SCALE, HAZE_MAX, HAZE_MIN, HAZE_OPACITY, STAR_DISTANCE_SCALE } from "../config/renderConfig.js"
import { clamp } from "../utils.js"
import * as THREE from 'three'


const hazeTexture = new THREE.TextureLoader().load('../resources/feathered60.png')
const hazeSprite = new THREE.SpriteMaterial({map: hazeTexture, color: 0x0082ff, opacity: HAZE_OPACITY, depthTest: false, depthWrite: false })

export class Haze {

    constructor(position) {
        this.position = position
        this.obj = null
        this._currentOpacity = null
    }

    updateScale(camera) {
        const worldPos = new THREE.Vector3()
        this.obj?.getWorldPosition(worldPos)
        let dist = worldPos.distanceTo(camera.position) / STAR_DISTANCE_SCALE
        const targetOpacity = clamp(HAZE_OPACITY * Math.pow(dist / HAZE_DISTANCE_SCALE, 2), 0, HAZE_OPACITY)
        if (this._currentOpacity === null) this._currentOpacity = targetOpacity
        this._currentOpacity += (targetOpacity - this._currentOpacity) * 0.2
        this.obj.material.opacity = this._currentOpacity
    }

    toThreeObject(scene) {
        let sprite = new THREE.Sprite(hazeSprite)
        sprite.layers.set(BASE_LAYER)
        sprite.position.copy(this.position)

        // varying size of dust clouds
        sprite.scale.multiplyScalar(clamp(HAZE_MAX * Math.random(), HAZE_MIN, HAZE_MAX))

        this.obj = sprite
        scene.add(sprite)
    }

}