/**
 * Shader used for combining the multiple render passes.
 * Blends base layer (haze) with bloom layer (stars).
 */

export class CompositionShader {

    static fragment = `
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;

        varying vec2 vUv;

        void main() {
            gl_FragColor = texture2D( baseTexture, vUv ) + texture2D( bloomTexture, vUv );
        }
`

    static vertex = `
        varying vec2 vUv;

        void main() {

            vUv = uv;

            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

        }
`
}