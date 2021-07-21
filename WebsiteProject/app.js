const slides = document.querySelectorAll(".slide");
const nav = document.querySelector(".nav-header");

slides.forEach((slide) => {
  const img = slide.querySelector("img");
  const imgReveal = slide.querySelector(".reveal-img");
  const textReaveal = slide.querySelector(".reveal-text");
  const tl = new gsap.timeline({
    defaults: {
      duration: 1,
      ease: "power2.inOut",
    },
    scrollTrigger: {
      trigger: slide,
      start: "top center",
      markers: true,
      toggleActions: "play none none reverse",
    },
  });
  tl.fromTo(img, { scale: 2 }, { scale: 1 })
    .fromTo(imgReveal, { x: "0%" }, { x: "100%" }, "-=1")
    .fromTo(textReaveal, { x: "0%" }, { x: "100%" }, "-=0.75")
    .fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.5");
});

const mouse = document.querySelector('.cursor')
const mouseText = mouse.querySelector('span')
const burger = document.querySelector('.burger-menu')
function cursor(e){
   mouse.style.top = e.pageY + "px"
  mouse.style.left = e.pageX + "px"
}
function activeCursor(e){
  const item = e.target
  if(item.id === 'logo' || item.classList.contains('burger-menu')){
    mouse.classList.add('nav-active')
  } else {
    mouse.classList.remove('nav-active')
  }
  if(item.classList.contains("explore")){
    mouse.classList.add('explore-active')
    mouseText.innerText = "Tap"
    gsap.to('.title-swipe',1,{y:"0%"})
  } else {
    mouse.classList.remove('explore-active')
    mouseText.innerText = ""
    gsap.to('.title-swipe',1,{y:"100%"})
  }
}
function navToggle(e){
  if(!e.target.classList.contains('active')){
    e.target.classList.add('active')
    gsap.to('.line-1', 0.5, {rotate: "45", y: "5", background: "black"})
    gsap.to('.line-2', 0.5, {rotate: "-45", y: "-5", background: "black"})
    gsap.to('.logo', 1, {color: "black"})
    gsap.to('.nav-bar', 1, {clipPath: 'circle(4000px at 100% -10%)'})
    document.body.classList.add('hide')
  } else {
    e.target.classList.remove('active')
    gsap.to('.line-1', 0.5, {rotate: "0", y: "0", background: "white"})
    gsap.to('.line-2', 0.5, {rotate: "0", y: "-0", background: "white"})
    gsap.to('.logo', 1, {color: "white"})
    gsap.to('.nav-bar', 1, {clipPath: 'circle(50px at 100% -10%)'})
    document.body.classList.remove('hide')
  }
}

// barba page transitions

barba.init({
  views: [{
    namespace: 'home',
    beforeEnter(){
      animateSlides()
    },
    beforeLeave(){
      slideScene.destroy()
      pageScene.destroy()
      controller.destroy()
    }
  },
  {
  namespace: 'fashion'
  }
],
transition: [{
  leave({current, next}){
    let done = this.async();
    window.scrollTo(0, 0)
    const tl = gsap.timeline({defaults: {ease: 'power2.inOut'}});
    tl.fromTo(current.container, 1, {opacity: "1"}, {opacity: "0" , onComplete: done,} )
  },
  enter({current, next}){
    let done = this.async();
    const tl = gsap.timeline({defaults: {ease: 'power2.inOut'}});
    tl.fromTo(next.container, 1, {opacity: "0"}, {opacity: "1", onComplete: done})
  }
}]
})

window.addEventListener('mousemove', cursor)
window.addEventListener('mouseover', activeCursor)
burger.addEventListener('click', navToggle)