Client-Side Reliability Engine
==============================

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

Options to come soon.

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

__Utility Functions__