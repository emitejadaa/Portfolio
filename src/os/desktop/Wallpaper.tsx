"use client";

import { useEffect, useRef } from "react";
import { useOS } from "../store";

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

// A·06 / B·06 Wallpaper vivo: tinta que gira y se abre como una lente alrededor del cursor.
const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_mode;
uniform float u_lens;
uniform float u_energy;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<5;i++){v+=a*noise(p);p=m*p;a*=.5;}
  return v;
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  vec2 p=(gl_FragCoord.xy-.5*u_res)/u_res.y;
  vec2 m=(u_mouse-.5*u_res)/u_res.y;
  vec2 d=p-m;float r=length(d);
  float lens=smoothstep(.34,0.,r)*u_lens;
  float ang=lens*(1.4+u_energy);
  mat2 rot=mat2(cos(ang),-sin(ang),sin(ang),cos(ang));
  vec2 q=m+rot*d*(1.-.38*lens);
  float t=u_time*(.045+.08*u_energy);
  vec2 w=vec2(fbm(q*1.5+vec2(0.,t)),fbm(q*1.5+vec2(5.2,-t)));
  float n=fbm(q*2.1+2.3*w+vec2(t*.6,-t*.4));
  float bias=mix(.18,1.,smoothstep(-.1,1.05,uv.x))*mix(.75,1.,uv.y);
  bias=mix(bias,1.,u_energy);
  float grain=hash(gl_FragCoord.xy+fract(u_time)*91.)-.5;

  vec3 noche=vec3(.027,.031,.039);
  vec3 indigo=vec3(.231,.231,1.);
  vec3 violet=vec3(.545,.361,1.);
  vec3 volt=vec3(.831,1.,.227);
  float inkA=smoothstep(.36,.86,n)*bias;
  float inkB=smoothstep(.56,.96,n+w.x*.25)*bias;
  vec3 night=noche;
  night=mix(night,indigo*.5,inkA*.92);
  night=mix(night,violet*.62,inkB*.62);
  night+=volt*.11*smoothstep(.42,0.,length(uv-vec2(.9,.1)))*(.7+.3*sin(u_time*.4));
  night+=(indigo+violet)*.07*smoothstep(0.,.3,lens)*(1.-lens);
  night*=1.-.38*length(uv-vec2(.45,.5));
  night+=grain*.035;

  vec3 paper=vec3(.953,.945,.925);
  vec3 klein=vec3(.122,.231,1.);
  float wash=smoothstep(.46,.9,n)*bias*.62;
  vec3 day=paper;
  day=mix(day,mix(klein,paper,.62),wash);
  day=mix(day,klein,smoothstep(.8,.97,n)*bias*.42);
  day=mix(day,paper,lens*.55);
  day-=noise(vec2(gl_FragCoord.x*.03,gl_FragCoord.y*.22))*.009;
  day+=grain*.018;

  gl_FragColor=vec4(mix(night,day,u_mode),1.);
}`;

type Props = { variant?: "wallpaper" | "screensaver" };

export function Wallpaper({ variant = "wallpaper" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useOS((s) => s.theme);
  const themeRef = useRef(theme);
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(prog, "u_res"),
      time: gl.getUniformLocation(prog, "u_time"),
      mouse: gl.getUniformLocation(prog, "u_mouse"),
      mode: gl.getUniformLocation(prog, "u_mode"),
      lens: gl.getUniformLocation(prog, "u_lens"),
      energy: gl.getUniformLocation(prog, "u_energy"),
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scale = variant === "screensaver" ? 0.6 : 0.5;
    const energy = variant === "screensaver" ? 1 : 0;
    let w = 0;
    let h = 0;
    const resize = () => {
      w = Math.max(1, Math.floor(window.innerWidth * scale));
      h = Math.max(1, Math.floor(window.innerHeight * scale));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    resize();

    const target = { x: w * 0.68, y: h * 0.55 };
    const mouse = { ...target };
    let lens = reduced ? 0 : 0.6;
    let lensTarget = lens;
    let lastMove = 0;
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX * scale;
      target.y = (window.innerHeight - e.clientY) * scale;
      lastMove = performance.now();
      lensTarget = 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = 0;
    const start = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      if (now - last < 1000 / 30) return; // 30 fps es suficiente para un fondo
      last = now;
      if (variant === "screensaver") {
        const s = now / 1000;
        target.x = w * (0.5 + 0.32 * Math.sin(s * 0.31));
        target.y = h * (0.5 + 0.28 * Math.cos(s * 0.23));
        lensTarget = 1;
      } else if (now - lastMove > 2500) {
        lensTarget = 0.55;
      }
      mouse.x += (target.x - mouse.x) * 0.08;
      mouse.y += (target.y - mouse.y) * 0.08;
      lens += (lensTarget - lens) * 0.05;
      draw((now - start) / 1000);
    };
    const draw = (time: number) => {
      gl.uniform2f(u.res, w, h);
      gl.uniform1f(u.time, time + 40);
      gl.uniform2f(u.mouse, mouse.x, mouse.y);
      gl.uniform1f(u.mode, themeRef.current === "daylight" ? 1 : 0);
      gl.uniform1f(u.lens, lens);
      gl.uniform1f(u.energy, energy);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // prefers-reduced-motion apaga el shader: un solo cuadro quieto.
    if (reduced) {
      draw(12);
      const redraw = () => draw(12);
      const obs = new MutationObserver(redraw);
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      canvas.dataset.ready = "1";
      return () => {
        obs.disconnect();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", resize);
      };
    }

    raf = requestAnimationFrame(frame);
    canvas.dataset.ready = "1";
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [variant]);

  return (
    <div aria-hidden="true" className="wallpaper-fallback grain pointer-events-none absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700 data-[ready=1]:opacity-100"
      />
    </div>
  );
}
