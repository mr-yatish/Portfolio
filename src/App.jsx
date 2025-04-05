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
        y: -300,
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
        y: -400,
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
        y: 400,
        opacity: 0,
        scrollTrigger: {
          trigger: "#workSection",
          start: "top center",
          end: "bottom top",
          scrub: true,
          scroller: "#smooth-content", // Use the locomotive-scroll container
        },
      });
    }
    gsap.to("#ourServices", {
      y: -100,
      scrollTrigger: {
        trigger: "#workSection",
        start: "center bottom",
        end: "bottom center",
        scrub: true,
        scroller: "#smooth-content", // Use the locomotive-scroll container
      },
    });
  }, []);

  // Services
  const services = [
    {
      id: "001",
      name: "Web Development",
      description:
        "We build beautiful and functional websites that help you grow your business.",
    },
    {
      id: "002",
      name: "App Development",
      description:
        "We build beautiful and functional apps that help you grow your business.",
    },
    {
      id: "003",
      name: "Mentainence & Support",
      description:
        "We provide mentainence and support for your website and app.",
    },
  ];

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
          <div className=" flex w-full h-40 justify-between items-center px-30 max-md:px-5 head z-10">
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
          <div className="sticky shadow-[20px_20px_160px_150px_rgba(000,000,000,0.9)] bg-black w-full h-max select-none py-10">
            {/* Works */}
            <div
              id="workSection"
              className="flex justify-between max-md:flex-col max-md:gap-10 max-md:mt-5  gap-20 w-full h-max text-white  px-30 max-md:px-5 mt-36  "
            >
              <div className="text-white h-max max-md:w-full  w-1/2   text-8xl max-md:text-4xl font-bold mt-20 max-md:mt-0 flex flex-col  justify-center items-start gap-20  max-md:gap-8">
                <div className="flex gap-2 justify-between items-center workHead">
                  <h2 className="flex gap-2">
                    Our{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#328EA9] to-[#016c87]">
                      work
                    </span>
                  </h2>
                  <span className="border border-white rounded-full h-max text-base  text-nowrap px-2 mt-5 max-md:mt-2">
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
              <div className=" w-1/2 max-lg:w-full h-max flex flex-col gap-20 max-md:gap-8  ">
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
            </div>
            {/* Our Services */}
            <div
              id="ourServices"
              className="  flex justify-start flex-col max-md:gap-10  gap-20 w-full h-max mt-40 text-white  px-30 max-md:px-5"
            >
              <div className="flex gap-2 serviceHead   items-center text-8xl max-md:text-4xl font-bold ">
                <h2 className="flex gap-2">
                  My{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#328EA9] to-[#016c87]">
                    services
                  </span>
                </h2>
                <span className="border border-white rounded-full h-max text-base  text-nowrap px-2 mt-5 max-md:mt-2">
                  3 Services
                </span>
              </div>
              {/* Services */}
              <div className="w-full h-max flex justify-start flex-wrap items-start gap-0">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex-1 p-4 flex flex-col gap-3 h-min"
                  >
                    <h5 className="border-b-[1px] border-white py-2 text-gray-300 font-medium">
                      {service.id}
                    </h5>
                    <div className="group flex flex-col gap-4  ">
                      <h3 className="text-nowrap py-3 text-2xl z-[20] bg-black tracking-wide font-semibold cursor-pointer">
                        {service.name}
                      </h3>
                      <p className="border-b-[1px] border-white pb-6 z-10 -translate-y-16 group-hover:translate-y-0 transition-all  duration-500 ease-in-out">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* About me */}
            <div
              id="aboutMe"
              className=" flex justify-start flex-col max-md:gap-10  gap-12 w-full h-max   text-white  px-30 max-md:px-5"
            >
              <div className="flex gap-2  items-center text-8xl max-md:text-4xl font-bold ">
                <h2>
                  About{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#328EA9] to-[#016c87]">
                    me
                  </span>
                </h2>
                <span className="border border-white rounded-full h-max text-base  px-2 mt-5 max-md:mt-2">
                  developer
                </span>
              </div>
              <div className="paragraph ">
                <p className="flex flex-col leading-6">
                  <span className="text-xl">
                    {" "}
                    Hi, I'm Yatish Prajapat —{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#328EA9] to-[#016c87] text-nowrap">
                      Full Stack Developer
                    </span>
                  </span>{" "}
                  <br />
                  <span className="text-justify ">
                    I am a passionate Full Stack Developer with hands-on
                    experience in a wide range of technologies across both web
                    and mobile application development. I have worked on several
                    real-world and live projects, which have sharpened my skills
                    in building scalable, user-friendly, and performance-driven
                    applications. Coming from a management background, I bring a
                    unique blend of technical expertise and business insight.
                    I’m always curious to explore new tools and technologies and
                    have a strong drive to solve real-life problems through
                    innovative software solutions.{" "}
                  </span>
                </p>
              </div>
              <div className="w-full grid grid-cols-3 max-md:grid-cols-1 gap-4">
                <div className="aspect-square overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2106&auto=format&fit=crop"
                    alt="Coding"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-square overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop"
                    alt="Developer workspace"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-square overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
                    alt="Code editor"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
            {/* Contact Section */}
            <div
              id="contactSection"
              className=" flex justify-start flex-col max-md:gap-10  gap-12 w-full h-max   text-white  px-30 max-md:px-5 mt-32"
            >
              <div className="flex gap-2  items-center text-8xl max-md:text-4xl font-bold border-b-[1px] border-white pb-10">
                <h2>
                  Let's{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#328EA9] to-[#016c87]">
                    work
                  </span>
                </h2>
                <span className="border border-white rounded-full h-max text-base  px-2 mt-5 max-md:mt-2">
                  together
                </span>
              </div>
              <div className="w-full h-max flex justify-between gap-2 max-lg:flex-col max-lg:items-center max-lg:gap-10 ">
                <div className="w-[65%] bg0 h-full max-sm:w-full ">
                  <form className="w-full h-full flex flex-col gap-10 lg:p-20 ">
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-3 flex-1">
                        <label htmlFor="firstName" className="font-semibold">
                          First name
                        </label>
                        <input
                          type="text"
                          placeholder="Your first name"
                          id="firstName"
                          className="w-full  border-[1px] border-gray-400 p-3 outline-none placeholder:font-semibold"
                        />
                      </div>
                      <div className="flex flex-col gap-3 flex-1">
                        <label htmlFor="lastName" className="font-semibold">
                          Last name
                        </label>
                        <input
                          type="text"
                          placeholder="Your last name"
                          id="lastName"
                          className="w-full  border-[1px] border-gray-400 p-3 outline-none placeholder:font-semibold"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <label htmlFor="email" className="font-semibold">
                        Mail Address
                      </label>
                      <input
                        type="email"
                        placeholder="Your mail address"
                        className="w-full  border-[1px] border-gray-400 p-3 outline-none placeholder:font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label htmlFor="message" className="font-semibold">
                        Your message
                      </label>
                      <textarea
                        placeholder="Your message"
                        className="w-full  border-[1px] border-gray-400 p-3 outline-none placeholder:font-semibold resize-none  "
                        rows={7}
                        cols={7}
                      />
                    </div>
                    <button
                      type="submit"
                      className="p-4 max-lg:w-full max-md:self-center max-md:-mt-3 cursor-pointer bg-white text-black flex justify-center items-center w-max px-10 tracking-wider self-end hover:bg-[#0E728D] hover:text-white hover:text-shadow-white/40 hover:text-shadow-lg transition-all ease-in-out  duration-400 "
                    >
                      Send Message
                    </button>
                  </form>
                </div>
                <div className="w-[35%] max-lg:w-[65%]   h-full  max-sm:w-full max-md:h-max lg:py-28 ">
                  <div className="w-full h-full  border-[1px] border-gray-400 p-14 max-lg:px-4 max-lg:py-8  flex justify-between flex-col gap-10">
                    <div className="flex flex-col gap-2">
                      <h3>ADDRESS</h3>
                      <p>
                        Kannod 455332 , MP , <br />
                        India
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3>CONTACT INFO</h3>
                      <p className="cursor-pointer">Phone : +91 8871760196</p>
                      <p className="cursor-pointer">
                        Email : yatishprajapat.official@gmail.com
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3>FOLLOW ME</h3>
                      <p className="cursor-pointer">001 : Instagram</p>
                      <p className="cursor-pointer">002 : Twitter</p>
                      <p className="cursor-pointer">003 : LinkedIn</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="w-full  h-[40vh] max-md:h-max  z-10 px-30 py-14  max-md:px-5 flex flex-col justify-between gap-10">
              <div className="line border-b-[1px] border-white mb-8"></div>
              <h4 className="text-white text-5xl font-bold tracking-wider relative w-max  h-max p-0">YP <span className=" absolute top-1/2 -translate-y-1/2 left-0  bg-black line w-full h-1" ></span></h4>
              <nav>
                <ul className="capitalize flex gap-6 text-white text-lg max-md:flex-col">
                  <li>Home</li>
                  <li>Work</li>
                  <li>Services</li>
                  <li>About Us</li>
                  <li>Contact</li>
                </ul>
              </nav>
              <h5 className="text-white text-lg flex justify-between max-md:flex-wrap max-md:gap-2  ">© Yatish Prajapat 2025 - Present <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#328EA9] to-[#016c87]">Devloped by Yatish Prajapat</span></h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
