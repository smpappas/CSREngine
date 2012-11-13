var csrTestCases = {

    addTestCase: function (nameSpace, location, type) {
        window.CSREngine.addTestCase(nameSpace, location, type);
    },

    populateTestCases: function () {
        this.addTestCase("csrRadixTest", "http://localhost:4231/Scripts/csr-js/csr-radix-test.js", "js");
    }

};