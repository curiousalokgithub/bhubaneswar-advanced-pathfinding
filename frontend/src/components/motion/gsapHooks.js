import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Custom hook for GSAP hero timeline animations
 * Respects prefers-reduced-motion setting
 */
export const useGsapHeroTimeline = (triggerRef, options = {}) => {
  const timelineRef = useRef(null);
  
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      return; // Skip animations if user prefers reduced motion
    }
    
    if (!triggerRef.current) return;
    
    const {
      duration = 1.2,
      delay = 0.2,
      ease = "power3.out",
      stagger = 0.1,
      ...restOptions
    } = options;
    
    // Create timeline
    timelineRef.current = gsap.timeline({
      delay,
      ...restOptions
    });
    
    // Hero title animation
    timelineRef.current
      .from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: duration,
        ease: ease
      })
      .from(".hero-subtitle", {
        y: 50,
        opacity: 0,
        duration: duration * 0.8,
        ease: ease
      }, "-=0.6")
      .from(".hero-description", {
        y: 30,
        opacity: 0,
        duration: duration * 0.6,
        ease: ease
      }, "-=0.4")
      .from(".hero-buttons", {
        y: 30,
        opacity: 0,
        duration: duration * 0.5,
        ease: ease
      }, "-=0.3")
      .from(".hero-stats .stat-item", {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: stagger
      }, "-=0.2")
      .from(".floating-elements .element", {
        y: 100,
        opacity: 0,
        rotation: 180,
        duration: 0.8,
        ease: "power2.out",
        stagger: stagger * 2
      }, "-=0.4");
    
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [triggerRef, options]);
  
  return timelineRef.current;
};

/**
 * Custom hook for map reveal animation
 */
export const useGsapMapReveal = (mapRef) => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || !mapRef.current) {
      return;
    }
    
    const tl = gsap.timeline();
    
    tl.from(mapRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    })
    .from(".map-controls", {
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.5");
    
    return () => tl.kill();
  }, [mapRef]);
};

/**
 * Custom hook for card hover animations
 */
export const useGsapCardHover = (cardRefs) => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      return;
    }
    
    const cards = cardRefs.current || [];
    
    cards.forEach((card) => {
      if (!card) return;
      
      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -10,
          scale: 1.03,
          duration: 0.3,
          ease: "power2.out"
        });
        
        gsap.to(card.querySelector('.card-shadow'), {
          opacity: 0.2,
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out"
        });
      };
      
      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
        
        gsap.to(card.querySelector('.card-shadow'), {
          opacity: 0.1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      };
      
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  }, [cardRefs]);
};

/**
 * Custom hook for scroll-triggered animations
 */
export const useGsapScrollTrigger = (elementRef, animationConfig) => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || !elementRef.current) {
      return;
    }
    
    // Note: ScrollTrigger would need to be imported separately
    // For now, using intersection observer as fallback
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.from(entry.target, {
              y: 50,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
              ...animationConfig
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    
    observer.observe(elementRef.current);
    
    return () => observer.disconnect();
  }, [elementRef, animationConfig]);
};

/**
 * Custom hook for button pulse animation on interaction
 */
export const useGsapButtonPulse = (buttonRefs) => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      return;
    }
    
    const buttons = buttonRefs.current || [];
    
    buttons.forEach((button) => {
      if (!button) return;
      
      const handleClick = () => {
        gsap.to(button, {
          scale: 0.95,
          duration: 0.1,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(button, {
              scale: 1,
              duration: 0.2,
              ease: "back.out(1.7)"
            });
          }
        });
      };
      
      button.addEventListener('click', handleClick);
      
      return () => {
        button.removeEventListener('click', handleClick);
      };
    });
  }, [buttonRefs]);
};

/**
 * Loading animation hook
 */
export const useGsapLoadingAnimation = (loadingRef) => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || !loadingRef.current) {
      return;
    }
    
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to(loadingRef.current, {
      rotation: 360,
      duration: 2,
      ease: "none"
    });
    
    return () => tl.kill();
  }, [loadingRef]);
};
