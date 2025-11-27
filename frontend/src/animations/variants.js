// src/animations/variants.js

// 1. Container Stagger (For Lists/Sidebar)
// This makes items pop in one by one (cascade effect)
export const containerVar = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Speed of the cascade
      delayChildren: 0.1
    }
  }
};

// 2. Item Fade In (The children of the container)
export const itemVar = {
  hidden: { y: 10, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 }
  }
};

// 3. Smooth Tab Switch (For Terminal)
export const tabContentVar = {
  hidden: { opacity: 0, x: 10, filter: "blur(4px)" },
  visible: { 
    opacity: 1, 
    x: 0, 
    filter: "blur(0px)",
    transition: { duration: 0.3 } 
  },
  exit: { 
    opacity: 0, 
    x: -10, 
    filter: "blur(4px)",
    transition: { duration: 0.2 } 
  }
};

// 4. Hover Glow (For Buttons/List Items)
export const hoverGlow = {
  scale: 1.02,
  textShadow: "0px 0px 8px rgb(47, 129, 247)",
  color: "#58a6ff",
  transition: { duration: 0.2 }
};