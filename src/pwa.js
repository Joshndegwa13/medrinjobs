import { Workbox } from 'workbox-window';

export const registerSW = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    const wb = new Workbox('/sw.js');

    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        if (confirm('New content is available! Click OK to refresh.')) {
          window.location.reload();
        }
      }
    });

    wb.register().catch(error => {
      console.error('Service worker registration failed:', error);
    });
  }
};