var http = require("http");
var url = require("url");
var getContent = require("./get-content.js");
var extractResults = require("./google-extractor.js");

function startServe(config) {
	console.log("Start serving on port " + config.port + "...");

	var server = http.createServer(recievedRequest);

	server.listen(config.port);
}

function recievedRequest(request, response) {
	console.log( "User requests " + request.method + " to " + request.headers.host + request.url + " , user agent: " + request.headers["user-agent"] );

	if ( url.parse(request.url).pathname === "/search" ) {

		getContent("https://www.google.com/search" + url.parse(request.url).search, function(googleResponse) {
			if (googleResponse.status === "success") {
				extractResults(googleResponse.html, function(extracted) {
					respondUser(request, response, extracted);
				});
			} else {
				respondUser(request, response, googleResponse);
			}
		});
	} else {
		respondUser(request, response, { status: "Improper request address.", httpCode: 404 });
	}
}

function respondUser(request, response, data) {

	var httpCode = 200;
	if (data.httpCode !== undefined) {
		httpCode = data.httpCode;
	}

	var body = [];

	if (data.status === "success") {
		body.push("Search complete.\n\n");
		for (var i = 0; i < data.resultList.length; i++) {
			var result = data.resultList[i];
			body.push(
				result.title + "\n" +
				result.link + "\n" +
				result.description + "\n\n"
			);
		}
	} else {
		body.push(data.status + "\n");
	}

	var stringBody = body.join("");

	response.writeHead(httpCode, {
		"Content-Type": "text/plain; charset=utf-8",
		"Content-Length": Buffer.byteLength(stringBody)
	});

	response.write(stringBody);
	response.end();
	console.log("Complete, " + data.status);
}

module.exports = { startServe: startServe };