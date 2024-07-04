import path from 'path';
import { BrowserWindow, app, ipcMain, session, shell } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
console.log(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
console.log(process.env.CLERK_SECRET_KEY)
if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Modify the session's content security policy
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval';"
        ]
      }
    });
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
  }
})();

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    (async () => {
      await app.whenReady();

      const mainWindow = createWindow('main', {
        width: 1000,
        height: 600,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
          nodeIntegration: false,
          contextIsolation: true,
        },
      });

      if (isProd) {
        await mainWindow.loadURL('app://./home');
      } else {
        const port = process.argv[2];
        await mainWindow.loadURL(`http://localhost:${port}/home`);
      }
    })();
  }
});

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`);
});

ipcMain.on('open-directory', (event, dirPath) => {
  shell.openPath(dirPath)
    .then(response => {
      if (response) {
        console.error(response);
      } else {
        console.log('Directory opened successfully');
      }
    })
    .catch(err => console.error(err));
});
