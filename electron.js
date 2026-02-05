const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  // 检查是否为开发环境（dist目录存在则为生产环境）
  const isProduction = fs.existsSync(path.join(__dirname, 'dist', 'index.html'));

  if (isProduction) {
    // 生产环境：加载打包后的文件
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  } else {
    // 开发环境：连接到Vite服务器
    mainWindow.loadURL('http://localhost:3000');
    // 开发模式下打开开发者工具
    // mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
