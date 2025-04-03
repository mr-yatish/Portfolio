import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LocomotiveScroll from "locomotive-scroll";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [stars, setStars] = useState([]);
  const [fallingStars, setFallingStars] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isRaining, setIsRaining] = useState(false);
  const starIdCounter = useRef(0);

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: document.querySelector("#smooth-content"),
      smooth: true,
      multiplier: 1.8, // Adjust the speed of the smooth scroll
    });

    // Update ScrollTrigger when locomotive-scroll updates
    scroll.on("scroll", ScrollTrigger.update);

    // Tell ScrollTrigger to use these proxy methods for the "#smooth-content" element
    ScrollTrigger.scrollerProxy("#smooth-content", {
      scrollTop(value) {
        return arguments.length
          ? scroll.scrollTo(value, 0, 0)
          : scroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.querySelector("#smooth-content").style.transform
        ? "transform"
        : "fixed",
    });

    // Refresh ScrollTrigger and update LocomotiveScroll
    ScrollTrigger.addEventListener("refresh", () => scroll.update());
    ScrollTrigger.refresh();

    return () => {
      scroll.destroy();
    };
  }, []);

  // Function to generate 1000 unique colors
  const generateColors = () => {
    const colors = [];
    const hueStep = 360 / 1000; // Distribute colors evenly across the color wheel

    for (let i = 0; i < 1000; i++) {
      const hue = (i * hueStep) % 360;
      const saturation = 70 + Math.random() * 20; // 70-90% saturation
      const lightness = 40 + Math.random() * 20; // 40-60% lightness
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }

    return colors;
  };

  const colors = generateColors();

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
        color: randomColor,
      };

      setStars((prevStars) => [...prevStars, newStar]);

      setTimeout(() => {
        setStars((prevStars) =>
          prevStars.filter((star) => star.id !== newStar.id)
        );
      }, 3000);
    }
  };

  const handleClick = (event) => {
    const x = event.clientX + window.scrollX;
    const y = event.clientY + window.scrollY;

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newStar = {
      id: `star-${starIdCounter.current++}`,
      x,
      y,
      color: randomColor,
    };

    setStars((prevStars) => [...prevStars, newStar]);
    setTimeout(() => {
      setStars((prevStars) =>
        prevStars.filter((star) => star.id !== newStar.id)
      );
    }, 3000);
  };

  const createFallingStar = () => {
    const randomX = Math.random() * window.innerWidth;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newFallingStar = {
      id: `falling-star-${starIdCounter.current++}`,
      x: randomX,
      color: randomColor,
    };

    setFallingStars((prevStars) => [...prevStars, newFallingStar]);

    setTimeout(() => {
      setFallingStars((prevStars) =>
        prevStars.filter((star) => star.id !== newFallingStar.id)
      );
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

  useEffect(() => {
    gsap.from(".head", {
      duration: 2,
      opacity: 0,
      y: -100,
      ease: "power4.inOut",
      delay: 0,
    });
    gsap.from(".swipe-left", {
      duration: 2,
      opacity: 0,
      x: -50,
      ease: "power3.in",
      delay: 1,
      stagger: 1,
    });
    gsap.from(".swipe-right", {
      duration: 2,
      opacity: 0,
      x: 50,
      ease: "power3.in",
      delay: 1,
      stagger: 1,
    });
    gsap.from(".swipe-top", {
      duration: 2,
      opacity: 0,
      y: 100,
      ease: "bounce.inOut",
      delay: 2,
      scaleX: 2,
    });

    if (window.innerWidth > 768) {
      gsap.to(".cards", {
        y: -350,
        scrollTrigger: {
          trigger: "#workSection",
          start: "top center",
          end: "bottom top",
          scrub: true,
          scroller: "#smooth-content", // Use the locomotive-scroll container
        },
      });
    }
    if (window.innerWidth > 768) {
      gsap.to(".cards2", {
        y: -450,
        scrollTrigger: {
          trigger: "#workSection",
          start: "top center",
          end: "bottom top",
          scrub: true,
          scroller: "#smooth-content", // Use the locomotive-scroll container
        },
      });
    }

    if (window.innerWidth > 768) {
      gsap.to(".workHead", {
        y: 100,
        scrollTrigger: {
          trigger: "#workSection",
          start: "top center",
          end: "bottom top",
          scrub: true,
          scroller: "#smooth-content", // Use the locomotive-scroll container
        },
      });
    }
  }, []);

  return (
    <div id="smooth-wrapper" className="h-screen">
      <div id="smooth-content">
        <div
          className="w-full flex flex-col bg-[url(https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-cover bg-no-repeat"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        >
          <div className="sticky top-0 flex w-full h-40 justify-between items-center px-30 max-md:px-5 head z-10">
            <h1
              className={`text-white text-4xl max-md:text-3xl font-bold tracking-wider cursor-pointer transition-colors duration-300 
                }`}
              onClick={handleYatishClick}
            >
              YATISH
            </h1>
            <div className="z-10">
              <button className="cursor-pointer  outline-none py-2.5 relative group overflow-hidden font-medium bg-transparent text-white inline-block px-2">
                <span className="absolute  bottom-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-white/30 group-hover:h-full border-b-2 border-white group-hover:border-none"></span>
                <span className="relative group-hover:text-white">
                  Get in touch
                </span>
              </button>
            </div>
          </div>
          <div className="sticky   bg-cover bg-no-repeat bg-center w-full h-full select-none mb-20">
            <div className="flex flex-col gap-10 w-full h-max text-white overflow-hidden px-30 max-md:px-5">
              <h2 className="text-white text-8xl max-md:text-5xl font-bold mt-10 max-md:mt-0 swipe-left">
                MERN{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#328EA9] to-[#00252E]">
                  STACK
                </span>{" "}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffff] to-[#024a5c]">
                  DEVELOPER
                </span>
              </h2>
              <div className="flex flex-col gap-10 w-full items-end">
                <div className="w-[55%] flex flex-col gap-10 max-md:gap-4 max-md:w-[100%]">
                  <p className="text-white text-2xl max-md:text-xl swipe-right">
                    Experienced MERN stack developer skilled in building
                    scalable web applications with
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#328EA9] to-[#0ac2f0]">
                      {" "}
                      MongoDB, Express.js, React, and Node.js
                    </span>
                    . Strong knowledge of{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#328EA9] to-[#0ac2f0]">
                      Next.js{" "}
                    </span>
                    for server-side rendering and performance optimization.
                    Passionate about creating efficient and user-friendly
                    solutions.
                  </p>
                  <button
                    onClick={() => {
                      const scroll = new LocomotiveScroll({
                        el: document.querySelector("#smooth-content"),
                        smooth: true,
                        multiplier: 1.8,
                      });
                      scroll.scrollTo("#workSection");
                    }}
                    className="swipe-top cursor-pointer w-max outline-none py-2.5 relative group overflow-hidden font-medium bg-transparent text-white inline-block px-2 z-10"
                  >
                    <span className="absolute bottom-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-white/30 group-hover:h-full border-b-2 group-hover:border-none border-white"></span>
                    <span className="relative group-hover:text-white">
                      See our work
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Regular Stars */}
          {stars.map((star) => (
            <div
              key={star.id}
              className="star absolute w-10 h-10 animate-star"
              style={{
                left: `${star.x}px`,
                top: `${star.y}px`,
                backgroundColor: star.color,
                pointerEvents: "none",
              }}
            ></div>
          ))}

          {/* Falling Stars */}
          {fallingStars.map((star) => (
            <div
              key={star.id}
              className="star absolute w-8 h-8 animate-falling-star"
              style={{
                left: `${star.x}px`,
                backgroundColor: star.color,
                pointerEvents: "none",
              }}
            ></div>
          ))}
          {/* Works */}
          <div
            className="sticky shadow-[20px_20px_160px_150px_rgba(000,000,000,0.9)] bg-black w-full h-full select-none py-10"
            id="workSection"
          >
            <div className="flex justify-between max-md:flex-col max-md:gap-10 max-md:mt-5  gap-20 w-full h-max text-white  px-30 max-md:px-5 mt-30 ">
              <div className="text-white h-max max-md:w-full  w-1/2   text-8xl max-md:text-4xl font-bold mt-20 max-md:mt-0 flex flex-col  justify-center items-start gap-20  max-md:gap-8">
                <div className="flex gap-2 justify-between items-center workHead">
                  <h2>
                    Our{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#328EA9] to-[#016c87]">
                      work
                    </span>
                  </h2>
                  <span className="border-2 border-white rounded-full h-max text-base  px-2 mt-5 max-md:mt-2">
                    12 Projects
                  </span>
                </div>
                {/* Cards */}
                <div className="w-full h-96 flex flex-col cards  ">
                  <div className="w-full h-[90%] bg-red-200">
                    <img
                      src="public/images/Project1.png"
                      alt=""
                      className="w-full h-full object-cover grayscale-50 hover:grayscale-0 transition-all duration-300  cursor-pointer"
                    />
                  </div>
                  <div className="text-white text-lg  max-md:text-sm font-bold flex justify-between gap-4 px-1 py-4">
                    <span>Vinay Bajarangi - Astrology Site</span>
                    <span className=" text-base max-md:text-sm  max-md:py-0 flex items-center justify-center px-2 py-1 border border-white rounded-full cursor-pointer">
                      1/12/2024
                    </span>
                  </div>
                </div>
                <div className="w-full h-96 flex flex-col cards  ">
                  <div className="w-full h-[90%] bg-red-200">
                    <img
                      src="public/images/Project1.png"
                      alt=""
                      className="w-full h-full  grayscale-50 hover:grayscale-0 transition-all duration-300  cursor-pointer"
                    />
                  </div>
                  <div className="text-white text-lg  max-md:text-sm font-bold flex justify-between gap-4 px-1 py-4">
                    <span>Vinay Bajarangi - Astrology Site</span>
                    <span className=" text-base max-md:text-sm  max-md:py-0 flex items-center justify-center px-2 py-1 border border-white rounded-full cursor-pointer">
                      1/12/2024
                    </span>
                  </div>
                </div>
              </div>
              {/* Cards */}
              <div className=" w-1/2 max-md:w-full h-max flex flex-col gap-20 max-md:gap-8  ">
                <div className="w-full h-96 flex flex-col cards2  ">
                  <div className="w-full h-[90%] bg-red-200">
                    <img
                      src="public/images/Project1.png"
                      alt=""
                      className="w-full h-full object-cover grayscale-50 hover:grayscale-0 transition-all duration-300  cursor-pointer"
                    />
                  </div>
                  <div className="text-white text-lg  max-md:text-sm font-bold flex justify-between gap-4 px-1 py-4">
                    <span>Vinay Bajarangi - Astrology Site</span>
                    <span className=" text-base max-md:text-sm  max-md:py-0 flex items-center justify-center px-2 py-1 border border-white rounded-full cursor-pointer">
                      1/12/2024
                    </span>
                  </div>
                </div>
                <div className="w-full h-96 flex flex-col cards2  ">
                  <div className="w-full h-[90%] bg-red-200">
                    <img
                      src="public/images/Project1.png"
                      alt=""
                      className="w-full h-full object-cover grayscale-50 hover:grayscale-0 transition-all duration-300  cursor-pointer"
                    />
                  </div>
                  <div className="text-white text-lg  max-md:text-sm font-bold flex justify-between gap-4 px-1 py-4">
                    <span>Vinay Bajarangi - Astrology Site</span>
                    <span className=" text-base max-md:text-sm  max-md:py-0 flex items-center justify-center px-2 py-1 border border-white rounded-full cursor-pointer">
                      1/12/2024
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
