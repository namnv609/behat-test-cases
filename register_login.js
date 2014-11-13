var testCaseIdx = -1;  // Test case index
var baseUrl = 'http://localhost:8082/'; // Base url to test
var testCases = {
    0 : {
        "fields" : {
            "last_name" : "",
            "first_name" : "",
            "career_period" : "0",
            "email" : "",
            "email_agent" : "",
            "password" : "",
            "confirmed_password" : ""
        },
        "url" : "agent/register"
    },
    1 : {
        "fields" : {
            "last_name" : "User",
            "first_name" : "Test",
            "career_period" : "1",
            "email" : "testuser@gmail.com",
            "email_agent" : "testuser@gmail.com",
            "password" : "12345678",
            "confirmed_password" : "12345678"
        },
        "url" : "agent/register"
    },
    2 : {
        "fields" : {
            "email" : "testuser@gmail.com",
            "password" : "12345678"
        },
        "url" : "agent/login"
    }
}; // List test case. Fields is id and value to fill
var time = Date.now();

renderTestCaseToImage = function(testCases, callbackPerTestCase, callbackFinal) {
    var webpage = require("webpage"),
        page = null;

    nextTestCase = function(status, testCase) {
        page.close();
        callbackPerTestCase(status, testCase);
        return screenshot();
    };

    screenshot = function() {
        if (testCaseIdx < (Object.keys(testCases).length - 1)) {
            testCaseIdx++;
            var fileName = "case_" + testCaseIdx + ".png";
            var testUrl = baseUrl + testCases[testCaseIdx]["url"];

            page = webpage.create();

            // You can change other user agent to test (for responsive)
            page.settings.userAgent = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:34.0) Gecko/20100101 Firefox/34.0";
            // Page view port
            page.viewportSize = {width: 1366, height: 768};

            console.log("Opening url " + testUrl + "...");

            //Open page
            page.open(testUrl, function(status) {
                // Check page is opened
                if (status === "success") {
                    console.log("Entering value...");

                    // Include jQuery to using jQuery selector
                    page.includeJs("http://localhost/cdn/jquery.min.js", function() {
                        var fields = testCases[testCaseIdx]["fields"];

                        page.evaluate(function(fields) {
                            // Fill all value to fields
                            for (var field in fields) {
                                $("#" + field).val(fields[field]);
                            }
                            // Submit form
                            $("form").trigger('submit');
                        }, fields);

                        // Wait for 3 sec(s) to send request then capture screenshot (will be fixed)
                        return window.setTimeout(function(){
                            // Capture screenshot
                            page.render("scr/" + fileName);
                            // Re-run
                            return nextTestCase(status, testUrl);
                        }, 3000);
                    });
                } else {
                    return nextTestCase(status, testUrl);
                }
            });
        } else {
            callbackFinal();
        }
    };

    return screenshot();
};

renderTestCaseToImage(testCases, (function(status, url){
    if (status === "success") {
        console.log("Rendered test case " + testCaseIdx);
    } else {
        console.log("Unable render test case " + testCaseIdx);
    }
}), function(){
    time = (Date.now() - time);
    console.log("Done with "+ (time / 1000) +" second(s)!");
    return phantom.exit();
});