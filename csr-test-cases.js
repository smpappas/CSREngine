var csrTestCases = {

    addTestCase: function (nameSpace, location, type) {
        window.CSREngine.addTestCase(nameSpace, location, type);
    },

    populateTestCases: function () {
        this.addTestCase("csrIntRadixTest", "http://www.columbia.edu/~smp2183/csr-engine/js/csr-js/csr-radix-test.js", "js");
        this.addTestCase("csrFloatRadixTest", "http://www.columbia.edu/~smp2183/csr-engine/js/csr-js/csr-radix-test.js", "js");
    }

};

var csrIntRadixTest = {

    execute: function (document) {
        var lines = document.getContent().split('\n');
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
                        util.printString("Error found at line " + (i + 1) + ": No radix specified");
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
        var lines = document.getContent().split('\n');
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
                        util.printString("Error found at line " + (i + 1) + ": Radix is not necessary for parseFloat() as second parameter");
                        new CodeBlock(line.trim(), i + 1).print();
                    }
                }
                index = line.indexOf("parseInt", index + 1);
            }
        }
    }

};