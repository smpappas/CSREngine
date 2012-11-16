var csrTestCases = {

    addTestCase: function (nameSpace, location, type) {
        window.CSREngine.addTestCase(nameSpace, location, type);
    },

    populateTestCases: function () {
        this.addTestCase("csrRadixTest", "http://www.columbia.edu/~smp2183/csr-engine/js/csr-js/csr-radix-test.js", "js");
    }

};

var csrRadixTest = {

    execute: function (document) {
        var lines = document.getContent().split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var index = line.indexOf("parseInt", 0);
            while (index != -1) {
                var code = "";
                var j = index;
                var k = line.indexOf(")", j);
                while (j <= k && k != -1) {
                    code += line[j];
                    j++;
                }
                if (code != "") {
                    util.printString("Error found at line " + (i + 1) + ": No radix specified");
                    new CodeBlock(code, i + 1).print();
                }
                index = line.indexOf("parseInt", index + 1);
            }
        }
    }

};