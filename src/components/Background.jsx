import React, { useEffect, useRef } from "react";

const Background = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let step = 0;

    // Star Class
    class Star {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2; // Smaller stars
        this.opacity = Math.random();
        this.twinkleSpeed = Math.random() * 0.01 + 0.003;
      }

      update() {
        this.opacity += this.twinkleSpeed * (Math.random() > 0.5 ? 1 : -1);
        this.opacity = Math.min(1, Math.max(0.3, this.opacity));
      }

      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Fewer stars (Minimal look)
    const stars = Array.from({ length: 50 }, () => new Star());

    function animate() {
      // Soft, very low-intensity glow
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.98,
        canvas.height * 0.98,
        5, // Smaller bright core
        canvas.width * 0.75,
        canvas.height * 0.75,
        Math.max(canvas.width, canvas.height) * 0.8 // Light is dimly everywhere
      );

      gradient.addColorStop(0, "rgba(255, 130, 40, 0.15)");
      gradient.addColorStop(0.3, "rgba(160, 80, 30, 0.1)");
      gradient.addColorStop(0.7, "rgba(50, 50, 80, 0.05)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.02)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Twinkling Stars
      stars.forEach(star => {
        star.update();
        star.draw();
      });

      step += 0.002;
      requestAnimationFrame(animate);
    }

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0" />;
};

export default Background;
