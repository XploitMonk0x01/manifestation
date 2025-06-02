'use client'
import { useCallback, useEffect, useState } from 'react'
import Particles from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Engine } from '@tsparticles/engine'

export default function ParticlesBg() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    const initializeParticles = async () => {
      await loadSlim(window.tsParticles)
      setInit(true)
    }

    initializeParticles()
  }, [])

  const particlesInit = useCallback((engine: Engine) => {
    loadSlim(engine)
  }, [])

  const options = {
    background: { color: { value: 'transparent' } },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: 'push',
        },
        onHover: {
          enable: true,
          mode: 'repulse',
        },
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: '#ffffff',
      },
      links: {
        color: '#ffffff',
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: {
          default: 'bounce',
        },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80,
      },
      opacity: {
        value: 0.3,
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  }

  if (!init) {
    return null
  }

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={options}
      className="absolute inset-0 -z-10"
    />
  )
}
