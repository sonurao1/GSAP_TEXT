import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";

// Register GSAP plugins
gsap.registerPlugin(useGSAP, SplitText);

function App() {
  // Reference to the heading element
  const headingRef = useRef();

  useGSAP(() => {
    // Split the text into individual characters
    const split = new SplitText(headingRef.current, {
      type: "chars",
    });

    // Apply initial styles to every character
    gsap.set(split.chars, {
      fontVariationSettings: '"wght" 800', // Initial font weight
      display: "inline-block",            // Allows scale animation
    });

    // Store event listeners so we can remove them later
    const listeners = [];

    // Add hover animation to each character
    split.chars.forEach((char) => {

      // Runs when mouse enters a character
      const enter = () => {
        gsap.to(char, {
          fontVariationSettings: '"wght" 500', // Reduce font weight
          scale: 0.95,                        // Slightly shrink
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
          yPercent: -20 // Stops previous animation before starting a new one
        });
      };

      // Runs when mouse leaves a character
      const leave = () => {
        gsap.to(char, {
          fontVariationSettings: '"wght" 800', // Restore font weight
          scale: 1,                           // Restore original size
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
          yPercent:0
        });
      };

      // Attach hover events
      char.addEventListener("pointerenter", enter);
      char.addEventListener("pointerleave", leave);

      // Save listeners for cleanup
      listeners.push({ char, enter, leave });
    });

    // Cleanup function (runs when component unmounts)
    return () => {
      listeners.forEach(({ char, enter, leave }) => {
        char.removeEventListener("pointerenter", enter);
        char.removeEventListener("pointerleave", leave);
      });

      // Restore the original HTML before SplitText modified it
      split.revert();
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black flex justify-center items-center">
      <h1
        ref={headingRef}
        className="text-white text-[200px]"
        style={{
          fontFamily: '"Exo 2", sans-serif',
          fontVariationSettings: '"wght" 800',
          cursor: "default",
        }}
      >
        Hello, There!
      </h1>
    </div>
  );
}

export default App;