﻿/*
*
* Client-Side Reliability Engine
* csr-test-cases.js
* Steve Pappas
* Columbia University
*
*/

var csrTestCases = {

    addTestCase: function (nameSpace, location, type) {
        window.CSREngine.addTestCase(nameSpace, location, type);
    },

    // list of current test cases
    populateTestCases: function () {
        //this.addTestCase("csrIntRadixTest", null, "js");
        this.addTestCase("csrFloatRadixTest", null, "js");
        //this.addTestCase("csrTypeWrapperTest", null, "js");
        this.addTestCase("csrFallbackFontTest", null, "css");
        this.addTestCase("csrZeroUnitTest", null, "css");
        this.addTestCase("csrAltTextTest", null, "html");
        this.addTestCase("csrScriptTest", null, "html");
        this.addTestCase("csrOnClickTest", null, "html");
    }

};

var csrIntRadixTest = {

    /*execute: function (document) {
        var lines = document.getLines();
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            // search for parseInt() without a radix specified
            var index = line.indexOf("parseInt", 0);
            var errorFound = false;
            while (index != -1 && !errorFound) {
                var code = "";
                var j = index;
                var k = line.indexOf(")", j);
                var c = line.indexOf(",", j);
                if (c > k || c == -1) {
                    document.addError();
                    while (j <= k && k != -1) {
                        code += line[j];
                        j++;
                    }
                    if (code != "") {
                        util.printError(i + 1, "No radix specified");
                        new CodeBlock(line.trim(), i + 1).print();
                        errorFound = true;
                    }
                }
                index = line.indexOf("parseInt", index + 1);
            }
        }
    }*/
   
	execute: function (document) {
		var matches = document.findFunction("parseInt");
		   
		for (var i=0; i<matches.length; i++) {
			if (matches[i].args.length <= 1) {
				matches[i].printLines("No radix specified.");
			}
		}
	}

};

var csrFloatRadixTest = {

    /*execute: function (document) {
        var lines = document.getLines();
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            // search for parseFloat() with a radix specified
            var index = line.indexOf("parseFloat", 0);
            var errorFound = false;
            while (index != -1 && !errorFound) {
                var code = "";
                var j = index;
                var k = line.indexOf(")", j);
                var c = line.indexOf(",", j);
                if (c < k && c > j) {
                    document.addError();
                    while (j <= k && k != -1) {
                        code += line[j];
                        j++;
                    }
                    if (code != "") {
                        util.printError(i + 1, "Radix is not necessary for parseFloat() as second parameter");
                        new CodeBlock(line.trim(), i + 1).print();
                        errorFound = true;
                    }
                }
                index = line.indexOf("parseFloat", index + 1);
            }
        }
    }*/
    
    execute: function (document) {
		var matches = document.findFunction("parseFloat");
		   
		for (var i=0; i<matches.length; i++) {
			if (matches[i].args.length > 1) {
				matches[i].printLines("Radix is not necessary for parseFloat() as second parameter.");
			}
		}
	}

};

var csrFallbackFontTest = {

    execute: function (document) {
        var lines = document.getLines();
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            // search for font-family or font properties
            var index = line.indexOf("font-family", 0);
            var errorFound = false;
            while (index != -1 && !errorFound) {
                var j = index;
                var k = line.indexOf(';');
                var c = line.indexOf(',');
                if (c > k || c == -1) {
                    // Need to search for font-family: inherit;
                    var inheritIndex = line.indexOf("inherit", j);
                    if (!(inheritIndex > j && (inheritIndex < k || k == -1))) {
                        document.addError();
                        util.printError(i + 1, "No fallback fonts specified in font-family property.");
                        new CodeBlock(line.trim(), i + 1).print();
                        errorFound = true;
                    }
                }
                index = line.indexOf("font-family", k);
            }
        }
    }

};

var csrZeroUnitTest = {

    execute: function (document) {
        var lines = document.getLines();
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            // search for 0px or 0em
            var index = line.indexOf(":0px", 0);
            var index2 = line.indexOf(" 0px", 0);
            var index3 = line.indexOf(":0em", 0);
            var index4 = line.indexOf(" 0em", 0);
            /*var index5 = line.indexOf(":0%", 0);
            var index6 = line.indexOf(" 0%", 0);*/
            if (index != -1 || index2 != -1 ||
                        index3 != -1 || index4 != -1) {
                document.addError();
                util.printError(i + 1, "Units unnecessarily declared when specifying zero value.");
                new CodeBlock(line.trim(), i + 1).print();
            }
        }
    }

};

var csrAltTextTest = {

    /*execute: function (document) {
        var lines = document.getLines();
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            // search for img tags
            var index = line.indexOf("<img", 0);
            var errorFound = false;
            while (index != -1 && !errorFound) {
                var j = index;
                var k = line.indexOf(">", j);
                var a = line.indexOf("alt", j);
                if (a > k || a == -1) {
                    document.addError();
                    util.printError(i + 1, "No alt text specified for image");
                    new CodeBlock(util.escapeHTML(line.trim()), i + 1).print();
                    errorFound = true;
                }
                index = line.indexOf("<img", k);
            }
        }
    }*/
	
	execute: function (document) {
		var matches = document.findTag("img");
		
		var found = false;
		for (var i=0; i<matches.length; i++) {
			var attributes = matches[i].attributes;
			for (var j=0; j<attributes.length; j++) {
				if (attributes[j] === "alt") {
					found = true;
				}
			}
			if (found == false) {
				matches[i].printLines("No alt text specified for image.");
			}
			found = false;
		}
	}

};

var csrScriptTest = {

    execute: function (document) {
        var lines = document.getLines();
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            // search for img tags
            var index = line.indexOf("<script", 0);
            var errorFound = false;
            while (index != -1 && !errorFound) {
                var j = index;
                var k = line.indexOf(">", j);
                var a = line.indexOf("type", j);
                if (a > k || a == -1) {
                    document.addError();
                    util.printError(i + 1, "No script type specified.");
                    new CodeBlock(util.escapeHTML(line.trim()), i + 1).print();
                    errorFound = true;
                }
                index = line.indexOf("<script", k);
            }
        }
    }

};

var csrOnClickTest = {

    execute: function (document) {
        var lines = document.getLines();
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            // search for onclick events
            var index = line.indexOf("onclick=", 0);
            var errorFound = false;
            while (index != -1 && !errorFound) {
                document.addError();
                util.printError(i + 1, "Please do not use 'onclick' to attach click events; attach events in JavaScript files.");
                new CodeBlock(util.escapeHTML(line.trim()), i + 1).print();
                index = line.indexOf("onclick=", index + 1);
                errorFound = true;
            }
        }
    }

};

var csrTypeWrapperTest = {

    execute: function (document) {
		var pattern = "\\=\\s*new\\s*(Boolean|String|Number)\\(";
		var matches = document.regex(pattern);
		   
		for (var i=0; i<matches.length; i++) {
			matches[i].printLines("Avoid type wrapper objects when possible.");
		}
    }

};

// OLD VERSION
/*var csrTypeWrapperTest = {

    findIndex: function (line, index) {
        var i1 = line.indexOf("new Boolean(", index);
        var i2 = line.indexOf("new String(", index);
        var i3 = line.indexOf("new Number(", index);

        var index = i1;
        if ((i2 < index && i2 != -1) || index == -1) {
            index = i2;
        }
        if ((i3 < index && i3 != -1) || index == -1) {
            index = i3;
        }
        return index;
    },

    execute: function (document) {
        var lines = document.getLines();
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            // search for inappropriate type wrapper objects
            var index = this.findIndex(line, 0);
            if (index != -1) {
                document.addError();
                util.printError(i + 1, "Avoid type wrapper objects when possible");
                new CodeBlock(util.escapeHTML(line.trim()), i + 1).print();
            }
        }
    }

};*/
