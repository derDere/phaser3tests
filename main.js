const electron = require('electron');
const process = require('process');
const {app, BrowserWindow, ipcMain, Menu} = electron;

app.on('ready', () => {
	let frmMain = new BrowserWindow({width: 'auto', height: 'auto', backgroundColor: '#000'});
	frmMain.loadURL(`file://${__dirname}/main.html`);
	frmMain.setMenu(null);
	frmMain.maximize();
	if(process.argv.indexOf("debug") > -1) {
		frmMain.openDevTools();
	}
});
