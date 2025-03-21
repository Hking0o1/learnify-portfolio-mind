
import { useEffect } from 'react';

export function useScrollAnimation() {
  useEffect(() => {
    // Function to check if an element is in viewport
    const isInViewport = (element: Element) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85
      );
    };

    // Function to handle scroll and animate elements
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach((element) => {
        if (isInViewport(element)) {
          element.classList.add('animated');
        }
      });
    };

    // Initial check
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
}

export function useCursorAnimation() {
  useEffect(() => {
    // Create cursor elements
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'cursor-outline';
    document.body.appendChild(cursorOutline);

    // Function to move cursors
    const moveCursors = (e: MouseEvent) => {
      const posX = e.clientX;
      const posY = e.clientY;

      // Move the cursor dot immediately
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      // Move the cursor outline with a slight delay
      setTimeout(() => {
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
      }, 80);
    };

    // Function to handle mouse hover on interactive elements
    const addHoverClass = () => {
      document.body.classList.add('cursor-hover');
    };

    const removeHoverClass = () => {
      document.body.classList.remove('cursor-hover');
    };

    // Function to handle mouse click
    const addClickClass = () => {
      document.body.classList.add('cursor-click');
      setTimeout(() => {
        document.body.classList.remove('cursor-click');
      }, 300);
    };

    // Add event listeners
    document.addEventListener('mousemove', moveCursors);
    document.addEventListener('mousedown', addClickClass);

    // Add event listeners for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
    interactiveElements.forEach((element) => {
      element.addEventListener('mouseenter', addHoverClass);
      element.addEventListener('mouseleave', removeHoverClass);
    });

    // Clean up
    return () => {
      document.removeEventListener('mousemove', moveCursors);
      document.removeEventListener('mousedown', addClickClass);
      
      interactiveElements.forEach((element) => {
        element.removeEventListener('mouseenter', addHoverClass);
        element.removeEventListener('mouseleave', removeHoverClass);
      });
      
      if (cursorDot.parentNode) {
        document.body.removeChild(cursorDot);
      }
      
      if (cursorOutline.parentNode) {
        document.body.removeChild(cursorOutline);
      }
    };
  }, []);
}
