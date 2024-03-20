// SplashScreen.tsx
import React, { useEffect, useState } from 'react';
import './splashscreen.css'; // Import your CSS file

const SplashScreen: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Hide the splash screen after 2 seconds
  }, []);

  return showSplash ? (
    <div className="splash-screen">
      {/* Add your splash screen content here */}
      <img src="TAAM.png" alt="Splash Screen Image" />
    </div>
  ) : null;
};

export default SplashScreen;