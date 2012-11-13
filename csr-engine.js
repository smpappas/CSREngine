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
    this.testCases = new Array();
    this.filters = new Filters();
    this.htmlSource;

}

CSREngine.prototype = {

    // Private functions

    addDocument: function (location, type) {
        var doc = new Document(location, type);
        this.documents.push(doc);
    },

    removeDocument: function (location) {
    },

    addTestCase: function (nameSpace, location, type) {
        var tc = new TestCase(nameSpace, location, type);
        this.testCases.push(tc);
    },

    removeTestCase: function (nameSPace) {
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
                engine.addDocument(source, 'css');
            }
        });

        // Find all JavaScript documents
        $('script').each(function () {
            var source = $(this).prop('src');
            var type = $(this).prop('type');
            if (!filters.ignore(source) && source != "") {
                engine.addDocument(source, 'js');
            }
        });
    },

    populateTestCases: function () {
        csrTestCases.populateTestCases();
        /*for (var i = 0; i < this.testCases.length; i++) {
            var tc = this.testCases[i];
            console.log(tc.nameSpace);
        }*/

        // for each test case, add a link to the js file
        for (var i = 0; i< this.testCases.length;  i++) {
            var tc = this.testCases[i];
            console.log('<script src="' + tc.location + '" type="text/javascript" />');
            $('head').append('<script src="' + tc.location + '" type="text/javascript" />');
        }
    },

    analyzeDocuments: function () {
        for (var i = 0; i < this.documents.length; i++) {
            var doc = this.documents[i];
            var docAnalysis = new DocAnalysis(doc);
            docAnalysis.runAnalysis();
        }
    },

    test: function () {
        /*** TEST AREA **/

        util.printString("Error found at line 9 of document.js:");
        var s = 'console.log("trial code");';
        var codeBlock = new CodeBlock(s, 9);
        codeBlock.add(s, 10);
        codeBlock.add('     ' + s, 11);
        codeBlock.add(s, 12);
        codeBlock.print();

        util.printString("Error found at line 123 of document.js:");
        s = 'x = parseInt(s);';
        var codeBlock = new CodeBlock(s, 123);
        codeBlock.print();

        for (var i = 0; i < this.documents.length; i++) {
            console.log(this.documents[i].getLocation());
            console.log(this.documents[i].getType());
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
            $('head').append('<script src="http://localhost:4231/Scripts/csr-test-cases.js" type="text/javascript" />');
            $('body').before('<section id="csr-wrapper" class="csr"></section>');

            this.addToggleButtons();

            // Print introduction message
            $('#csr-wrapper').append('<h1>Client-Side Reliability Engine</h1>');
            //$('#csr-wrapper').append('<div>Enter the dragon.</div>');

            // Populate array of linked client-side documents
            this.populateDocuments();
            this.populateTestCases();
            this.analyzeDocuments();

            this.test();
        }

    }

};

// DocAnalysis Class

function DocAnalysis(document) {

    this.document = document;

    this.initialize();

}

DocAnalysis.prototype = {

    runCssAnalysis: function () {
        for (var i = 0; i < window.CSREngine.testCases.length; i++) {
            var tc = window.CSREngine.testCases[i];
            if (tc.type == "css") {
                eval(tc.nameSpace + ".execute(this.document)");
            }
        }
    },

    runJsAnalysis: function () {
        for (var i = 0; i < window.CSREngine.testCases.length; i++) {
            var tc = window.CSREngine.testCases[i];
            if (tc.type == "js") {
                eval(tc.nameSpace + ".execute(this.document)");
            }
        }
    },

    runAnalysis: function () {
        util.printString("Running analysis for " + this.document.getLocation() + " . . .", "csr-italic");

        if (this.document.getType() === 'css') {
            this.runCssAnalysis();
        }
        else if (this.document.getType() === 'js') {
            this.runJsAnalysis();
        }
    },

    initialize: function () {
        console.log(this.document.getType());
    }
};

// TestCase Class

function TestCase(nameSpace, location, type) {

    this.nameSpace = nameSpace;
    this.location = location;
    this.type = type;

}

TestCase.prototype = {

};

// Document Class

function Document(location, type) {

    this.location = location;
    this.content;
    this.type = type;

    this.initialize();

}

Document.prototype = {

    getLocation: function () { return this.location; },
    setLocation: function (loc) { this.location = loc },

    getContent: function () { return this.content; },
    setContent: function (con) { this.content = con },

    getType: function () { return this.type; },
    setType: function (type) { this.type = type },

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

// CodeBlock Class

function CodeBlock(code, line) {

    this.code;

    this.initialize(code, line);

}

CodeBlock.prototype = {

    initialize: function (code, line) {
        this.code = '<pre><div class="code"><code><span class="code-line">' + line + this.setSpaces(line) + '</span>' + code + '</code>';
    },

    add: function (code, line) {
        this.code = this.code + '<br /><code><span class="code-line">' + line + this.setSpaces(line) + '</span>' + code + '</code>';
    },

    setSpaces: function (line) {
        var spaces;
        if (line < 10)
            spaces = "&nbsp;&nbsp;&nbsp;&nbsp;";
        else if (line < 100)
            spaces = "&nbsp;&nbsp;&nbsp;";
        else if (line < 1000)
            spaces = "&nbsp;&nbsp;";
        else
            spaces = "&nbsp;";
        return spaces;
    },

    print: function () {
        var code = this.code;
        $('#csr-wrapper').append(code + '</div></pre>');
    }

};

// Utility functions

var util = {

    printString: function (s, classes) {
        if (classes) {
            $('#csr-wrapper').append('<p class="' + classes + '">' + s + '</p>');
        }
        else {
            $('#csr-wrapper').append('<p>' + s + '</p>');
        }
    }

};
