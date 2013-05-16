Client-Side Reliability Engine
==============================

The Client-Side Reliability Engine provides feedback on common bugs associated with HTML, CSS, and JavaScript code. The engine helps to ensure that best practices are being employed to improve reliability and reduce the chance of undesired results.

An example can be found at [http://steve-pappas.com/csr](http://steve-pappas.com/csr)

## Users

#### Dependencies

The Client-Side Reliability Engine makes use of jQuery and requires version 1.6 or higher. For more information on jQuery, visit http://www.jquery.com.

jQuery can be referenced from Google's CDN by placing the following code inside the `<head>` tag of your page

```html
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js" type="text/javascript"></script>
```

#### Usage

In the `<head>` tag of your page, include the following reference

```html
    <script src="http://www.steve-pappas.com/staticsmp/csr-engine/js/csr-engine.js" type="text/javascript"></script>
```

You may also host the project separately. Please see the <a href="http://smpappas.github.io/CSREngine/developers" style="font-weight: bold;">Developers</a> page for information about hosting. If hosted separately, include the following reference instead


```html
    <script src="/path/to/csr-engine.js" type="text/javascript"></script>
```

At the bottom of the `<head>` tag, also include the following script block

```html
    <script type="text/javascript">
        $(function () {
                var options = { }
                
                CSREngine.initialize(options);
            });
    </script>
```

This script block initializes the Client-Side Reliability Engine and runs an analysis with the default options.

#### Options

Options can be defined both in the `<script>` drop-in code to replace defaults, or chosen from the options panel within your Web page. An example script to set the default options is shown below.

```html
    <script type="text/javascript">
        $(function () {
                var options = {
                    "html": true,
                    "css": true,
                    "javascript": true,
                    "filters": [
                        "tria1.js",
                        "trial2.js"
                    ],
                    "noFilters": [
                        
                    ],
                    "lint": true,
                    // define jslint options
                    "lintOptions": [ {
                        "browser": true,
                        "devel": true,
                        "predef": ["jQuery", "$"],
                        "sloppy": true,
                        "vars": true,
                        "white": true
                    } ]
                }
                
                CSREngine.initialize(options);
            });
    </script>
```

The following options are available

`"html"` - true to run HTML tests, false otherwise. Default is true.<br />
`"css"` - true to run CSS tests, false otherwise. Default is true.<br />
`"javascript"` - true to run JavaScript tests, false otherwise. Default is true.<br />
`"filters"` - List files that should not be included in the tests. For example, you may not want to include third-party library files that would not be filtered out by default.<br />
`"noFilters"` - List of files that should always be included in the tests. This will override the default filters.<br />
`"lint"` - true to run JSLint on JavaScript files, false otherwise. Default is true.<br />
`"lintOptions"` - Set the JSLint options. Defaults are shown in example above. Please see Options section at http://www.jslint.com/lint.html for details of each available option.<br />

Options will reset to these defaults on each refresh, but all options can be selected ad hoc through the options panel within the page.

#### Test Cases

The Client-Side Reliability Engine runs a series of test cases on each client-side file to determine if any issues exist. These tests perform static code analysis on each file, meaning no code within the file is actually executed. Test are grouped into test suites by file type. Each suite of tests can be added or removed from analysis through the Web page options panel.

Please see the "Managing and Writing User Defined Test Cases" topic within the Developers section for more detail about user defined tests.

#### JSLint Integration

The Client-Side Reliability engine integrates JSLint to perform tests on JavaScript files. Integration is turned on by default, but can be turned off within script options or the options panel.

All major JSLint options are available. Please see Options section at http://www.jslint.com/lint.html for details of each available option.

#### Filters

By default, common third-party libraries and frameworks, such as jQuery, MooTools, and backbone.js, are not analyzed by the engine. Default files to filter out can be added through the options discussed above. To override a file that is filtered out by default, add the file to the "noFilters" option. Files can also be added or removed from analysis through the Web page options panel.

---

## Extensibility / Open Issues

#### CSS Conflicts

Occasionally, the CSS code used for this project may conflict with the host Website's style. This code is constantly being tweaked as issues are encountered.

#### Test Cases

Currently, all test cases are located in the file csr-test-cases.js.  In the future, it may be the case that multiple developers are working on test cases concurrently.  To avoid csr-test-cases.js being edited by all test case developers, ideally test cases will be split out into multiple files.

Initial attempts to divide test cases into multiple files created issues, so all test cases were moved into csr-test-cases.js for the time being.

#### More Test Cases

The Client-Side Reliability Engine provides a simple framework for creating user defined tests on HTML, CSS, and JavaScript code. Developers are free to contribute their own tests to the project. The more tests that are available, the better. Please see the <a href="http://smpappas.github.io/CSREngine/developers" style="font-weight: bold;">Developers</a> page for information about writing user defined tests.

---

## Developers

This page is meant for advanced users and developers. Information on hosting, writing new tests, and general class reference is provided.

#### Files

The directory structure of the CSREngine looks as follows

    csr-engine/
        css/
            csr-engine.css
            syntax/
                shCore.css
        js/
            csr-engine.js
            csr-test-cases.js
            beautify/
                beautify.js
            jslint/
                jslint.js
            syntax/
                shBrushCss.js
                shBrushJScript.js
                shBrushXml.js
                shCore.js

`js/csr-test-cases.js` - Contains the implementation of all test cases, as well as a list of all test cases to be run.<br />
`js/csr-engine.css` - Contains all styling for the engine.<br />
`css/csr-engine.js` - Contains all classes and code relevant to the core functionality of the engine.<br />
`js/beautify/beautify.js` - Un-minifies scripts so that they can be analyzed.<br />
`js/jslint/jslint.js` - Contains the core functionality for JSLint by Douglas Crockford.<br />
`js/syntax/*` - Contains all scripts related to syntax highlighting.<br />
`css/syntax/shCore.css` - Contains styling for syntax highlighting.<br />

#### Hosting the Engine

The engine is currently hosted at: http://www.steve-pappas.com/staticsmp/csr-engine/js/csr-engine.js

To host the engine on a different server, each file needs to be uploaded to that server.  As explained above, the `<script>` tag in the Web page should link to the location of csr-engine.js.  In addition, csr-engine.js must be updated as described below.

The CSREngine class contains a member called locPrefix.  Update the following line to contain the paths to the root csr-engine/ folder.  This location is defined as the first member of the CSREngine class.

```javascript
    this.locPrefix = "path/to/csr-engine/";
```

#### Managing and Writing User Defined Test Cases

Each test case is designated a type, which determines which files the test applies to.

New test cases can be added into the file csr-test-cases.js. Existing test cases can be used as a guide. The steps to create a new test case are as follows

1) &nbsp;Add a new entry to the populateTestCases function within the csrTestCases namespace.  The entry should look similar to below.  The first parameter specifies the namespace of the test case you are creating, always beginning with "csr" - look at examples for clarification.  The second parameter will specify the file that the test case resides in, but this should be left as null until this is implemented.  The last parameter specifies the type of test case and should be one of "html", "css", or "js".
    
```javascript
    this.addTestCase("csrNamespaceOfTestCase", null, "html");
```

2) &nbsp;Create a namespace for the test case and an execute function.  The format should be similar to below.

```javascript
    var csrNamespaceOfTestCase = {
    
        execute: function (document) {
            // Test body goes here
        }
        
    };
```
    
The execute function of your new test case will be called automatically.  There is no restriction to adding more helper functions within your new test namespace, and in fact this is encouraged for code clarity.  These functions can be called from execute, i.e. execute() can be thought of as a main() function, where code execution for your test case begins.

A complete example can be seen below. This code will test to see if a radix has been specified when using the ParseInt() function in JavaScript.

```javascript
    var csrNamespaceOfTestCase = {

        execute: function (document) {
            var matches = document.findFunction("parseInt");
               
            for (var i=0; i<matches.length; i++) {
                if (matches[i].args.length <= 1) {
                    matches[i].printLines("No radix specified.");
                }
            }
        }

    };
```

#### Searching and Scanning Document Code

String parsing can be difficult, so some methods are provided to aid in searching and scanning the document. It is recommended to use these methods if possible in order to make the developer's life easier. Each method is described below along with sample usage.

`Document.regex(pattern)` - Applies to HTML, CSS, JS
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Runs a regular expression against source code and returns all matching locations and lines. Returns an array of Match objects.
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You must use two forward slashes (\\\\) to escape characters.
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Example usage:

    var pattern = "^\\$\\(function\\(\\)\\s*\\{" + util.anything() + "\\}\\);$";
    var matches = document.regex(pattern);

`Document.findFunction(f)` - Applies to JS
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Finds instances of a function and returns locations and arguments. Returns an array of Match objects.
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Example Usage:

    var matches = document.findFunction("myFunction");

`Document.findTag(tag)` - Applies to HTML
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Finds instances of html tags and returns attribute values. Returns an array of Match objects.
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Example Usage:

    var matches = document.findTag("img");

`Document.findSelector(s)` - Applies to CSS
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Finds instances of class/identifier and returns properties and values. Returns an array of Match objects.
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Example Usage:

    var matches = document.findSelector("#myId");

`Document.findProperty(prop)` - Applies to CSS
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Finds instances of property and returns and values. Returns an array of Match objects.
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Example Usage:

    var matches = document.findProperty("font-family");

#### The Match Class

The Match class is used to return matches from regular expressions. Each of the above search methods runs a regular expression against the source code and returns an array of matches. Each of these matches contains various information that can be used and printed. The members of the Match class are

```javascript
    doc  // Document where match was found
    code  // Matching code from the regular expression
    lineStart  // Line number that matching code starts on
    indexStart  // Index that matching code start at
    lineEnd  // Line number that matching code ends on
    lineCode  // Entire first line of code of the match
    
    // for findFunction()
    functionName  // Name of function
    args  // Array of function arguments

    // for findTag
    tag  // Tag being searched for
    attributes  // Array of tag attributes
    values  // Array of values for attributes
    
    // for findSelector() - values contains array of property values
    selector  // ID, class, or selector being searched for
    properties  // Array of properties found in the selector
    
    //for findProperty()
    property  // Property being searched for
    value  // Value for the property
```

Depending on which search method is run, various members of the Match class will be populated. The developer can simply loop through an array of Match objects to access the information contained in each one. The Match class contains two print methods to easily print an issue to screen.

`Match.printMatch(errorText)`
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Automatically adds an error to the document and prints only code matching the regular expression. Takes in text of error message to print.

`Match.printLines(errorText)`
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Automatically adds an error to the document and prints all lines of code containing the regular expression. Takes in text of error message to print.

#### Additional Helper Functions

There are a number of additional helper functions available to help with implementing test cases. Please use existing examples as reference.

__Documents__

`Document.getLines()`
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Returns an array that consists of the document split into lines. This allows traversal of the document line by line using a __for__ loop or similar.

`Document.indexToLine(index)`
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Takes an index number and converts it to a line number in source code.

`Document.lineToCode(line)`
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Takes a line number and returns the source code of the line.

`Document.addError()`
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Should be called when an error is found if not using the Match class. This is used to track the number of errors found in each document.

__Code Blocks__

A CodeBlock class has been implemented to make it easy to print formatted code to screen. Example usage is shown below, and member functions are described. This class only needs to be instantiated if NOT using one of the main search methods.

```javascript
    var lines = document.getLines();
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        
        // Trim line to ensure trailing spaces and new lines are not included
        var cb = new CodeBlock(line.trim(), i+1);
        cb.print();
    }
```
    
`CodeBlock(code, lineNumber)`
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Initialize a new CodeBlock instance with code found at lineNumber.  Parameters code and lineNumber are optional, and CodeBlock will be initialized to be empty if not specified.

`CodeBlock.add(code, lineNumber)`
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Adds code found at lineNumber to current CodeBlock instance.  This can be used to create a single-line code block when the current instance is empty, or used to create multiline code blocks by calling this function on sequential lines of code.

`CodeBlock.clear()`
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Empties the current CodeBlock instance.  New code can be added to the existing code block through CodeBlock.add().

`CodeBlock.print()`
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Prints the current CodeBlock instance to screen.

__General Utility__

`util.anything()`
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For use in regular expression patterns, this returns a pattern that will match any characters including new lines in regular expression.
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Example usage:

    var pattern = "^\\$\\(function\\(\\)\\s*\\{" + util.anything() + "\\}\\);$";
    var matches = document.regex(pattern);

`util.printString(s, classes)`
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Print string s to screen.  This function should always be used when printing to the tool output. Parameter classes is optional and will add any specified CSS classes to the text output, e.g. to make text bold-italic specify "csr-bold csr-italic".

`util.printError(lineNumber, e)`
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Similar to util.printString(), prints error message e to screen. Parameter lineNumber specifies which line the error occurred on.

`util.escapeHTML(code)`
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;When printing HTML code to screen, the code must be wrapped in this function in order to escape special characters. This prevents the browser from trying to execute or interpret code. This does not need to be used when printing Match objects directly.

---

## Class Reference

Class descriptions and primary member functions listed below.

#### CSREngine Class

Used to create an instance of the engine where code execution begins.

#### DocAnalysis Class

Used to run analysis on a particular document.

#### TestCase Class

Contains information about a test case including its type and where the implementation is located.

#### Document Class

Contains information about a document (file) including its location, type, and source code.

#### Filters Class

Used to create document filters to specify which documents should and should not be analyzed.

#### Match Class

Used to return and manipulate information obtained from running a regular expression on source code.

#### CodeBlock Class

Used to create a block or line of code to be printed to screen.

#### util (Utility Namespace)

Contains a number of utility and helper functions for use in implementing core functionality and test cases.
