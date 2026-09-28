# Frontend Villa San Martin

Este proyecto contiene dos frontends que conviven sobre el mismo codigo base:

- `webapp`: usa `src/App.tsx`, `src/components/Layout.tsx` y `src/index.css`.
- `mobile app`: usa `src/mobile/MobileApp.tsx`, `src/mobile/MobileLayout.tsx` y `src/mobile/mobile.css`.

Ambos comparten pantallas, servicios, hooks, tipos y assets. La separacion esta en la entrada de React: `src/main.tsx` carga la app web o mobile segun el modo de Vite.

## Comandos

```bash
npm run dev:web
npm run dev:mobile
npm run build:web
npm run build:mobile
```

`npm run build` equivale a `build:web` y genera `dist`.

`npm run build:mobile` genera `dist-mobile`. Capacitor apunta a ese directorio, por eso para sincronizar Android se puede usar:

```bash
npm run cap:sync:android
```
