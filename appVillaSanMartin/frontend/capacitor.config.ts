import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ar.com.villaapp.vsm',
  appName: 'Villa San Martín',
  webDir: 'dist-mobile',
  server: {
    // En producción apunta al dominio real
    // url: 'https://villaapp.com',
    // cleartext: false,

    // En desarrollo local apunta al backend
    // Descomentá esto para probar con el servidor local:
    // url: 'http://192.168.x.x:8080',
    // cleartext: true,
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
    backgroundColor: '#f4f6fa',
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0d1f4e',
      showSpinner: false,
    },
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#0d1f4e',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
    },
  },
};

export default config;
