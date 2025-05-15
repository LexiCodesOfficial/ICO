
import gsap from 'gsap';

/**
 * Animates chart elements using GSAP
 * @param selector CSS selector for the chart elements to animate
 */
export const animateChartElements = (selector: string) => {
  // Find chart elements
  const elements = document.querySelectorAll(selector);
  
  // Animate each element
  elements.forEach((element, index) => {
    gsap.fromTo(
      element,
      { 
        opacity: 0, 
        y: 20,
        scale: 0.95,
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 0.5,
        delay: index * 0.05, // Stagger effect
        ease: "power2.out"
      }
    );
  });
};

/**
 * Animates recharts specific elements
 * @param containerId The ID of the chart container
 */
export const animateRechartElements = (containerId: string) => {
  // For bars/columns
  const bars = document.querySelectorAll(`#${containerId} .recharts-bar-rectangle rect, #${containerId} .recharts-rectangle`);
  bars.forEach((bar, i) => {
    gsap.fromTo(bar, 
      { scaleY: 0, transformOrigin: 'bottom' },
      { scaleY: 1, duration: 0.8, delay: i * 0.03, ease: "elastic.out(1, 0.5)" }
    );
  });

  // For lines
  const lines = document.querySelectorAll(`#${containerId} .recharts-line-curve`);
  lines.forEach(line => {
    const length = (line as SVGPathElement).getTotalLength();
    gsap.fromTo(line, 
      { strokeDasharray: length, strokeDashoffset: length },
      { strokeDashoffset: 0, duration: 1.5, ease: "power3.out" }
    );
  });

  // For pie/donut charts
  const sectors = document.querySelectorAll(`#${containerId} .recharts-sector`);
  sectors.forEach((sector, i) => {
    gsap.fromTo(sector, 
      { opacity: 0, scale: 0.8, transformOrigin: 'center' },
      { opacity: 1, scale: 1, duration: 0.5, delay: i * 0.1, ease: "back.out(1.7)" }
    );
  });

  // For dots on line/scatter charts
  const dots = document.querySelectorAll(`#${containerId} .recharts-dot`);
  dots.forEach((dot, i) => {
    gsap.fromTo(dot, 
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.3, delay: 0.8 + (i * 0.03), ease: "back.out(2)" }
    );
  });
};
