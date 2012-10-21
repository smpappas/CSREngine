/*
*
* Client-Side Reliability Engine
* Steve Pappas
* Columbia University
*
*/

$(function () {

    window.CSREngine = new CSREngine();

});

/******************************/
/********** CLASSES ***********/
/******************************/

// CSREngine Class

function CSREngine() {

    this.consolePrint = false;
    this.documents = new Array();

}

CSREngine.prototype = {

    // Private functions

    addDocument: function (location) {
        var doc = new Document(location);
        this.documents.push(doc);
    },

    removeDocument: function (location) {
    },

    addToggleButtons: function () {
        $('#csr-wrapper').before('<button id="csr-button" class="csr csr-button">Minimize</button>');

        $('#csr-button').on('click', function () {
            if ($('#csr-wrapper').css('display') == "none") {
                $('#csr-wrapper').slideDown();
                $(this).html('Minimize');
            }
            else {
                $('#csr-wrapper').slideUp();
                $(this).html('Maximize');
            }
        });
    },

    printCode: function (code) {
        $('#csr-wrapper').append('<pre><code>' + code + '</code></pre>');
    },

    test: function () {
        /*** TEST AREA **/

        /*$('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');*/

        var s = 'console.log("trial code");';
        this.printCode(s);

        this.addDocument("/Content/site.css");
        this.addDocument("/Scripts/modernizr-2.5.3.js");
        for (var i = 0; i < this.documents.length; i++) {
            console.log(this.documents[i].getLocation());
            this.documents[i].printContent();
        }
    },

    // Public functions

    initialize: function (consolePrint) {

        this.consolePrint = consolePrint;

        // User has chosen to print to JavaScript console instead of within the page
        if (this.consolePrint) {
            console.log('Client-Side Reliability Engine');
            console.log('   Enter the dragon.');
        }
        // By default, results will be displayed as part of the current page
        else {
            // Add CSR Engine stylesheet and create section before the body
            $('head').append('<link rel="stylesheet" href="http://localhost:4231/Scripts/csr-engine.css" type="text/css" />');
            $('body').before('<section id="csr-wrapper" class="csr"></section>');

            this.addToggleButtons();

            // Print introduction message
            $('#csr-wrapper').append('<h1>Client-Side Reliability Engine</h1>');
            $('#csr-wrapper').append('<div>Enter the dragon.</div>');

            this.test();
        }

    }

};

// Document Class

function Document(location) {

    this.location = location;
    this.content;

    this.initialize();

}

Document.prototype = {

    getLocation: function () { return this.location; },
    setLocation: function (loc) { this.location = loc },

    printContent: function () {
        console.log(this.content);
    },

    readContent: function () {
        var URL = this.getLocation();
        var ready = false;
        var doc = this;

        $.ajax({
            url: URL,
            success: function (data) {
                doc.content = data;
            },
            error: function () {
                alert("File does not exist");
            },
            async: false
        });
    },

    initialize: function () {

        this.readContent();

    }

};