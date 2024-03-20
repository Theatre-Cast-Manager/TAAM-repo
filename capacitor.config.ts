import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "Theatre_Auditions_Manager",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: false,
      backgroundColor: "#8B0000",
      splashFullScreen: true,
      splashImmersive: false,
      androidSplashResourceName: "test_logo",
      androidScaleType: "CENTER_CROP",
      iosSplash: {
        backgroundColor: "#8B0000",
        imageName: "test_logo",
        resizeMode: "cover",
        showSpinner: false,
        spinnerStyle: "small",
        spinnerColor: "dark",
        splashFullScreen: true
      }
    }
  }
};

export default config;