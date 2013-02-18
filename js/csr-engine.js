/*
*
* Client-Side Reliability Engine
* csr-engine.js
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

    this.styleSheetLocation = "http://www.steve-pappas.com/staticsmp/csr-engine/css/csr-engine.css";
    this.testCaseLocation = "http://www.steve-pappas.com/staticsmp/csr-engine/js/csr-test-cases.js";
    this.documents = [];
    this.testCases = [];
    this.htmlSource;
    this.tcDone = false;
    
    // Options
    this.consolePrint = false;
    this.filters = new Filters();
    this.runHtml = true;
    this.runCss = true;
    this.runJavascript = true;

}

CSREngine.prototype = {

    // Private functions

    getHtmlSource: function () { return this.htmlSource; },
    setHtmlSource: function (source) { this.htmlSource = source; },

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

    removeTestCase: function (nameSpace) {
    },

    // add minimize/maximize button
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

    // get all linked client-side documents and store them in array this.documents
    populateDocuments: function () {
        var engine = this;
        var filters = this.filters;

        engine.addDocument('HTML Source', 'html');

        // find all CSS documents
        $('link').each(function () {
            var source = $(this).prop('href');
            var type = $(this).prop('rel');

            // if document is not to be filtered out
            if (!filters.ignore(source) && type == "stylesheet") {
                engine.addDocument(source, 'css');
            }
        });

        // find all JavaScript documents
        $('script').each(function () {
            var source = $(this).prop('src');
            var type = $(this).prop('type');

            // if document is not to be filtered out
            if (!filters.ignore(source) && source != "") {
                engine.addDocument(source, 'js');
            }
        });
    },

    // get a list of current test cases and store them into array this.testCases
    populateTestCases: function () {
        csrTestCases.populateTestCases();
    },
    
    populateOptions: function () {
    	var engine = this;
    	
    	$('#csr-options-panel').append('<button id="csr-options-button" class="csr">&nbsp;APPLY&nbsp;</button>');
    	$('#csr-options-button').click(function () {
    		engine.applyOptions();
    	});
    	
    	$('#csr-options-panel').append('<h2>Options</h2>');
    	
    	// Test suite options
    	$('#csr-options-panel').append('<h3>Test Suites</h3>');
    	$('#csr-options-panel').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-test-suite" value="csr-html">HTML</input></div>');
    	$('#csr-options-panel').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-test-suite" value="csr-css">CSS</input></div>');
    	$('#csr-options-panel').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-test-suite" value="csr-javascript">JavaScript</input></div>');
    	if (this.runHtml) { $('.csr-options-checkbox[value="csr-html"]').prop('checked', true); }
    	if (this.runCss) { $('.csr-options-checkbox[value="csr-css"]').prop('checked', true); }
    	if (this.runJavascript) { $('.csr-options-checkbox[value="csr-javascript"]').prop('checked', true); }
    },

    // go through each document and run source code through appropriate test cases
    analyzeDocuments: function () {
    	var engine = this;
    	
        for (var i = 0; i < this.documents.length; i++) {
            var doc = this.documents[i];
            if (doc.getContent()) {
                var docAnalysis = new DocAnalysis(doc);
                docAnalysis.runAnalysis(engine.runHtml, engine.runCss, engine.runJavascript);
            }
        }
    },

    test: function () {
        /*** TEST AREA **/
    },
    
    applyOptions: function () {
    	var engine = this;
    	
    	while (engine.documents.length > 0)
    		engine.documents.pop();
    	while (engine.testCases.length > 0)
    		engine.testCases.pop();
    	
    	$('#csr-content').html('');
    	
    	engine.populateDocuments();
        engine.populateTestCases();
        engine.analyzeDocuments();
    },

    runNormal: function () {
        var engine = this;

        // Add CSR Engine stylesheet and create section before the body
        $('head').append('<link rel="stylesheet" href="' + engine.styleSheetLocation + '" type="text/css" />');
        $.getScript(engine.testCaseLocation, function () {
            $('body').before('<section id="csr-wrapper" class="csr"></section>');
            $('#csr-wrapper').append('<div id="csr-options-panel"></div>')

            engine.addToggleButtons();

            // Print introduction message
            $('#csr-wrapper').append('<h1>Client-Side Reliability Engine</h1>');
            $('#csr-wrapper').append('<div id="csr-content"></div>');

            // Populate array of linked client-side documents
            engine.populateDocuments();
            engine.populateTestCases();
            engine.populateOptions();
            engine.analyzeDocuments();

            engine.test();
        });
    },

    runConsole: function () {
        var engine = this;

        // Add CSR Engine stylesheet
        $('head').append('<link rel="stylesheet" href="' + engine.styleSheetLocation + '" type="text/css" />');
        $.getScript(engine.testCaseLocation, function () {
            // This option does not print much at the moment
            console.log('Client-Side Reliability Engine');
            console.log('   Enter the dragon.');

            // Populate array of linked client-side documents
            engine.populateDocuments();
            engine.populateTestCases();
            engine.analyzeDocuments();

            engine.test();
        });
    },

    // Public functions

    initialize: function (options) {

        // Parse user options
        if (options.consolePrint === true)
        	this.consolePrint = options.consolePrint;
        	
        this.htmlSource = $('html').html();
        
        if (options.filters) {
	        for (var i=0; i<options.filters.length; i++) {
	        	this.filters.addFilter(options.filters[i]);
	        }
	    }
	    
	    if (options.noFilters) {
	        for (var i=0; i<options.noFilters.length; i++) {
	        	this.filters.addNoFilter(options.noFilters[i]);
	        }
	    }
	    
	    if (options.html === false)
	    	this.runHtml = options.html;
	    if (options.css === false)
	    	this.runCss = options.css;
	    if (options.javascript === false)
	    	this.runJavascript = options.javascript;

        // User has chosen to print to JavaScript console instead of within the page
        if (this.consolePrint) {
            this.runConsole();
        }
        // By default, results will be displayed as part of the current page
        else {
            this.runNormal(options);
        }

    }

};

// DocAnalysis Class

function DocAnalysis(document) {

    this.document = document;

    this.initialize();

}

DocAnalysis.prototype = {

    runHtmlAnalysis: function () {
        for (var i = 0; i < window.CSREngine.testCases.length; i++) {
            var tc = window.CSREngine.testCases[i];

            // execute all test cases of type html
            if (tc.type == "html") {
                eval(tc.nameSpace + ".execute(this.document)");
            }
        }
    },

    runCssAnalysis: function () {
        for (var i = 0; i < window.CSREngine.testCases.length; i++) {
            var tc = window.CSREngine.testCases[i];

            // execute all test cases of type css
            if (tc.type == "css") {
                eval(tc.nameSpace + ".execute(this.document)");
            }
        }
    },

    runJsAnalysis: function () {
        for (var i = 0; i < window.CSREngine.testCases.length; i++) {
            var tc = window.CSREngine.testCases[i];

            // execute all test cases of type js
            if (tc.type == "js") {
                eval(tc.nameSpace + ".execute(this.document)");
            }
        }
    },

    runAnalysis: function (runHtml, runCss, runJavascript) {
        if (this.document.getType() === 'html' && runHtml) {
        	util.printString("Running analysis for " + this.document.getLocation() + " . . .", "csr-bold");
            this.runHtmlAnalysis();
	        if (!this.document.getErrorCount()) {
	            util.printString("No errors found in document");
	        }
        }
        else if (this.document.getType() === 'css' && runCss) {
        	util.printString("Running analysis for " + this.document.getLocation() + " . . .", "csr-bold");
            this.runCssAnalysis();
	        if (!this.document.getErrorCount()) {
	            util.printString("No errors found in document");
	        }
        }
        else if (this.document.getType() === 'js' && runJavascript) {
        	util.printString("Running analysis for " + this.document.getLocation() + " . . .", "csr-bold");
            this.runJsAnalysis();
	        if (!this.document.getErrorCount()) {
	            util.printString("No errors found in document");
	        }
        }
    },

    initialize: function () {
        //console.log(this.document.getType());
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
    this.errorCount;

    this.initialize();

}

Document.prototype = {

    getLocation: function () { return this.location; },
    setLocation: function (loc) { this.location = loc },

    getContent: function () { return this.content; },
    setContent: function (con) { this.content = con },

    getType: function () { return this.type; },
    setType: function (type) { this.type = type },

    getErrorCount: function () { return this.errorCount; },
    setErrorCount: function (type) { this.errorCount = type },
    addError: function () { ++this.errorCount; },

    printContent: function () {
        console.log(this.content);
    },

    // try to locate document and pull source code
    readContent: function () {
        var URL = this.getLocation();
        var ready = false;
        var doc = this;

        $.ajax({
            url: URL,
            success: function (data) {
                // document was found
                doc.content = data;
            },
            error: function () {
                // document was not found or contains compilation errors
                console.log(doc.location + " contains compilation errors or does not exist: Please fix and refresh");
                util.printString(doc.location + " contains compilation errors or does not exist: Please fix and refresh", "csr-bold csr-error");
                doc.content = null;
            },
            async: false
        });
    },

    // returns an array of lines of the document so that line by line traversal can be done
    getLines: function () {
        return this.getContent().split('\n');
    },

    initialize: function () {

        this.errorCount = 0;
        if (this.type == "html") {
            this.content = window.CSREngine.getHtmlSource();
        }
        else {
            this.readContent();
        }

    }

};

// Filters Class

function Filters() {

    this.filters = new Array();
    this.noFilters = new Array();

    this.initialize();

}

Filters.prototype = {

    getFilters: function () { return this.filters; },

    // determine if source file should be ignored by analysis
    ignore: function (source) {
        source = source.toLowerCase();
        for (var i = 0; i < this.noFilters.length; i++) {
            if (source.indexOf(this.noFilters[i].toLowerCase()) >= 0) {
                return false;
            }
        }
        for (var i = 0; i < this.filters.length; i++) {
            if (source.indexOf(this.filters[i].toLowerCase()) >= 0) {
                return true;
            }
        }

        return false;
    },
    
    addFilter: function (filter) {
    	this.filters.push(filter);
    },
	
	addNoFilter: function (filter) {
		this.noFilters.push(filter);
	},

    initialize: function () {

        // Add standard third party files to ignore - move this list to a separate file/database later
        this.addFilter("csr-engine");
        this.addFilter("csr-test-cases");
        this.addFilter("agility");
        this.addFilter("angular");
        this.addFilter("backbone");
        this.addFilter("batman");
        this.addFilter("coffee-script");
        this.addFilter("dojo");
        this.addFilter("ember");
        this.addFilter("jquery");
        this.addFilter("knockback");
        this.addFilter("knockout");
        this.addFilter("less");
        this.addFilter("mochikit");
        this.addFilter("midori");
        this.addFilter("mootools");
        this.addFilter("prototype");
        this.addFilter("qooxdoo");
        this.addFilter("scriptaculous");
        this.addFilter("spine");
        this.addFilter("underscore");
        this.addFilter("yui");
        this.addFilter("google");

    }

};

// CodeBlock Class

function CodeBlock(code, line) {

    this.code;

    this.initialize(code, line);

}

CodeBlock.prototype = {

    initialize: function (code, line) {
        if (code) {
            this.code = '<div class="csr-pre"><div class="csr-code"><span class="csr-code-inner"><span class="csr-code-line">' + line + this.setSpaces(line) + '</span>' + code + '</span>';
        }
        else {
            this.code = '<div class="csr-pre"><div class="csr-code">';
        }
    },

    add: function (code, line) {
        if (this.code == '<div class="csr-pre"><div class="csr-code">') {
            this.code = this.code + '<span class="csr-code-inner"><span class="csr-code-line">' + line + this.setSpaces(line) + '</span>' + code + '</span>';
        }
        else {
            this.code = this.code + '<br /><span class="csr-code-inner"><span class="csr-code-line">' + line + this.setSpaces(line) + '</span>' + code + '</span>';
        }

    },

    // clear the current code block
    clear: function () {
        this.code = '<div class="csr-pre"><div class="csr-code">';
    },

    // ensure that every line of code lines up no matter what line number
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

    // print the current code block
    print: function () {
        var code = this.code;
        $('#csr-content').append(code + '</div></div>');
    }

};

// Utility functions

var util = {

    printString: function (s, classes) {
        if (classes) {
            $('#csr-content').append('<p class="' + classes + '">' + s + '</p>');
        }
        else {
            $('#csr-content').append('<p>' + s + '</p>');
        }
    },

    printError: function (lineNum, e) {
        var s = "Error found at line " + lineNum + ": " + e;
        util.printString(s, "csr-error");
    },

    // used for displaying HTML source code
    escapeHTML: function (s) {
        return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

};
