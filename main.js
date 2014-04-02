
var defaultPath = process.cwd();

// golbal varialbes

global.$ = $;

// import

var events = require('events');
var path = require('path');
var shell = require('nw.gui').Shell;

var AddressBar = require('address_bar').AddressBar;
var Folder = require('folder_view').Folder;
var Tree = require('tree_view').Tree;

// main

$(document).ready(function () {

    // init

    var folder = new Folder($('#files'));
    var addressbar = new AddressBar($('#addressbar'));
    var tree = new Tree($('#jstree_demo_div'));

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

