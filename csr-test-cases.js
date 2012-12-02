/*
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

    populateTestCases: function () {
        this.addTestCase("csrIntRadixTest", null, "js");
        this.addTestCase("csrFloatRadixTest", null, "js");
        this.addTestCase("csrFallbackFontTest", null, "css");
        this.addTestCase("csrAltTextTest", null, "html");
        this.addTestCase("csrScriptTest", null, "html");
    }

};

var csrIntRadixTest = {

    execute: function (document) {
        var lines = document.getLines();
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            // search for parseInt() without a radix specified
            var index = line.indexOf("parseInt", 0);
            while (index != -1) {
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
                    }
                }
                index = line.indexOf("parseInt", index + 1);
            }
        }
    }

};

var csrFloatRadixTest = {

    execute: function (document) {
        var lines = document.getLines();
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            // search for parseFloat() with a radix specified
            var index = line.indexOf("parseFloat", 0);
            while (index != -1) {
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
                    }
                }
                index = line.indexOf("parseInt", index + 1);
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
            while (index != -1) {
                var j = index;
                var k = line.indexOf(';');
                var c = line.indexOf(',');
                if (c > k || c == -1) {
                    // Need to search for font-family: inherit;
                    var inheritIndex = line.indexOf("inherit", j);
                    if (!(inheritIndex > j && (inheritIndex < k || k == -1))) {
                        document.addError();
                        util.printError(i + 1, "No fallback fonts specified in font-family property");
                        new CodeBlock(line.trim(), i + 1).print();
                    }
                }
                index = line.indexOf("font-family", k);
            }
        }
    }

};

var csrAltTextTest = {

    execute: function (document) {
        var lines = document.getLines();
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            // search for img tags
            var index = line.indexOf("<img", 0);
            while (index != -1) {
                var j = index;
                var k = line.indexOf(">", j);
                var a = line.indexOf("alt", j);
                if (a > k || a == -1) {
                    document.addError();
                    util.printError(i + 2, "No alt text specified for image");
                    new CodeBlock(util.escapeHTML(line.trim()), i + 2).print();
                }
                index = line.indexOf("<img", k);
            }
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
            while (index != -1) {
                var j = index;
                var k = line.indexOf(">", j);
                var a = line.indexOf("type", j);
                if (a > k || a == -1) {
                    document.addError();
                    util.printError(i + 2, "No script type specified");
                    new CodeBlock(util.escapeHTML(line.trim()), i + 2).print();
                }
                index = line.indexOf("<script", k);
            }
        }
    }

};
