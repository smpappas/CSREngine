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

}

CSREngine.prototype = {

    // Member functions

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

            //this.addTestMessages();;
            var s = 'console.log("trial code");';
            $('#csr-wrapper').append('<pre><code>' + s + '</code></pre>');
        }

    },

    getConsolePrint: function () { return this.consolePrint; },

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

    addTestMessages: function () {
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
        $('#csr-wrapper').append('<p>This is a message.</p>');
        $('#csr-wrapper').append('<p>This is a message.</p>');
    }

};