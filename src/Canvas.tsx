import React, {   useEffect, useRef } from "react";
import "./canvas.css";
import "./App.css";
import Temple1 from "./images/Temple1.png";
import {throttle} from 'throttle-debounce'
import {ParticlesComp} from "./Particles";

interface ICanvasProps {
  className?: string;
}

const Canvas = ({ className }: ICanvasProps) => {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapper = useRef<HTMLDivElement>(null); 
  const startpos = useRef<HTMLDivElement>(null);
  const particles = useRef<HTMLDivElement>(null);

  let imgIndex = 0;
  let imgArr : HTMLImageElement[] = [];
  let percent = 0.001;
  let atStart = false;

  const images = [Temple1];
  const size = window.innerHeight / 6;

  images.forEach((image, idx) => {
    let elImage = new Image(size);
    elImage.src = image;
    elImage.classList.add("project-image");
    document.body.append(elImage);
    imgArr.push(elImage);
  });
  
  useEffect(() => {

      const canvas = canvasRef.current

      function scroll() {
          wrapper.current?.addEventListener("wheel", function(event : WheelEvent ) {
            const wScroll = event.deltaY / 10;
            const offsetPosition = wrapper.current?.offsetTop ?? 0
            let particlesPos = particles.current?.getBoundingClientRect()?.top ?? 0;
            let currentPosition = canvasRef.current?.getBoundingClientRect()?.top ?? 0;
            let newPosition = null;
            let startoffset = startpos.current?.getBoundingClientRect()?.top ?? 0;
            atStart = currentPosition >= startoffset - 3;
            if (percent >= 0.3) {
              let newPosition = currentPosition + wScroll - offsetPosition;
              let newParticlesPos = particlesPos + wScroll - offsetPosition;
              if (canvasRef.current && particles.current) {
                canvasRef.current.style.top = newPosition + 'px'
                particles.current.style.top = newParticlesPos + 'px'
              }
            }
          });
      }

      scroll();
      
      wrapper.current?.addEventListener("wheel", function (e : WheelEvent) {
        if (e.deltaY / 120 < 0 && percent < 0.3) {
          percent += 0.01;
        } else if (e.deltaY / 120 > 0 && percent > 0.001 && atStart) {
          percent -= 0.01;
        }
      });

      function drawImage(idx : any) {

      if (!canvas) {
        return;
      }
      
      const ctx = canvas.getContext("2d");

      if(!ctx) {
        return 
      }

      ctx.imageSmoothingEnabled = false;
        let { width, height } = imgArr[idx].getBoundingClientRect();
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

      ctx.imageSmoothingEnabled = false;

      let scaledWidth = width * percent;
      let scaledHeight = height * percent;

      if (percent >= 1) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        ctx.drawImage(imgArr[idx], 0, 0, width, height);
      } else {
        ctx.drawImage(imgArr[idx], 0, 0, scaledWidth, scaledHeight);
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        if (canvas.width !== 0 && canvas.height !== 0) {
          ctx.drawImage(
            canvas,
            0,
            0,
            scaledWidth,
            scaledHeight,
            0,
            0,
            width,
            height
          );
        }
      }
    }

    function animate() {
      drawImage(imgIndex);
      window.requestAnimationFrame(animate);
    }

    animate();
  }, [imgArr, imgIndex]);

  return (
    <div className={`wrapper ${className}`} ref={wrapper} >
      <div className="startpos" ref={startpos}></div>
        <canvas className="Canvas" ref={canvasRef} />
        <div ref={particles}  >
          <ParticlesComp />
        </div>
    </div>
  );
};

export default Canvas;
