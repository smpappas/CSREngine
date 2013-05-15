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

    this.locPrefix = "http://www.steve-pappas.com/staticsmp/csr-engine/";
    this.styleSheetLocation = this.locPrefix + "css/csr-engine.css";
    this.testCaseLocation = this.locPrefix + "js/csr-test-cases.js";
    this.jqueryUILocation = this.locPrefix + "js/jquery-ui.min.js";
    this.beautifyLocation = this.locPrefix + "js/beautify/beautify.js";
    this.jslintLocation = this.locPrefix + "js/jslint/jslint.js";
    this.allDocuments = [];
    this.documents = [];
    this.testCases = [];
    this.htmlSource;
    this.tcDone = false;
    
    // Code display
    this.docNum = 0;
    
    // Options
    this.consolePrint = false;
    this.filters = new Filters();
    this.runHtml = true;
    this.runCss = true;
    this.runJavascript = true;
    this.lintPredef;
    this.runLint = true;

}

CSREngine.prototype = {

    // Private functions

    getHtmlSource: function () { return this.htmlSource; },
    setHtmlSource: function (source) { this.htmlSource = source; },

    addDocument: function (location, type, internal, content) {
        var doc = new Document(location, type, internal, content);
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
        $('#csr-resizable').before('<button id="csr-button" class="csr csr-button">Minimize</button>');

        $('#csr-button').on('click', function () {
            if ($('#csr-resizable').css('display') == "none") {
                $('#csr-resizable').slideDown();
                $(this).html('Minimize');
            }
            else {
                $('#csr-resizable').slideUp();
                $(this).html('Maximize');
            }
        });
    },

    // get all linked client-side documents and store them in array this.documents
    populateDocuments: function () {
        var engine = this;
        var filters = this.filters;

        engine.addDocument('HTML Source', 'html');
        
        // find all internal styles
        var styleCount = 1;
        $('style').each(function() {
        	var source = "Internal Style " + styleCount;
        	var text = $(this).html();
        	if (text[0] === '\n')
        		engine.addDocument(source, 'css', true, text.substr(1, text.length));
        	else
        		engine.addDocument(source, 'css', true, text);
            $(this).data('csr', 'Internal Style ' + styleCount);
        	
        	styleCount++;
        });

        // find all CSS documents
        $('link').each(function () {
            var source = $(this).prop('href');
            var type = $(this).prop('rel');
            
            if (source.indexOf("csr-") >= 0)
            	return true;

            if (source != "" && type == "stylesheet") {
                engine.addDocument(source, 'css');
            }
        });
        
        // find all JavaScript documents
        var scriptCount = 1;
        $('script').each(function () {
            var source = $(this).prop('src');
            var type = $(this).prop('type');
            
            if (source.indexOf("csr-") >= 0)
            	return true;

            if (source != "") {
                engine.addDocument(source, 'js');
            }
            // if script is internal
            else if ($(this).data('csr') != "csr") {
            	source = "Internal Script " + scriptCount;
            	var text = $(this).html();
	        	if (text[0] === '\n')
	        		engine.addDocument(source, 'js', true, text.substr(1, text.length));
	        	else
        			engine.addDocument(source, 'js', true, text);
            	$(this).data('csr', 'Internal Script ' + scriptCount);
        	
        		scriptCount++;
            }
        });
    },

    // get a list of current test cases and store them into array this.testCases
    populateTestCases: function () {
        csrTestCases.populateTestCases();
    },
    
    defineOptionEvents: function () {
    	$('#csr-test-title').addClass('csr-selected');
    	
    	// Implement tab functionality
    	$('#csr-test-title').click(function () {
    		$('#csr-doc-tab').hide();
    		$('#csr-jslint-tab').hide();
    		$('#csr-test-tab').show();
    		$('#csr-doc-title').removeClass('csr-selected');
    		$('#csr-jslint-title').removeClass('csr-selected');
    		$('#csr-test-title').addClass('csr-selected');
    	});
    	
    	$('#csr-doc-title').click(function () {
    		$('#csr-test-tab').hide();
    		$('#csr-jslint-tab').hide();
    		$('#csr-doc-tab').show();
    		$('#csr-test-title').removeClass('csr-selected');
    		$('#csr-jslint-title').removeClass('csr-selected');
    		$('#csr-doc-title').addClass('csr-selected');
    	});
    	
    	$('#csr-jslint-title').click(function () {
    		$('#csr-test-tab').hide();
    		$('#csr-doc-tab').hide();
    		$('#csr-jslint-tab').show();
    		$('#csr-test-title').removeClass('csr-selected');
    		$('#csr-doc-title').removeClass('csr-selected');
    		$('#csr-jslint-title').addClass('csr-selected');
    	});
    	
    	// Implement select all checkboxes
    	$('.csr-options-checkbox[name="csr-test-suite-all"]').click(function () {
    		if ($(this).prop('checked') == true)
    			$('.csr-options-checkbox[name="csr-test-suite"]').prop('checked', true);
    		else
    			$('.csr-options-checkbox[name="csr-test-suite"]').prop('checked', false);
    	});
    	$('.csr-options-checkbox[name="csr-document-all"]').click(function () {
    		if ($(this).prop('checked') == true)
    			$('.csr-options-checkbox[name="csr-document"]').prop('checked', true);
    		else
    			$('.csr-options-checkbox[name="csr-document"]').prop('checked', false);
    	});
    	
    	$('.csr-options-checkbox[name="csr-test-suite"]').click(function () {
    		$('.csr-options-checkbox[name="csr-test-suite-all"]').prop('checked', true);
	    	$('.csr-options-checkbox[name="csr-test-suite"]').each(function () {
				if ($(this).prop('checked') == false)
					$('.csr-options-checkbox[name="csr-test-suite-all"]').prop('checked', false);
			});
    	});
    	$('.csr-options-checkbox[name="csr-document"]').click(function () {
    		$('.csr-options-checkbox[name="csr-document-all"]').prop('checked', true);
	    	$('.csr-options-checkbox[name="csr-document"]').each(function () {
				if ($(this).prop('checked') == false)
					$('.csr-options-checkbox[name="csr-document-all"]').prop('checked', false);
			});
    	});
    },
    
    // populate the options panel
    populateOptions: function (options) {
    	var engine = this;
    	
    	$('#csr-options-panel').append('<div class="csr-options-title"></div>');
    	$('#csr-options-panel').append('<div id="csr-options-content-wrapper"></div>');
    	$('#csr-options-content-wrapper').append('<div id="csr-test-title" class="csr-options-tab"><h3>Test Suites</h3></div>');
    	$('#csr-options-content-wrapper').append('<div id="csr-doc-title" class="csr-options-tab"><h3>Documents</h3></div>');
    	$('#csr-options-content-wrapper').append('<div id="csr-jslint-title" class="csr-options-tab"><h3>JSLint</h3></div>');
    	$('#csr-options-content-wrapper').append('<div style="clear: both;"></div>');
    	$('#csr-options-content-wrapper').append('<div id="csr-test-tab" class="csr-options-content"></div>');
    	$('#csr-options-content-wrapper').append('<div id="csr-doc-tab" class="csr-options-content"></div>');
    	$('#csr-options-content-wrapper').append('<div id="csr-jslint-tab" class="csr-options-content"></div>');
    	$('.csr-options-title').append('<button id="csr-options-toggle" class="csr">&#9660;</button>');
    	$('.csr-options-title').append('<button id="csr-options-button" class="csr">&nbsp;APPLY&nbsp;</button>');
    	$('#csr-options-button').click(function () {
    		engine.applyOptions();
    	});
    	$('#csr-options-toggle').toggle(function () {
    		$('#csr-options-content-wrapper').slideUp();
    		$(this).html('&#9650;');
    	}, function () {
    		$('#csr-options-content-wrapper').slideDown();
    		$(this).html('&#9660');
    	});
    	
    	$('.csr-options-title').append('<h2>Options</h2>');
    	
    	// Test suite options
    	$('#csr-test-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-test-suite-all">Select All</input></div>');
    	$('#csr-test-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-test-suite" value="csr-html">HTML</input></div>');
    	$('#csr-test-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-test-suite" value="csr-css">CSS</input></div>');
    	$('#csr-test-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-test-suite" value="csr-javascript">JavaScript</input></div>');
    	if (this.runHtml) { $('.csr-options-checkbox[value="csr-html"]').prop('checked', true); }
    	if (this.runCss) { $('.csr-options-checkbox[value="csr-css"]').prop('checked', true); }
    	if (this.runJavascript) { $('.csr-options-checkbox[value="csr-javascript"]').prop('checked', true); }
    	
    	// Document filters
    	$('#csr-doc-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-document-all">Select All</input></div>');
    	for (var i=0; i<engine.documents.length; i++) {
    		var doc = engine.documents[i];
    		$('#csr-doc-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-document" value="csr-' + doc.getShortName() + '">' + doc.getShortName() + '</input></div>');
    		if (!engine.filters.ignore(doc.getShortName()))
    			$('.csr-options-checkbox[value="csr-' + doc.getShortName() + '"]').prop('checked', true);
    	}
    	$('.csr-options-checkbox[name="csr-test-suite-all"]').prop('checked', true);
    	$('.csr-options-checkbox[name="csr-test-suite"]').each(function () {
			if ($(this).prop('checked') == false)
				$('.csr-options-checkbox[name="csr-test-suite-all"]').prop('checked', false);
		});
    	
    	$('.csr-options-checkbox[name="csr-document-all"]').prop('checked', true);
    	$('.csr-options-checkbox[name="csr-document"]').each(function () {
			if ($(this).prop('checked') == false)
				$('.csr-options-checkbox[name="csr-document-all"]').prop('checked', false);
		});
		
		// JSLint options
		engine.populateJSLintOptions(options);
    	
    	engine.defineOptionEvents();
    },

    // go through each document and run source code through appropriate test cases
    analyzeDocuments: function (lintOptions) {
    	var engine = this;
	    	
	    // JSLint options
	    if (!lintOptions) {
	    	lintOptions = {
	        	"browser": true,
	        	"devel": true,
	        	"predef": ["jQuery", "$"],
	        	"sloppy": true,
	        	"vars": true,
	        	"white": true
        	};
	    }
    	
        for (var i = 0; i < this.documents.length; i++) {
            var doc = this.documents[i];
            if (!engine.filters.ignore(doc.getShortName()) && doc.getContent()) {
                var docAnalysis = new DocAnalysis(doc, lintOptions);
                docAnalysis.runAnalysis(engine.runHtml, engine.runCss, engine.runJavascript);
            }
        }
    },

    test: function () {
		/*** TEST AREA ***/
		var engine = this;
		
		// Test Regex()
		/*var pattern = "^\\$\\(function\\(\\)\\s*\\{" + util.anything() + "\\}\\);$";
		var matches = engine.documents[6].regex(pattern);
		   
		for (var i=0; i<matches.length; i++) {
			matches[i].printLines("Example multiline code block");
		}*/
		
		// Test findTag()
		/*matches = engine.documents[0].findTag("img");
		for (var j=0; j<matches.length; j++) {
			console.log(matches[j]);
		}*/
		
		// Test findSelector()
		/*matches = engine.documents[3].findSelector("#login");
		for (var j=0; j<matches.length; j++) {
			console.log(matches[j]);
		}*/
		
		// Test findProperty()
		/*matches = engine.documents[3].findProperty("font-family");
		for (var j=0; j<matches.length; j++) {
			console.log(matches[j]);
		}*/
		
		/*JSLINT(engine.documents[6].getContent());
		var data = JSLINT.data();
		console.log(data);*/
    },
    
    applyOptions: function () {
    	var engine = this;
    	
    	$('#csr-content').html('');
    	
    	engine.docNum = 0;
    	
    	// Check test suite options
    	$('.csr-options-checkbox[value="csr-html"]').prop('checked') == true ? engine.runHtml = true : engine.runHtml = false;
    	$('.csr-options-checkbox[value="csr-css"]').prop('checked') == true ? engine.runCss = true : engine.runCss = false;
    	$('.csr-options-checkbox[value="csr-javascript"]').prop('checked') == true ? engine.runJavascript = true : engine.runJavascript = false;
    	$('.csr-options-checkbox[name="csr-jslint-options-toggle"]').prop('checked') == true ? engine.runLint = true : engine.runLint = false;
    	
    	// Adjust filters for selected documents
    	for (var i=0; i<engine.documents.length; i++) {
    		var doc = engine.documents[i];
    		var name = doc.getShortName();
    		var checked = $('.csr-options-checkbox[value="csr-' + doc.getShortName() + '"]').prop('checked');
    		
    		// This document should be analyzed
    		if (checked) {
    			if (engine.filters.ignore(name)) {
    				if (engine.filters.removeFilter(name)) {
	    				if (engine.filters.ignore(name))
	    					engine.filters.addNoFilter(name);
    				}
	    			else
	    				engine.filters.addNoFilter(name);
    			}
    		}
    		
    		// This document should not be analyzed
    		else {
    			if (!engine.filters.ignore(name)) {
    				if (engine.filters.removeNoFilter(name)) {
	    				if (!engine.filters.ignore(name))
	    					engine.filters.addFilter(name);
    				}
	    			else
	    				engine.filters.addFilter(name);
    			}
    		}
    	}
    	
    	while (engine.documents.length > 0)
    		engine.documents.pop();
    	while (engine.testCases.length > 0)
    		engine.testCases.pop();
    	
    	engine.populateDocuments();
        engine.populateTestCases();
        
        var lintOptions = engine.applyJSLintOptions();
        engine.analyzeDocuments(lintOptions);
        
        SyntaxHighlighter.highlight();
    },
    
    addSyntaxHighlighting: function () {
    	var engine = this;
        $('head').append('<link rel="stylesheet" href="' + engine.locPrefix + 'css/syntax/shCore.css" type="text/css" />');
        $('head').append('<link rel="stylesheet" href="' + engine.locPrefix + 'css/syntax/shThemeDefault.css" type="text/css" />');
        
        $.getScript(engine.locPrefix + 'js/syntax/shCore.js', function() {
        	$.getScript(engine.locPrefix + 'js/syntax/shBrushJScript.js', function () {
        		$.getScript(engine.locPrefix + 'js/syntax/shBrushCss.js', function() {
        			$.getScript(engine.locPrefix + 'js/syntax/shBrushXml.js', function () {
        				SyntaxHighlighter.all();
        			});
        		});
        	});
        });
    },

    runNormal: function (options) {
        var engine = this;

        // Add CSR Engine stylesheet and create section before the body
        $('head').append('<link rel="stylesheet" href="' + engine.styleSheetLocation + '" type="text/css" />');
        $('head').append('<script src="' + engine.beautifyLocation + '" type="text/javascript"></script>');
        engine.addSyntaxHighlighting();
	    $('body').before('<section id="csr-resizable" class="csr ui-widget-content ui-resizable"></section>');
	    $('#csr-resizable').append('<div id="csr-wrapper" class="csr"></div>');
    	$('#csr-resizable').css('height', $(window).height() / 2);
        $.getScript(engine.jqueryUILocation, function() {
        	$.getScript(engine.testCaseLocation, function () {
        		$.getScript(engine.jslintLocation, function () {
		            $('#csr-wrapper').append('<div id="csr-options-panel"></div>')
		            
	    			$('#csr-resizable').resizable({ handles: 'n, s' });
		
		            engine.addToggleButtons();
		
		            // Print introduction message
		            $('#csr-wrapper').append('<h1>Client-Side Reliability Engine</h1>');
		            $('#csr-wrapper').append('<div id="csr-content"></div>');
		
		            // Populate array of linked client-side documents
		            engine.populateDocuments();
		            engine.populateTestCases();
		            engine.populateOptions(options);
		            var lintOptions = options.lintOptions[0];
		            if (lintOptions["predef"])
		            	engine.lintPredef = lintOptions["predef"];
		            engine.analyzeDocuments(lintOptions);
		
		            engine.test();
		         });
	        });
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
            var lintOptions = options.lintOptions[0];
            if (lintOptions["predef"])
            	engine.lintPredef = lintOptions["predef"];
            engine.analyzeDocuments(lintOptions);

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
	    if (options.lint === false)
	    	this.runLint = options.lint;

        // User has chosen to print to JavaScript console instead of within the page
        if (this.consolePrint) {
            this.runConsole();
        }
        // By default, results will be displayed as part of the current page
        else {
            this.runNormal(options);
        }

    },
    
    // JSLint related
    
    populateJSLintOptions: function (options) {
    	var engine = this;
    	
    	var lintOptions = options.lintOptions[0];
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options-toggle">Include JSLint Tests</input></div>');
    	$('#csr-jslint-tab').append('<div style="background-color: #A8AAAC; height: 1px; margin-top: 4px;">&nbsp</div>');
    	$('#csr-jslint-tab').append('<div style="background-color: #C8CACC; height: 1px; margin-bottom: 4px;">&nbsp</div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-passfail">Stop on First Error</input></div>');
    	$('#csr-jslint-tab').append('<div style="background-color: #A8AAAC; height: 1px; margin-top: 4px;">&nbsp</div>');
    	$('#csr-jslint-tab').append('<div style="background-color: #C8CACC; height: 1px; margin-bottom: 4px;">&nbsp</div>');
    	$('#csr-jslint-tab').append('<h3 style="font-style: italic; margin-bottom: 2px;">Assume</h3>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-browser">Browser</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-couch">CouchDB</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-devel">Developer</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-node">Node.js</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-rhino">Rhine</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-windows">Windows</input></div>');
    	$('#csr-jslint-tab').append('<div style="background-color: #A8AAAC; height: 1px; margin-top: 4px;">&nbsp</div>');
    	$('#csr-jslint-tab').append('<div style="background-color: #C8CACC; height: 1px; margin-bottom: 4px;">&nbsp</div>');
    	$('#csr-jslint-tab').append('<h3 style="font-style: italic; margin-bottom: 2px;">Tolerate</h3>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-ass">Assignment Expressions</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-bitwise">Bitwise Operators</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-closure">Google Closure</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-continue">Continue</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-debug">Debugger Statements</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-eqeq">== and !=</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-es5">ES5 Syntax</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-evil">Eval</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-forin">Unfiltered for in</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-newcap">Uncapitalized Constructors</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-nomen">Dangling _ in Identifiers</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-plusplus">++ and --</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-regexp">. and [^...] in /RegExp/</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-unparam">Unused Parameters</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-sloppy">Missing \'use strict\' Pragma</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-stupid">Stupidity</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-sub">Inefficient Subscripting</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-todo">TODO Comments</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-vars">Many var Statements / Function</input></div>');
    	$('#csr-jslint-tab').append('<div class="csr-options-element"><input class="csr-options-checkbox" type="checkbox" name="csr-jslint-options" value="csr-jslint-white">Messy Whitespace</input></div>');
    	
    	// Check the appropriate default options
    	if (engine.runLint)
    		$('.csr-options-checkbox[name="csr-jslint-options-toggle"]').prop('checked', true);
    	if (lintOptions) {
    		for (var key in lintOptions) {
				if (lintOptions[key])
					$('.csr-options-checkbox[value="csr-jslint-' + key + '"]').prop('checked', true);
    		}
    	}
    },
    
    applyJSLintOptions: function () {
    	var engine = this;
    	var lintOptions = { };
    	
    	// Populate JSLint options according to checked options
    	$('.csr-options-checkbox[name="csr-jslint-options"]').each(function () {
    		if ($(this).prop("checked")) {
	    		var valPieces = $(this).prop("value").split('-');
	        	var value = valPieces[valPieces.length-1];
	        	lintOptions[value] = true;
	        }
    	});
    	
    	if (engine.lintPredef)
    		lintOptions["predef"] = engine.lintPredef;
    	return lintOptions;
    }

};

// DocAnalysis Class

function DocAnalysis(document, lintOptions) {

    this.document = document;
    this.lintOptions = lintOptions;

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
        
        if (window.CSREngine.runLint)
        	this.runJSLint();
    },
    
    runJSLint: function () {
        
        // run jslint function ondocument content
        JSLINT(this.document.getContent(), this.lintOptions);
		var data = JSLINT.data();
		//console.log(data);
		
		for (var i=0; i<data.errors.length; i++) {
			var error = data.errors[i];

			// Figure out how to deal with multiline errors
			this.document.addError();
            util.printError(error.line, error.reason);
            new CodeBlock(error.evidence.trim(), error.line).print();
		}
    },
    
    displaySource: function (type) {
    	var btnid = "csr-displayCode" + window.CSREngine.docNum + "-view";
    	var codeid = "csr-displayCode" + window.CSREngine.docNum;
    	$('#csr-content').append('<span id="' + btnid + '" class="csr-view-source">View Source</span>');
    	$('#' + btnid).toggle(function () {
    		$('#' + codeid).slideDown();
    		$(this).html('Hide Source');
    	}, function () {
    		$('#' + codeid).slideUp();
    		$(this).html('View Source');
    	});
    	
    	var brush;
    	if (type === 'html')
    		brush = 'xml';
    	else if (type === 'css')
    		brush = 'css';
    	else
    		brush = 'js';
    		
    	var code = '<div id="' + codeid + '" style="display: none;"><script type="syntaxhighlighter" class="brush: ' + brush + '"><![CDATA[';
    	if (type === 'html')
    		code += util.escapeHTML(this.document.content);
    	else
    		code += this.document.content;
    	code += ']]></script></div>';
    	$('#csr-content').append(code);
    	window.CSREngine.docNum++;
    },

    runAnalysis: function (runHtml, runCss, runJavascript) {
        if (this.document.getType() === 'html' && runHtml) {
        	util.printString("Running analysis for " + this.document.getLocation() + " . . .", "csr-bold csr-title csr-small-bottom");
        	this.displaySource(this.document.getType());
            this.runHtmlAnalysis();
	        if (!this.document.getErrorCount()) {
	            util.printString("No errors found in document");
	        }
        }
        else if (this.document.getType() === 'css' && runCss) {
        	util.printString("Running analysis for " + this.document.getLocation() + " . . .", "csr-bold csr-title csr-small-bottom");
        	this.displaySource(this.document.getType());
            this.runCssAnalysis();
	        if (!this.document.getErrorCount()) {
	            util.printString("No errors found in document");
	        }
        }
        else if (this.document.getType() === 'js' && runJavascript) {
        	util.printString("Running analysis for " + this.document.getLocation() + " . . .", "csr-bold csr-title csr-small-bottom");
        	this.displaySource(this.document.getType());
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

function Document(location, type, internal, content) {

    this.location = location;
    this.shortName;
    this.content = content; // stores source code as a string
    this.type = type;
    this.errorCount;
    this.internal = internal;

    this.initialize();

}

Document.prototype = {

    getLocation: function () { return this.location; },
    setLocation: function (loc) { this.location = loc },
    
    getShortName: function () { return this.shortName; },

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
        var docType = this.type;
        var ready = false;
        var doc = this;

        $.ajax({
            url: URL,
            success: function (data) {
                // document was found
                if (docType == "js")
                	doc.content = js_beautify(data, null);
                else
                	doc.content = data;
                //console.log(doc.content);
            },
            error: function () {
                // document was not found or contains compilation errors
                if (!window.CSREngine.filters.ignore(URL)) {
	                console.log(doc.location + " contains compilation errors or does not exist: Please fix and refresh");
	                util.printString(doc.location + " contains compilation errors or does not exist: Please fix and refresh", "csr-bold csr-error");
                }
                doc.content = null;
            },
            async: false
        });
    },

    initialize: function () {

		this.errorCount = 0;
        
        var locPieces = this.location.split('\/');
        this.shortName = locPieces[locPieces.length-1];
        
        if (this.type == "html") {
            this.content = window.CSREngine.getHtmlSource();
        }
        else if (!this.internal) {
            this.readContent();
        }

    },
    
    /* 
     * API For Static Code Analysis
     * These functions are intended to aid in string analysis for the purpose
     * of writing test cases. This should simplify the code needed to write
     * test cases, however a complete parser for each language may allow for
     * more thorough tests. Future expansion using parsers similar to those
     * found in JSLint to generate logical representations of the code is possible.
     */

    /*
     * Applies to: HTML, CSS, JS
     * Description: Returns an array of lines of the document so that line by line traversal can be done
     * Returns: array
     */
    getLines: function () {
        return this.getContent().split("\n");
    },
    
    /*
     * HTML, CSS, JS
     * Description: Runs a regular expression against source code and returns all 
     * 	matching locations and lines.
     * Returns: array of Match objects
     */
    regex: function (r, options) {
    	var doc = this;
    	//var pattern = /^\$\(function\(\)\s*\{(.|[\r\n])*\}\);$/gm;
    	if (options)
    		var pattern = new RegExp(r, options);
    	else
    		var pattern = new RegExp(r, "gm");
        var text = this.getContent();
        var matches = [];
        
        /*
         * Results get returned as an array of Match object,
         * which contains the matching code, line code,
         * start and end lines for the matching code, and
         * utility functions to act on the Match objects
         */
        var result;
        while ( ( result = pattern.exec(text) ) != null ) {
        	matches.push(new Match(doc, result[0], doc.indexToLine(result["index"]), result["index"]));
        }
        
        return matches;
    },
    
    /*
     * HTML, CSS, JS
     * Description: Takes an index number and converts it to a line number in source code
     * Returns: integer
     */
    indexToLine: function (index) {
    	var text = this.getContent().substr(0, index);
    	
    	return text.split("\n").length;
    },
    
    /*
     * HTML, CSS, JS
     * Description: Takes a line and returns the source code of the line
     * Returns: string
     */
    lineToCode: function (line) {
    	var content = this.getContent().split("\n");
    	
    	return content[line-1];
    },
    
    /*
     * JS
     * Description: Finds instances of a function and returns locations and arguments
     * Returns: array of Match objects
     */
    findFunction: function (f) {
    	var doc = this;
    	var content = doc.getContent();
    	
    	// find instances of function f
    	var pattern = f + "\\s*\\(";
    	var matches = doc.regex(pattern);
    	
    	// parse arguments of function
    	for (var i=0; i<matches.length; i++) {
    		var match = matches[i];
    		match.functionName = f;
    		
    		curArg = "";
    		var openParen = 1;
    		var openCurly = 0;
    		var openSquare = 0;
    		var start = content.indexOf("(", match.indexStart);
    		var j = start + 1;
    		while (openParen > 0) {
    			var c = content[j];
    			if (c == '(') {
    				openParen++;
    				curArg += c;
    			}
    			else if (c == ')') {
    				openParen--;
    				if (openParen != 0) {
    					curArg += c;
    				}
    			}
    			else if (c == '{') {
    				openCurly++;
    				curArg += c;
    			}
    			else if (c == '}') {
    				openCurly--;
    				curArg += c;
    			}
    			else if (c == '[') {
    				openSquare++;
    				curArg += c;
    			}
    			else if (c == ']') {
    				openSquare--;
    				curArg += c;
    			}
    			else if (c == ',' && openParen == 1 && openCurly == 0 && openSquare == 0) {
    				match.args.push(curArg);
    				curArg = "";
    			}
    			else if (c != '\n' && c != ' ') {
    				curArg += c;
    			}
    			else if (c == '\n') {
    				match.lineEnd++;
    			}
    			j++;
    		}
    		if (curArg != "") {
    			match.args.push(curArg);
    		}
    	}
    	
    	return matches;
    },
    
    // HTML: Helper to find instances of tags and return attribute values
    /*
     * HTML
     * Description: Finds instances of html tags and returns attribute values
     * Returns: array of Match objects
     */
    findTag: function (tag) {
    	var doc = this;
    	var content = doc.getContent();
    	
    	// find instances of function f
    	var pattern = "\\<\\s*" + tag;
    	var matches = doc.regex(pattern);
    	
    	// parse attributes of tag
    	for (var i=0; i<matches.length; i++) {
    		var match = matches[i];
    		match.tag = tag;
    		
    		var curAttr = "";
    		var curValue = "";
    		var onAttr = true;
    		var openAngle = 1;
    		var openDQ = 0;
    		var openSQ = 0;
    		
    		// find start index
    		var start = match.indexStart + 1;
    		var tag2 = content[start];
    		start++;
    		while (tag2 != tag) {
    			tag2 += content[start];
    			start++;
    		}
    		var j = start;
    		while (openAngle > 0) {
    			var c = content[j];
    			if (c == '<') {
    				openAngle++;
    				if (onAttr == true) {
    					curAttr += c;
    				} else {
    					curValue += c;
    				}
    			}
    			else if (c == '>') {
    				openAngle--;
    				if (openAngle != 0) {
    					if (onAttr == true) {
	    					curAttr += c;
	    				} else {
	    					curValue += c;
	    				}
    				}
    			}
    			else if (c == '=') {
    				onAttr = false;
    				match.attributes.push(curAttr);
    				curAttr = "";
    			}
    			else if (c == '\"') {
    				if (openDQ == 0) {
    					openDQ++;
    				} else {
    					openDQ--;
    				}
    				if (onAttr == false && openSQ == 1) {
    					curValue += c;
    				}
    				else if (openSQ == 0 && openDQ == 0) {
    					onAttr = true;
    					match.values.push(curValue);
    					curValue = "";
    				}
    			}
    			else if (c == '\'') {
    				if (openSQ == 0) {
    					openSQ++;
    				} else {
    					openSQ--;
    				}
    				if (onAttr == false && openDQ == 1) {
    					curValue += c;
    				}
    				else if (openSQ == 0 && openDQ == 0) {
    					onAttr = true;
    					match.values.push(curValue);
    					curValue = "";
    				}
    			}	
    			else if (c != '\n' && c != ' ') {
    				if (onAttr == true) {
    					curAttr += c;
    				} else {
    					curValue += c;
    				}
    			}
    			else if (c == '\n') {
    				match.lineEnd++;
    				if (onAttr == false && openDQ == 0 && openSQ == 0) {
    					onAttr = true;
    					match.values.push(curValue);
    					curValue = "";
    				}
    			}
    			else if (c == ' ') {
    				if (onAttr == false && openDQ == 0 && openSQ == 0) {
    					onAttr = true;
    					match.values.push(curValue);
    					curValue = "";
    				}
    				else if (onAttr == false && (openDQ > 0 || openSQ > 0)) {
    					curValue += c;
    				}
    			}
    			j++;
    		}
    		if (curAttr != "") {
    			match.attributes.push(curAttr);
    		}
    		if (curValue != "") {
    			match.values.push(curValue);
    		}
    	}
    	return matches;
    },
    
    // CSS: Helper to find instances of class/identifier and return properties and values
    findSelector: function (s) {
    	var doc = this;
    	var content = doc.getContent();
    	
    	// find instances of selector s
    	var pattern = s + "\\s*\\{";
    	var matches = doc.regex(pattern);
    	
    	for (var i=0; i<matches.length; i++) {
    		var match = matches[i];
    		match.selector = s;
    		
    		var openCurly = 1;
    		var curProp = "";
    		var curValue = "";
    		var onProp = true;
    		
    		var start = content.indexOf("{", match.indexStart);
    		var j = start + 1;
    		while (openCurly > 0) {
    			var c = content[j];
    			if (c == '{') {
    				openCurly++;
    				if (onProp == true) {
    					curProp += c;
    				} else {
    					curValue += c;
    				}
    			}
    			else if (c == '}') {
    				openCurly--;
    				if (openCurly != 0) {
    					if (onProp == true) {
	    					curProp += c;
	    				} else {
	    					curValue += c;
	    				}
    				}
    			}
    			else if (c == ':') {
    				onProp = false;
    				if (curProp.trim() != "")
    					match.properties.push(curProp.trim());
    				curProp = "";
    			}
    			else if (c == ';') {
    				onProp = true;
    				if (curValue.trim() != "")
    					match.values.push(curValue.trim());
    				curValue = "";
    			}
    			else if (c != '\n') {
    				if (onProp == true) {
    					curProp += c;
    				} else {
    					curValue += c;
    				}
    			}
    			else if (c == '\n') {
    				match.lineEnd++;
    			}
    			j++;
    		}
    		if (curProp != "") {
    			if (curProp.trim() != "")
    				match.properties.push(curProp.trim());
    		}
    		if (curValue != "") {
    			if (curValue.trim() != "")
    				match.values.push(curValue.trim());
    		}
    	}
    	return matches;
    },
    
    // CSS: Helper to find instances of property and return containing identifier and values
    findProperty: function (prop) {
    	var doc = this;
    	var content = doc.getContent();
    	
    	// find instances of selector s
    	var pattern = prop + "\\s*\\:";
    	var matches = doc.regex(pattern);
    	
    	for (var i=0; i<matches.length; i++) {
    		var match = matches[i];
    		match.property = prop;
    		
    		var semi = false;
    		var curValue = "";
    		
    		var start = content.indexOf("\:", match.indexStart);
    		var j = start + 1;
    		while (!semi) {
    			var c = content[j];
    			if (c == ';') {
    				if (curValue.trim() != "")
    					match.value = curValue.trim();
    				curValue = "";
    				semi = true;
    			}
    			else if (c != '\n') {
    				curValue += c;
    			}
    			else if (c == '\n') {
    				match.lineEnd++;
    			}
    			j++;
    		}
    		if (curValue != "") {
    			if (curValue.trim() != "")
    				match.value = curValue.trim();
    		}
    	}
    	return matches;
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
    
    removeFilter: function (filter) {
    	var success = false;
    	for (var i = 0; i < this.filters.length; i++) {
    		if (filter.toLowerCase() == this.filters[i].toLowerCase()) {
    			this.filters.splice(i, 1);
    			success = true;
    		}
    	}
    	
    	return success;
    },
	
	addNoFilter: function (filter) {
		this.noFilters.push(filter);
	},
	
	removeNoFilter: function (filter) {
		var success = false;
		for (var i = 0; i < this.noFilters.length; i++) {
    		if (filter.toLowerCase() == this.noFilters[i].toLowerCase()) {
    			this.noFilters.splice(i, 1);
    			success = true;
    		}
    	}
    	
    	return success;
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

// Match Class

function Match(doc, code, lineStart, indexStart) {
	
	this.doc = doc;
	this.code = code;
	this.lineStart = lineStart;
	this.indexStart = indexStart;
	this.lineEnd;
	this.lineCode = "";
	
	// for findFunction()
	this.functionName;
	this.args = [];
	
	// for findTag
	this.tag;
	this.attributes = [];
	this.values = [];
	
	// for findSelector()
	this.selector;
	this.properties = [];
	
	//for findProperty()
	this.property;
	this.value;
	
	this.initialize();
	
}

Match.prototype = {
	
	printMatch: function (errorText) {
		this.doc.addError();
		var lines = this.code.split("\n");
		var block = new CodeBlock(util.escapeHTML(lines[0].trim()), this.lineStart);
		
		var lineNum = this.lineStart + 1;
		for (var i=1; i < lines.length; i++) {
			block.add(lines[i], lineNum);
			lineNum++;
		}
		
		util.printError(this.lineStart, errorText);
		block.print();
	},
	
	printLines: function (errorText) {
		this.doc.addError();
		var lines = this.doc.getContent().split("\n");
		var block = new CodeBlock(util.escapeHTML(lines[this.lineStart-1].trim()), this.lineStart);
		
		var lineNum = this.lineStart + 1;
		for (var i=lineNum-1; i < this.lineEnd; i++) {
			block.add(lines[i], lineNum);
			lineNum++;
		}
		
		util.printError(this.lineStart, errorText);
		block.print();
	},
	
	initialize: function () {
		this.lineEnd = this.lineStart + this.code.split("\n").length - 1;
		
		var lines = this.doc.getLines();
        for (var i = this.lineStart-1; i < this.lineEnd; i++) {
        	if (this.lineCode === "")
            	this.lineCode += lines[i];
            else
            	this.lineCode += '\n' + lines[i];
        }
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

// Utility functions and variables

var util = {
	
	anything: function () {
		return "(.|[\r\n])*"; // Match any characters including new lines in regular expression
	},

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
