import Hero from '@/components/Hero';
import Features from '@/components/Features';
import About from '@/components/About'

export default function Home() {
  return (
    <div
      className="framer-d7vJQ framer-72rtr7"
      style={{
        minHeight: '100vh',
        width: '100%', // <-- change from 100vw or auto to 100%
        alignContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url("/home0.jpg")',
        backgroundPosition: `top`,
        backgroundSize: `100%`,
        backgroundRepeat: `no-repeat`,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        gap: 0,
        height: 'min-content',
        justifyContent: 'flex-start',
        overflow: 'visible', // or 'hidden' if you want to force no scroll
        padding: '0 20px',
        position: 'relative',
      }}
    >
      <Hero />
      <Features />
      <About />
    </div>
  );
}