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

Options are not currently implemented, but the intention is to allow users to customize their experience.  In the future, users should be able to designate (i) specific files that should NOT be filtered out, and (ii) whether to output results to the web page or JavaScript console.

__Filters__

By default, common third-party libraries and frameworks, such as jQuery, MooTools, and backbone.js, are not analyzed by the engine.  Adding and removing files from the filter is discussed further in the Developer section.

__Test Cases__

The Client-Side Reliability Engine runs a series of test cases on each client-side file to determine if any issues exist. These tests perform static code analysis on each file, meaning no code within the file is actually executed.

Each test case is designated a type, which determines which files the test applies to. A list of currently implemented test cases is shown below along with the file type the test is associated with.

    Missing alternative text for images                         -   HTML
    Missing script type                                         -   HTML
    Using 'onclick' to attach a JavaScript event handler        -   HTML
    Defining units for zero values                              -   CSS
    Not specifying fallback fonts, i.e. no font stack           -   CSS
    Not specifying a radix when converting strings to integers  -   JavaScript
    Specifying a radix when converting strings to floats        -   JavaScript
    Using type wrapper objects inappropriately                  -   JavaScript
<br />

---

### Developers

__Files__

`csr-engine.js` - Contains all classes and code relevant to the core functionality of the engine.<br />
`csr-test-cases.js` - Contains the implementation of all test cases, as well as a list of all test cases to be run.<br />
`csr-engine.css` - Contains all styling for the engine.

__Hosting the Engine__

The engine is currently hosted at: http://www.columbia.edu/~smp2183/csr-engine/js/csr-engine.js

To host the engine on a different server, each file needs to be uploaded to that server.  As explained above, the `<script>` tag in the Web page should link to the location of csr-engine.js.  In addition, csr-engine.js must be updated as described below.

The CSREngine class contains two members called styleSheetLocation and testCaseLocation.  Update the following lines to contain the paths to each of these files, respectively.  These locations are defined toward the beginning of the file.

    this.styleSheetLocation = "path/to/csr-engine.css";
    this.testCaseLocation = "path/to/csr-test-cases.js";

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

__Filters__

The Filters class in csr-engine.js specifies files that will not be analyzed.  The function `initialize()` contains a number of lines similar to the following.

    this.filters.push("csr-engine");
    
This line will filter out all CSS and JS files where the file name contains "csr-engine", e.g. csr-engine-xxx.js.  To add new filtered files, simply add new lines in the `initialize()` function.  To remove filtered files, simply remove or comment out the appropriate lines.

--

### Extensibility

__Filters__

The filters class currently filters out all files where the file name contains a substring as specified in `this.filters.push(substring)`.  A case may exist where the user wants to filter out some files that match this substring, but analyze others as normal.
For example, it is likely that files named 'jquery-xxx' should be filtered out, but a user may make a custom extension called 'jquery-custom-extension-xxx'.  The Filters class could be expanded to allow the user to designate specific files that should not be filtered out, allowing user created files such as this to be analyzed.

__Options__

Though options have not been implemented yet, a number of options should be available to users in the future.  These options could be specified in the initialization script on the page, which might look similar to the following.

    <script type="text/javascript">
        $(function () {
            var options = { /* insert all options here */ };
            CSREngine.initialize(options);
        });
    </script>
    
(i) Console Printing - Currently, the engine outputs all results above the current page.  This is specified in the line `CSREngine.initialize(false)`.  The user has the option of instead printing all results to the JavaScript console by specifying `CSREngine.initialize(true)`, making the output a bit less obtrusive.

Although this functionality is not yet implemented, the member function `runConsole()` in the CSREngine class is a jumping off point.  Likely, all utility functions and member functions of the CodeBlock class will have to take this condition into account in order to print to console instead of to the Web page.

(ii) Filters - As described above, the user needs a way to designate specific files that will always be analyzed, as well as files that should not be analyzed and are not part of the default filters.  These files should be made a part of the user options when initializing the CSREngine.

__Test Cases__

Currently, all test cases are located in the file csr-test-cases.js.  In the future, it may be the case that multiple developers are working on test cases concurrently.  To avoid csr-test-cases.js being edited by all test case developers, ideally test cases will be split out into multiple files.

Initial attempts to divide test cases into multiple files created issues, so all test cases were moved into csr-test-cases.js for the time being.

--

### Class Reference

Class descriptions and primary member functions listed below.

___CSREngine Class___

Used to create an instance of the engine where code execution begins.

__`CSREngine.initialize()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kicks off the engine analysis.

__`CSREngine.runNormal()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Run analysis with option to print results above Web page.

__`CSREngine.runConsole()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Run analysis with option priont results to JavaScript console.

<b>`CSREngine.populateDocuments()`</b>
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Search HTML source for `<link>` and `<script>` tags to populate array CSREngine.documents with all linked client-side files.

<b>`CSREngine.populateTestCases()`</b>
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Calls function `csrTestCases.populateTestCases()` located in csr-test-cases.js to populate an array of all current test cases.

__`CSREngine.analyzeDocuments()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Creates an instance of DocAnalysis class for each linked client-side document and kicks off analysis on that document.

___DocAnalysis Class___

Used to run analysis on a particular document.

__`DocAnalysis.runAnalysis()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Entry point for running analysis on a document.  Calls one of the below functions depending on the type of the document contained in the instance of the class.

__`DocAnalysis.runHtmlAnalysis()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Runs all HTML test cases on the document.

__`DocAnalysis.runCssAnalysis()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Runs all CSS test cases on the document.

__`DocAnalysis.runJsAnalysis()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Runs all JavaScript test cases on the document.

___TestCase Class___

Contains information about a test case including its type and where the implementation is located.

___Document Class___

Contains information about a document (file) including its location, type, and source code.

__`Document.getLines()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Returns an array that consists of the document split into lines.  This allows traversal of the document line by line using a __for__ loop or similar.

__`Document.addError()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Should be called when an error is found in document.  This is used to track the number of errors found in each document.

__`Document.readContent()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Performs and AJAX request to locate the document.  If the document is found, the source code is assigned to class member content'.

__`Document.getContent()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Returns the source code of the document contained in class member 'content'.

__`Document.printContent()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Prints the source code of the document to the JavaScript console.  This is mostly used for debugging.

___Filters Class___

Used to create document filters to specify which documents should and should not be analyzed.

__`Filters.initialize()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Defines the default filters and pushes them onto an array held in class member 'filters'.

__`Filters.getFilters()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Returns an array of all filters held in class member 'filters'.

__`Filters.ignore(source)`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Takes in a file name/location and returns true if the file should be ignored during the analysis, false otherwise.

___CodeBlock Class___

Used to create a block or line of code to be printed to screen.

__`CodeBlock(code, lineNumber)`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Initialize a new CodeBlock instance with code found at lineNumber.  Parameters code and lineNumber are optional, and CodeBlock will be initialized to be empty if not specified.

__`CodeBlock.add(code, lineNumber)`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Adds code found at lineNumber to current CodeBlock instance.  This can be used to create a single-line code block when the current instance is empty, or used to create multiline code blocks by calling this function on sequential lines of code.

__`CodeBlock.clear()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Empties the current CodeBlock instance.  New code can be added to the existing code block through CodeBlock.add().

__`CodeBlock.print()`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Prints the current CodeBlock instance to screen.

___util (Utility Namespace)___

Contains a number of utility and helper functions for use in implementing core functionality and test cases.

__`util.printString(s, classes)`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Print string s to screen.  This function should always be used when printing to the tool output.  Parameter classes is optional and will add any specified CSS classes to the text output, e.g. to make text bold-italic specify "csr-bold csr-italic".

__`util.printError(lineNumber, e)`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Similar to util.printString(), prints error message e to screen.  Parameter lineNumber specifies which line the error occurred on.

__`util.escapeHTML(code)`__
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;When printing HTML code to screen, the code must be wrapped in this function in order to escape special characters.  This prevents the browser from trying to execute or interpret code.
