Client-Side Reliability Engine
==============================

The Client-Side Reliability Engine provides feedback on common bugs associated with HTML, CSS, and JavaScript code.  The engine helps to ensure that best practices are being employed to improve reliability and reduce the chance of undesired results.

### Users

__Dependencies__

The Client-Side Reliability Engine makes use of jQuery and requires version 1.6 or higher.  For more information on jQuery, visit http://www.jquery.com.

jQuery can be referenced from Google's CDN by placing the following code inside the `<head>` tag of your page

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js" type="text/javascript"></script>

__Usage__

In the `<head>` tag of your page, include the following reference

    <script src="/path/to/csr-engine.js" type="text/javascript"></script>

At the bottom of the `<head>` tag, also include the following script block

    <script type="text/javascript">
        $(function () {
            CSREngine.initialize(false);
        });
    </script>

This script block initializes the Client-Side Reliability Engine and runs an analysis with the default options.

__Options__

Options are not currently implemented, but the intention is to allow users to customize their experience.  In the future, users should be able to designate (i) specific files that should NOT be filtered out, and (ii) whether to output to the web page or JavaScript console.

--

### Developers

__Adding a New Test Case__

New test cases can be added into the file csr-test-cases.js.  Existing test cases can be used as a guide.  The steps to create a new test case are as follows.

1.  Add a new entry to the populateTestCases function within the csrTestCases namespace.  The entry should look similar to below.  The first parameter specifies the namespace of the test case you are creating, always beginning with "csr" - look at examples for clarification.  The second parameter will specify the file that the test case resides in, but this should be left as null until this is implemented.  The last parameter specifies the type of test case and should be one of "html", "css", or "js".
    
    <pre><code>this.addTestCase("csrNamespaceOfTestCase", null, "html");</code></pre>

2.  Create a namespace for the test case and an execute function.  The format should be similar to below.

    <pre><code>var csrNamespaceOfTestCase = {
    
        execute: function (document) {
            // Test body goes here
        }
        
    };</code></pre>
    
The execute function of your new test case will be called automatically.  There is no restriction to adding more helper functions within your new test namespace, and in fact this is encouraged for code clarity.  These functions can be called from execute, i.e. execute() can be thought of as a main() function, where code execution for your test case begins.

__Helper Functions__

There are a number of helper functions available to help with implementing test cases.  Please use existing examples as reference.

_Documents_

__`Document.getLines()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Returns an array that consists of the document split into lines.  This allows traversal of the document line by line using a __for__ loop or similar.

__`Document.addError()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Should be called when an error is found.  This is used to track the number of errors found in each document.

_Code Blocks_

A CodeBlock class has been implemented to make it easy to print formatted code to screen.  Example usage is shown below, and member functions are described.

    var lines = document.getLines();
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        
        // Trim line to ensure trailing spaces and new lines are not included
        var cb = new CodeBlock(line.trim(), i+1);
        cb.print();
    }
    
__`CodeBlock(code, lineNumber)`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Initialize a new CodeBlock instance with code found at lineNumber.  Parameters code and lineNumber are optional, and CodeBlock will be initialized to be empty if not specified.

__`CodeBlock.add(code, lineNumber)`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Adds code found at lineNumber to current CodeBlock instance.  This can be used to create a single-line code block when the current instance is empty, or used to create multiline code blocks by calling this function on sequential lines of code.

__`CodeBlock.clear()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Empties the current CodeBlock instance.  New code can be added to the existing code block through CodeBlock.add().

__`CodeBlock.print()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Prints the current CodeBlock instance to screen.

_General Utility_

__`util.printString(s, classes)`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Print string s to screen.  This function should always be used when printing to the tool output.  Parameter classes is optional and will add any specified CSS classes to the text output, e.g. to make text bold-italic specify "csr-bold csr-italic".

__`util.printError(lineNumber, e)`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Similar to util.printString(), prints error message e to screen.  Parameter lineNumber specifies which line the error occurred on.

__`util.escapeHTML(code)`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;When printing HTML code to screen, the code must be wrapped in this function in order to escape special characters.  This prevents the browser from trying to execute or interpret code.
