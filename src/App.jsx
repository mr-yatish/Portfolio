import { useState, useRef } from 'react';

function App() {
  const [stars, setStars] = useState([]);
  const [fallingStars, setFallingStars] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isRaining, setIsRaining] = useState(false);
  const starIdCounter = useRef(0);
  const colors = [
    '#FFD700', '#FFA500', '#FF69B4', '#FFB6C1', '#FFC0CB',
    '#FFD700', '#FFA500', '#FF69B4', '#FFB6C1', '#FFC0CB',
    '#FFD700', '#FFA500', '#FF69B4', '#FFB6C1', '#FFC0CB'
  ];

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const x = event.clientX;
      const y = event.clientY;

      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newStar = { 
        id: `star-${starIdCounter.current++}`, 
        x, 
        y, 
        color: randomColor 
      };

      setStars((prevStars) => [...prevStars, newStar]);

      setTimeout(() => {
        setStars((prevStars) => prevStars.filter((star) => star.id !== newStar.id));
      }, 3000);
    }
  };

  const handleClick = (event) => {
    const x = event.clientX;
    const y = event.clientY;

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newStar = { 
      id: `star-${starIdCounter.current++}`, 
      x, 
      y, 
      color: randomColor 
    };

    setStars((prevStars) => [...prevStars, newStar]);
    setTimeout(() => {
      setStars((prevStars) => prevStars.filter((star) => star.id !== newStar.id));
    }, 3000);
  }

  const createFallingStar = () => {
    const randomX = Math.random() * window.innerWidth;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newFallingStar = {
      id: `falling-star-${starIdCounter.current++}`,
      x: randomX,
      color: randomColor
    };

    setFallingStars((prevStars) => [...prevStars, newFallingStar]);

    setTimeout(() => {
      setFallingStars((prevStars) => prevStars.filter((star) => star.id !== newFallingStar.id));
    }, 3000);
  };

  const createMultipleStars = () => {
    // Create 3-5 stars at random positions
    const numStars = Math.floor(Math.random() * 3) + 3; // Random number between 3 and 5
    for (let i = 0; i < numStars; i++) {
      createFallingStar();
    }
  };

  const handleYatishClick = () => {
    if (isRaining) return; // Prevent multiple clicks while raining

    setIsRaining(true);
    
    // Create stars continuously for 5 seconds
    const startTime = Date.now();
    const interval = setInterval(() => {
      if (Date.now() - startTime > 5000) {
        clearInterval(interval);
        setIsRaining(false);
        return;
      }
      createMultipleStars();
    }, 50); // Create new stars every 50ms
  };

  return (
    <div
      className='relative w-full h-full overflow-hidden bg-[url(https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-cover bg-no-repeat'
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <div className='relative bg-cover bg-no-repeat bg-center w-full h-screen select-none'>
        <div className='flex w-full h-40 justify-between items-center px-30 max-md:px-5'>
          <h1 
            className={`text-white text-4xl max-md:text-3xl font-bold tracking-wider cursor-pointer transition-colors duration-300 
            }`}
            onClick={handleYatishClick}
          >
            YATISH
          </h1>
          <div className='z-10'>
            <button className="cursor-pointer outline-none py-2.5 relative group overflow-hidden font-medium bg-transparent text-white inline-block px-2">
              <span className="absolute bottom-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-white/30 group-hover:h-full border-b-2 border-white group-hover:border-none"></span>
              <span className="relative group-hover:text-white">Get in touch</span>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-10 w-full h-max text-white overflow-hidden px-30 max-md:px-5">
          <h2 className='text-white text-8xl max-md:text-5xl font-bold mt-10 max-md:mt-0'>
            MERN <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#328EA9] to-[#00252E]'>STACK</span> <br />
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#fff] to-[#01252D]'>DEVELOPER</span>
          </h2>
          <div className='flex flex-col gap-10 w-full items-end'>
            <div className='w-[55%] flex flex-col gap-10 max-md:w-[100%]'>
              <p className='text-white text-2xl max-md:text-xl'>
                Experienced MERN stack developer skilled in building scalable web applications with
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#328EA9] to-[#0ac2f0]'> MongoDB, Express.js, React, and Node.js</span>.
                Strong knowledge of <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#328EA9] to-[#0ac2f0]'>Next.js </span>
                for server-side rendering and performance optimization. Passionate about creating efficient and user-friendly solutions.
              </p>
              <button className="cursor-pointer w-max outline-none py-2.5 relative group overflow-hidden font-medium bg-transparent text-white inline-block px-2 z-10">
                <span className="absolute bottom-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-white/30 group-hover:h-full border-b-2 group-hover:border-none border-white"></span>
                <span className="relative group-hover:text-white">See our work</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Regular Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className='star absolute w-10 h-10 animate-star'
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            backgroundColor: star.color,
            pointerEvents: 'none'
          }}
        ></div>
      ))}

      {/* Falling Stars */}
      {fallingStars.map((star) => (
        <div
          key={star.id}
          className='star absolute w-8 h-8 animate-falling-star'
          style={{
            left: `${star.x}px`,
            backgroundColor: star.color,
            pointerEvents: 'none'
          }}
        ></div>
      ))}
    </div>
  );
}

export default App;
