import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesComponent = props => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async engine => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = container => {
    console.log("Particles Loaded:", container);
  };

  const options = useMemo(
    () => ({
      background: {
        image:
          "linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('/profile/WhatsApp Image 2025-01-30 at 10.46.54.jpeg')",
        position: "center",
        repeat: "no-repeat",
        size: "cover",
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "repulse" },
          onHover: { enable: true, mode: "grab" },
        },
        modes: {
          repulse: { distance: 150, duration: 0.4 },
          grab: { distance: 200 },
        },
      },
      particles: {
        color: { value: "#ffffff" },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          outModes: { default: "bounce" },
        },
        number: { value: 100, density: { enable: true, area: 800 } },
        opacity: { value: 0.8 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
      },
      detectRetina: true,
    }),
    []
  );

  return <Particles id={props.id} init={particlesLoaded} options={options} />;
};

export default ParticlesComponent;
