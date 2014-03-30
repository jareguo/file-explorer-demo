// export shell for nodejs
global.shell = require('nw.gui').Shell;
// start server
require('server/index');

// golbal varialbes
global.$ = $;
global.SERVER_URL = 'http://localhost:8888/';
var defaultPath = process.cwd();

// import
var AddressBar = require('address_bar').AddressBar;
var Folder = require('folder_view').Folder;

$(document).ready(function () {
    var folder = new Folder($('#files'));
    var addressbar = new AddressBar($('#addressbar'));
    
    folder.open(defaultPath);
    addressbar.set(defaultPath);

    folder.on('navigate', function (filepath, type) {
        if (type == 'folder' || type == 'drive') {
            addressbar.enter(filepath);
        }
        else {
            $.get(global.SERVER_URL + "open", { path: filepath })
                .error(function () {
                    window.alert('failed to open: ' + filepath);
                });
        }
    });

    addressbar.on('navigate', function (dir) {
        folder.open(dir);
    });

    if (process.platform == 'win32') {
        addressbar.on('select drive', function () {
            folder.selectDrive();
        });
    }
});