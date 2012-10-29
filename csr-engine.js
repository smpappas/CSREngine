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
    this.filters = new Filters();
    this.htmlSource;

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

    populateDocuments: function () {
        var engine = this;
        var filters = this.filters;

        // Find all CSS documents
        $('link').each(function () {
            var source = $(this).prop('href');
            var type = $(this).prop('rel');
            if (!filters.ignore(source) && type == "stylesheet") {
                engine.addDocument(source);
            }
        });

        // Find all JavaScript documents
        $('script').each(function () {
            var source = $(this).prop('src');
            var type = $(this).prop('type');
            if (!filters.ignore(source) && source != "") {
                engine.addDocument(source);
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

        for (var i = 0; i < this.documents.length; i++) {
            console.log(this.documents[i].getLocation());
            //this.documents[i].printContent();
            //this.printCode(this.documents[i].getContent());
        }

        //console.log(this.htmlSource);

        /*var lines = this.htmlSource.split("\n");
        $.each(lines, function (n, line) {
            console.log(line);
        });*/
    },

    // Public functions

    initialize: function (consolePrint) {

        this.consolePrint = consolePrint;
        this.htmlSource = $('html').html();

        // User has chosen to print to JavaScript console instead of within the page
        if (this.consolePrint) {
            console.log('Client-Side Reliability Engine');
            console.log('   Enter the dragon.');
        }
        // By default, results will be displayed as part of the current page
        else {
            // Add CSR Engine stylesheet and create section before the body
            // HARD CODE
            $('head').append('<link rel="stylesheet" href="http://localhost:4231/Scripts/csr-engine.css" type="text/css" />');
            $('body').before('<section id="csr-wrapper" class="csr"></section>');

            this.addToggleButtons();

            // Print introduction message
            $('#csr-wrapper').append('<h1>Client-Side Reliability Engine</h1>');
            $('#csr-wrapper').append('<div>Enter the dragon.</div>');

            // Populate array of linked client-side documents
            this.populateDocuments();

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

    getContent: function () { return this.content; },
    setContent: function (con) { this.content = con },

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

// Filters Class

function Filters() {

    this.filters = new Array();

    this.initialize();

}

Filters.prototype = {

    getFilters: function () { return this.filters; },

    ignore: function (source) {
        source = source.toLowerCase();
        for (var i = 0; i < this.filters.length; i++) {
            if (source.indexOf(this.filters[i].toLowerCase()) >= 0) {
                return true;
            }
        }

        return false;
    },

    initialize: function () {

        // Add standard third party files to ignore - move this list to a separate file/database later
        this.filters.push("csr-engine");
        this.filters.push("agility");
        this.filters.push("angular");
        this.filters.push("backbone");
        this.filters.push("batman");
        this.filters.push("coffee-script");
        this.filters.push("dojo");
        this.filters.push("ember");
        this.filters.push("jquery");
        this.filters.push("knockback");
        this.filters.push("knockout");
        this.filters.push("less");
        this.filters.push("mochikit");
        this.filters.push("midori");
        this.filters.push("mootools");
        this.filters.push("prototype");
        this.filters.push("qooxdoo");
        this.filters.push("scriptaculous");
        this.filters.push("spine");
        this.filters.push("underscore");
        this.filters.push("yui");

    }

};
