gsap.registerPlugin(ScrollToPlugin);

const pinNav = (controller) => {
   
   // Stick nav after header, parameter takes scrollmagic controller
   const pinTrigger = document.querySelector(".js--section-features");
   const scene = new ScrollMagic.Scene({
         offset: -60,
         triggerElement: pinTrigger,
         triggerHook: 0
      })
      // .on('start', event => {
      //    const pinElement = document.querySelector("nav");
      //    event.scrollDirection === "FORWARD" ? 
      //       pinElement.classList.add('sticky') :
      //       pinElement.classList.remove('sticky');
      // })
      // above code does same thing as setClassToggle
      .setClassToggle("nav", "sticky")
      // .addIndicators({trigger: "start"})
      .addTo(controller);
}

const scrollToSection = (controller) => (event) => {
   /*  
      callback takes scrollmagic controller, and called when event is passed in.
      scroll to position based on href attribute from event.
   */
   const href = event.target.getAttribute('href');
   let navTo = '';

   (href.slice(0, 3) === '#js') ?
      //  require destination's class to be specified after # in 'href' of an anchor
      navTo = '.'.concat(href.slice(1)) : 
      navTo = href;
  
   controller.scrollTo(target => {
      TweenMax.to(
         window, 
         1, 
         { 
            scrollTo: {
               // 1 above is for 1 sec
               // offset of 60px
               y: target - 59,
               autoKill : true
            },
            ease: Cubic.easeOut
         }
      );
   });

   if(navTo.length > 0) {
      event.preventDefault();
      controller.scrollTo(navTo);

      // code to update URL to /navTo
      if(window.history && window.history.pushState && navTo[0] !== '.') {
         history.pushState("", document.title, navTo);
      }
   }
}

const defineNavLink = (controller, navClassFrom) => {
   /*
      function to handle click navigation, takes scrollmagic controller and a 
      class from anchor or an ul.
   */
   const navFrom = document.querySelector(navClassFrom);
   const navChildren = navFrom.children;
   if(navChildren.length > 0) {
      [...navChildren].forEach(li => li.addEventListener("click", scrollToSection(controller)));
   } else if(navChildren.length === 0) {
      navFrom.addEventListener("click", scrollToSection(controller));
   } else {
      throw(Error("parameter not accepted."));
   }
   
}

const toggleMultiClasses = (target, classes) => {
   // Target have to be an Element being selected, handle toggle for multiple classes
   const cls_lst = classes.split(' ');
   cls_lst.forEach(cls => target.classList.toggle(cls));
}

const handleScreenSize = (respSize, scene) => (event) => {
   // callback for handling content duration of animation when window resized or loaded
   const currentSize = event.currentTarget.innerWidth;
   const menuElement = document.querySelector(".js--main-nav");
   const iconElement = document.querySelector(".js--nav-icon");

   if (respSize !==1200 && currentSize >=1200) {
      respSize = 1200;
      menuElement.style.transform = "translateY(0px)";
      menuElement.style.height = "auto";
      menuElement.classList.remove("hidden");
      scene.forEach(oneScene => 
         oneScene.scene.duration(oneScene.trigger.clientHeight + (2.5*Math.abs(oneScene.scene.offset())))
         );
      } else if(respSize !== 1023 && currentSize >= 1023 && currentSize < 1200) {
         respSize = 1023;
         menuElement.style.transform = "translateY(0px)";
         menuElement.style.height = "auto";
         menuElement.classList.remove("hidden");
         scene.forEach(oneScene => 
            oneScene.scene.duration(oneScene.trigger.clientHeight + (2*Math.abs(oneScene.scene.offset())))
            );
         } else if(respSize !== 767 && currentSize >= 767 && currentSize < 1023) { 
            respSize = 767;
            menuElement.style.transform = "translateY(0px)";
            menuElement.style.height = "auto";
            menuElement.classList.remove("hidden");
            scene.forEach(oneScene => 
               oneScene.scene.duration(oneScene.trigger.clientHeight + (2*Math.abs(oneScene.scene.offset())))
               );
            } else if(respSize !== 480 && currentSize >= 480 && currentSize < 767) {
               respSize = 480;
               menuElement.style.transform = "translateY(-200px)";
               menuElement.classList.add("hidden");
               iconElement.children[0].name = "menu";
               scene.forEach(oneScene => 
                  oneScene.scene.duration(oneScene.trigger.clientHeight + (2*Math.abs(oneScene.scene.offset())))
                  );
            } else if(respSize !== 0 && currentSize >= 0 && currentSize < 480) {
               respSize = 0;
               menuElement.style.transform = "translateY(-200px)";
               menuElement.classList.add("hidden");
               iconElement.children[0].name = "menu";
               scene.forEach(oneScene => 
                  oneScene.scene.duration(oneScene.trigger.clientHeight + (2*Math.abs(oneScene.scene.offset())))
                  );
            }
}

const scrollAnimationFade = (controller, trigger, offset) => {
   /* 
      Create scroll animation based on class to be triggered,
      require a scrollmagic controller, and offset can be used to
      adjust starting point and fading point.
    */
   const animeTrigger = document.querySelector(trigger);
   const scene = new ScrollMagic.Scene({
      triggerElement: animeTrigger,
      triggerHook: 0.5,
      offset: -offset
   })
   .on("add", event => {
      animeTrigger.classList.add("animate__animated");
   })
   // .setClassToggle(target, animation)
   // setClassToggle does not support multi-Classes toggle in pure js
   .on("enter", event => {
      animeTrigger.classList.add("animate__fadeIn");
      animeTrigger.classList.remove("animate__fadeOut");
   })
   .on("leave", event => {
      animeTrigger.classList.add("animate__fadeOut");
      animeTrigger.classList.remove("animate__fadeIn");
   })
   // .addIndicators({trigger: "start"})
   .addTo(controller);

   return {scene: scene, trigger: animeTrigger}
}

const scrollAnimationSlide = (controller, trigger) => {
   const animeTrigger = document.querySelector(trigger);
   const scene = new ScrollMagic.Scene({
      triggerElement: animeTrigger,
      triggerHook: 0.6,
      offset: -120
   })
   .on("add", event => {
      animeTrigger.classList.add("animate__animated");
   })
   .on("enter", event => {
      if(event.state === "DURING"){
         animeTrigger.classList.remove("animate__fadeOutLeft");
         animeTrigger.classList.add("animate__fadeInUp");
         event.currentTarget.offset(-230);
      }
   })
   .on("leave", event => {
      if(event.state === "BEFORE" && event.scrollDirection === "REVERSE"){
         animeTrigger.classList.remove("animate__fadeInUp");
         animeTrigger.classList.add("animate__fadeOutLeft");
         event.currentTarget.offset(-120);
      }
   })
   // .addIndicators({trigger: "start"})
   .addTo(controller);

}

const scrollAnimationPulse = (controller, trigger) => {
   const animeTrigger = document.querySelector(trigger);
   const scene = new ScrollMagic.Scene({
      triggerElement: animeTrigger,
      triggerHook: 0.38,
      offset: -70
   })
   .on("add", event => {
      animeTrigger.classList.add("animate__animated");
   })
   .on("enter", event => {
      if(event.state === "DURING"){
         animeTrigger.classList.add("animate__pulse");
      }
   })
   .on("leave", event => {
      if(event.state === "BEFORE" && event.scrollDirection === "REVERSE"){
         animeTrigger.classList.remove("animate__pulse");
      }
   })
   // .addIndicators({trigger: "start"})
   .addTo(controller);

}

const slideMenu = (menu, menuButton) => {
   const menuElement = document.querySelector(menu);
   menuElement.classList.add("hidden");
   document.querySelector(menuButton).addEventListener("click", event => {
      event.preventDefault();

      if(menuElement.classList.contains("hidden")) {
         menuElement.classList.toggle("hidden");
         event.currentTarget.children[0].name = "close";
         menuElement.style.height = 'auto';

         const height = menuElement.clientHeight + 'px';
         menuElement.style.height = "0px";

         setTimeout(() => {
            menuElement.style.transform = "translateY(0px)";
            menuElement.style.height = height;
         }, 0);
      } else {
         event.currentTarget.children[0].name = "menu";
         menuElement.style.transform = "translateY(-200px)";
         menuElement.style.height = "0px";
         menuElement.addEventListener("transitionend", () => {
            menuElement.classList.toggle("hidden");
         }, { once: true})
      }
      
   });
}

const main = () => {
   let respSize = window.innerWidth;
   // holds the state for max window size for responsive container, used to update duration.
   const scene = [];
   const controller = new ScrollMagic.Controller();
   pinNav(controller);
   defineNavLink(controller, ".js--scroll-to-plan");
   defineNavLink(controller, ".js--scroll-to-start");
   defineNavLink(controller, ".js--main-nav");
   slideMenu(".js--main-nav", ".js--nav-icon");
   scene.push(scrollAnimationFade(controller, ".js--wp-1", 150));
   scrollAnimationSlide(controller, ".js--wp-2");
   scene.push(scrollAnimationFade(controller, ".js--wp-3", 80));
   scrollAnimationPulse(controller, ".js--wp-4");
   // Require the duration to be updated after the web is fullyloaded or resized
   window.addEventListener("load", handleScreenSize(respSize, scene));
   window.addEventListener("resize", handleScreenSize(respSize, scene));

}

// equivalent to ready()
if(document.readyState === "complete" || 
   (document.readyState !== "loading" && !document.documentElement.doScroll)) {
      main();
   } else{
      document.addEventListener("DOMContentLoaded", main);
   }
