import { app, BrowserWindow,Tray,Menu } from 'electron'
const path = require('path')
const os = require('os')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
// 托盘对象
let appTray = null
function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  if (process.env.NODE_ENV === 'development') {
    BrowserWindow.addDevToolsExtension(
      path.join(os.homedir(), '/AppData/Local/Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/5.1.1_0')
    )
  }
  // const trayMenuTemplate = [
  //
  // ]
  // // 系统托盘图标
  // const appTray = new Tray(path.join(__dirname, '/static/icon.ico'))
  // let win = new BrowserWindow({ icon:path.join(__dirname, '/static/icon.ico') })
  // // 图标的上上下文
  // const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
  // // 设置此托盘图标的悬停提示内容
  // appTray.setToolTip('蓉易')
  // // 设置此图标的上下文菜单
  // appTray.setContextMenu(contextMenu)
  // // 主窗口显示隐藏切换
  // appTray.on('click', () => {
  //   mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  // })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
