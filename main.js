
var defaultPath = process.cwd();

// golbal varialbes

global.$ = $;

// import

var events = require('events');
var path = require('path');
var shell = require('nw.gui').Shell;

var AddressBar = require('address_bar').AddressBar;
var Folder = require('folder_view').Folder;

// main

$(document).ready(function () {

    // init

    var folder = new Folder($('#files'));
    var addressbar = new AddressBar($('#addressbar'));

    function openDir(dir) {
        if (dir && dir.slice(-1) != path.sep) {
            dir += path.sep;    // 如果不以/结尾，D:会被path.normalize转成D:.
        }
        addressbar.set(dir);
        folder.open(dir);
    }

    // register events

    folder.on('navigate', function (filepath, type) {
        if (type == 'folder' || type == 'drive') {
            openDir(filepath);
        }
        else {
            shell.openItem(filepath);
        }
    });

    addressbar.on('navigate', function (dir) {
        openDir(dir);
    });

    if (process.platform == 'win32') {
        addressbar.on('select drive', function () {
            folder.selectDrive();
        });
    }

    openDir(defaultPath);
});