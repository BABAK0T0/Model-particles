uniform vec3 uColorA;
uniform vec3 uColorB;

varying vec3 vPosition;

void main() {
    // vPosition.z => [-1.0, 1.0]
    // vPosition.z * 0.5 => [-0.5, 0.5]
    // vPosition.z * 0.5 + 0.5 => [0.0, 1.0]

    float brightness = 0.3;
    float offset = 0.2; // [0.2, 0.5]
    float depth = vPosition.z * 0.5 + 0.5;

    vec3 color = mix(uColorA, uColorB, depth);
    vec2 center = vec2(0.5, 0.5);
    
    gl_FragColor = vec4(color, depth * brightness + offset);
}