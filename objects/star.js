import * as THREE from 'three'
import { BLOOM_LAYER, STAR_DISTANCE_SCALE, STAR_MAX, STAR_MIN } from '../config/renderConfig.js'
import { starTypes } from '../config/starDistributions.js'
import { clamp } from '../utils.js'

const texture = new THREE.TextureLoader().load('../resources/sprite120.png')
const materials = starTypes.color.map((color) => new THREE.SpriteMaterial({map: texture, color: color}))

export class Star {

    constructor(position) {
        this.position = position
        this.starType = this.generateStarType()
        this.obj = null
        this._currentScale = null
    }

    generateStarType() {
        let num = Math.random() * 100.0
        let pct = starTypes.percentage
        for (let i = 0; i < pct.length; i++) {
            num -= pct[i]
            if (num < 0) {
                return i
            }
        }
        return 0
    }

    updateScale(camera) {
        const worldPos = new THREE.Vector3()
        this.obj?.getWorldPosition(worldPos)
        let dist = worldPos.distanceTo(camera.position) / STAR_DISTANCE_SCALE

        let targetSize = dist * starTypes.size[this.starType]
        targetSize = clamp(targetSize, STAR_MIN, STAR_MAX)

        if (this._currentScale === null) this._currentScale = targetSize
        this._currentScale += (targetSize - this._currentScale) * 0.2

        this.obj?.scale.set(this._currentScale, this._currentScale, this._currentScale)
    }

    toThreeObject(scene) {
        let sprite = new THREE.Sprite(materials[this.starType])
        sprite.layers.set(BLOOM_LAYER)
        
        sprite.scale.multiplyScalar(starTypes.size[this.starType])
        sprite.position.copy(this.position)

        this.obj = sprite

        scene.add(sprite)
    }
}