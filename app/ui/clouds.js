/**
 * Inspiration: https://codepen.io/sujitkoji/pen/GgpbJdj
 * Auteur: Sujit Koji
 */

const canvas = document.getElementById("webglCanvas");
const gl = canvas.getContext("webgl2", { alpha: true });

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

const vertexShaderSource = `#version 300 es
in vec4 position;
void main() { gl_Position = position; }
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform float uSeason;
out vec4 fragColor;

// Noise
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
float snoise3(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0,0.5,1.0,2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
              i.z + vec4(0.0,i1.z,i2.z,1.0))
            + i.y + vec4(0.0,i1.y,i2.y,1.0))
            + i.x + vec4(0.0,i1.x,i2.x,1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p*ns.z*ns.z);
  vec4 x_ = floor(j*ns.z);
  vec4 y_ = floor(j - 7.0*x_);
  vec4 x = x_*ns.x + ns.yyyy;
  vec4 y = y_*ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy,y.xy);
  vec4 b1 = vec4(x.zw,y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = inversesqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
  m = m*m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

float fbm3(vec2 uv, float t){
  float total = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for(int i=0;i<6;i++){
    vec3 p = vec3(uv * frequency + vec2(t * 0.05, 0.0), 0.0);
    total += snoise3(p) * amplitude;
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return total * 0.5 + 0.5;
}

void main(){
  vec2 uv = (gl_FragCoord.xy / iResolution.xy)*2.0 - 1.0;
  uv.x *= iResolution.x / iResolution.y;

  float speed = mix(0.02, 0.05, smoothstep(0.0, 3.0, uSeason));
  float density = 0.5;
  vec3 skyColor;
  vec3 cloudTint = vec3(1.0);

  // été
  if (uSeason < 0.5) {
    skyColor = vec3(0.42, 0.68, 0.92);
    cloudTint = vec3(1.0);
    density = 0.45;
  } else if (uSeason < 1.5) {
    // automne
    skyColor = vec3(0.55, 0.62, 0.82);
    cloudTint = vec3(1.0, 0.95, 0.85);
    density = 0.55;
  } else if (uSeason < 2.5) {
    // hiver
    skyColor = vec3(0.7, 0.8, 0.9);
    cloudTint = vec3(0.95, 0.97, 1.0);
    density = 0.65;
  } else {
    // printemps
    skyColor = vec3(0.5, 0.75, 0.95);
    cloudTint = vec3(1.0, 0.95, 0.98);
    density = 0.5;
  }

  // Mouvement horizontal <->
  uv.x += iTime * speed;

  float n = fbm3(uv*1.4, iTime);
  float heightMask = smoothstep(-0.2, 0.5, uv.y);
  float cloud = smoothstep(density, density+0.25, n) * heightMask;

  vec3 col = mix(skyColor, cloudTint, cloud);
  fragColor = vec4(col, cloud);
}
`;

function compileShader(gl, type, source){
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
    console.error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const vertices = new Float32Array([
  -1,-1,  1,-1,  -1,1,
  -1,1,   1,-1,   1,1
]);
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const positionLoc = gl.getAttribLocation(program,"position");
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(positionLoc,2,gl.FLOAT,false,0,0);

const iTimeLoc = gl.getUniformLocation(program,"iTime");
const iResLoc = gl.getUniformLocation(program,"iResolution");

const uSeasonLoc = gl.getUniformLocation(program, "uSeason");

let currentSeason = 0;

export function setSeason(seasonName) {
  const map = { summer: 0, autumn: 1, winter: 2, spring: 3 };
  currentSeason = map[seasonName] ?? 0;
}

export function renderClouds(t) {
  t *= 0.001;
  gl.uniform1f(iTimeLoc, t);
  gl.uniform2f(iResLoc, canvas.width, canvas.height);
  gl.uniform1f(uSeasonLoc, currentSeason);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(renderClouds);
}

requestAnimationFrame(renderClouds);

window.addEventListener('resize',()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0,0,canvas.width,canvas.height);
});
