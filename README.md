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