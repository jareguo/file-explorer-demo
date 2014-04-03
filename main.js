
var defaultPath = process.cwd();

// golbal varialbes

global.$ = $;

// import

var events = require('events');
var path = require('path');
var shell = require('nw.gui').Shell;

if (process.platform == 'win32') {
    var win32 = require("win32");
}

var AddressBar = require('address_bar').AddressBar;
var Folder = require('folder_view').Folder;
var Tree = require('tree_view').Tree;

// main

$(document).ready(function () {

    // init

    var folder = new Folder($('#files'));
    var addressbar = new AddressBar($('#addressbar'));
    var tree = new Tree($('#tree'));

    function openDir(dir) {
        if (dir && dir.slice(-1) != path.sep) {
            dir += path.sep;    // 如果不以/结尾，D:会被path.normalize转成D:.
        }
        // TODO: extract them into an abstract base interface
        addressbar.set(dir);
        folder.open(dir);
        tree.navigate(dir);
    }

    function selectDrive() {
        folder.selectDrive();
        tree.selectDrive();
        addressbar.selectDrive();
    }

    openDir(defaultPath);

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

    tree.on('navigate', function (dir) {
        openDir(dir);
    });

    if (process.platform == 'win32') {
        addressbar.on('select drive', function () {
            selectDrive();
        });
        tree.on('select drive', function () {
            selectDrive();
        });
    }
});

global.getPathData = function(dirPath) {
    console.assert(!dirPath || dirPath.slice(-1) == path.sep, "如果不以/结尾，'D:'会被path.normalize转成'D:.' ");

    var dirPath = path.normalize(dirPath);

    var result = [];
    if (process.platform == 'win32') {
        // add my computer for windows
        result.push({
            name: win32.MY_COMPUTER_NAME,
            path: win32.MY_COMPUTER_PATH,
        });
    }
    
    // Split path into separate elements
    var sequence = dirPath.split(path.sep);
    for (var i = 0; i < sequence.length; ++i) {
        if (sequence[i]) {
            result.push({
                name: sequence[i],
                path: sequence.slice(0, 1 + i).join(path.sep),
            });
        }
    }

    if (process.platform != 'win32') {
        if (sequence[0] == '') {
            // Add root for *nix
            result[0] = {
                name: 'root',
                path: '/',
            };
        }
    }
    else {
        if (result) {
            // convert drive name to upper case for windows
            result[1].name = result[1].name.toUpperCase();
        }
    }

    return result;
}