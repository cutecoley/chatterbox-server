/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
  //Content-Type: 'text/plain'
};

var obj = {};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  // console.log('Serving request type ' + request.method + ' for url ' + request.url);
  // // In spec tests, request.method should = 'GET', request.url should = 'classes/messages'
  // console.log('Typeof Response WriteHead: ', typeof response.writeHead, 'Actual writehead:', response.writeHead);

  // console.log('Response status code: ' + response.statusCode + ' and Response headers: ' + response.headers);

  // The outgoing status.
  var statusCode;
  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  var responded = false;
  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  if (request.url !== '/classes/messages') {
    console.log('404!');
    statusCode = 404;
    response.writeHead(statusCode, headers);
    responded = true;
    response.end('404 error: URL not found');
  } else if (Array.isArray(request._postData) || typeof request._postData === 'string' || typeof request._postData == 'number' ) {
    statusCode = 400;
    response.writeHead(statusCode, headers);
    responded = true;
    response.end('400 error: Bad syntax request');

  } else if (request.method === 'POST') {
    console.log('POST 1; URL:', request.url);
    statusCode = 201;
    var body = '';
    request.on('data', function (data) {
      body += data;
      console.log("Partial body: 2 " + body, 'Typeof body:', typeof body);
    });
    request.on('end', function () {
      console.log("Body: 3 " + body);
      obj.results = [JSON.parse(body)];
      // response.writeHead(statusCode, headers);
      // response.end(JSON.stringify([body]));
    });
    response.writeHead(statusCode, headers);

    // obj.results = [body];
    // var obj = {};
    // body.results = [1,2,3,6,7,8];
    console.log('Post received!!! Outgoing body: 4', body.results);
    responded = true;
    response.end(JSON.stringify(body));

  } else if (request.method === 'GET') {
    statusCode = 200;
    headers['Content-Type'] = 'text/plain';
    // .writeHead() writes to the request line and headers of the response,
    // which includes the status and all headers.
    response.writeHead(statusCode, headers);
    // Make sure to always call response.end() - Node may not send
    // anything back to the client until you do. The string you pass to
    // response.end() will be the body of the response - i.e. what shows
    // up in the browser.
    //
    // Calling .end "flushes" the response's internal buffer, forcing
    // node to actually send all the data over to the client.
    // var obj = {};
    obj.results = obj.results || []; // [stringifiedObj]

    // console.log('Get response.end:', obj);
    // response.end(JSON.stringify(obj));

    console.log('OBJ RESULTS!');
    responded = true;
    if (obj.results.length > 0) {
      response.end(JSON.stringify(obj)); // -> "messages" -> [{username: blah}]
    } else {
      response.end(JSON.stringify(obj)); 
    }

    //Test 6: obj.results = [{username: 1212}] WORKS!
    //I.e. response.end(JSON.stringify(obj)); //obj.results = [{username: 1212}]

  } 

  setInterval(function() {
    if (responded === false) {
      statusCode = 503;
      response.end('Error 503: Gateway timed out!');
    }
  }, 1000);


};



// {"results":["{\"username\":\"Jono\",\"message\":\"Do my bidding!\"}"]}
// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
// console.log('test');
// console.log(typeof requestHandler, requestHandler);
exports.requestHandler = requestHandler;

//////////////////////////////////////////////////////////
/*
Request data: IncomingMessage {
  _readableState: 
   ReadableState {
     objectMode: false,
     highWaterMark: 16384,
     buffer: [],
     length: 0,
     pipes: null,
     pipesCount: 0,
     flowing: null,
     ended: false,
     endEmitted: false,
     reading: false,
     sync: true,
     needReadable: false,
     emittedReadable: false,
     readableListening: false,
     resumeScheduled: false,
     defaultEncoding: 'utf8',
     ranOut: false,
     awaitDrain: 0,
     readingMore: false,
     decoder: null,
     encoding: null },
  readable: true,
  domain: null,
  _events: {},
  _eventsCount: 0,
  _maxListeners: undefined,
  socket: 
   Socket {
     _connecting: false,
     _hadError: false,
     _handle: 
      TCP {
        _externalStream: {},
        fd: 54,
        reading: true,
        owner: [Circular],
        onread: [Function: onread],
        onconnection: null,
        writeQueueSize: 0 },
     _parent: null,
     _host: null,
     _readableState: 
      ReadableState {
        objectMode: false,
        highWaterMark: 16384,
        buffer: [],
        length: 0,
        pipes: null,
        pipesCount: 0,
        flowing: true,
        ended: false,
        endEmitted: false,
        reading: true,
        sync: false,
        needReadable: true,
        emittedReadable: false,
        readableListening: false,
        resumeScheduled: false,
        defaultEncoding: 'utf8',
        ranOut: false,
        awaitDrain: 0,
        readingMore: false,
        decoder: null,
        encoding: null },
     readable: true,
     domain: null,
     _events: 
      { end: [Object],
        finish: [Function: onSocketFinish],
        _socketEnd: [Function: onSocketEnd],
        drain: [Object],
        timeout: [Function],
        error: [Function: socketOnError],
        close: [Object],
        data: [Function: socketOnData],
        resume: [Function: onSocketResume],
        pause: [Function: onSocketPause] },
     _eventsCount: 10,
     _maxListeners: undefined,
     _writableState: 
      WritableState {
        objectMode: false,
        highWaterMark: 16384,
        needDrain: false,
        ending: false,
        ended: false,
        finished: false,
        decodeStrings: false,
        defaultEncoding: 'utf8',
        length: 0,
        writing: false,
        corked: 0,
        sync: true,
        bufferProcessing: false,
        onwrite: [Function],
        writecb: null,
        writelen: 0,
        bufferedRequest: null,
        lastBufferedRequest: null,
        pendingcb: 0,
        prefinished: false,
        errorEmitted: false,
        bufferedRequestCount: 0,
        corkedRequestsFree: [Object] },
     writable: true,
     allowHalfOpen: true,
     destroyed: false,
     bytesRead: 0,
     _bytesDispatched: 0,
     _sockname: null,
     _pendingData: null,
     _pendingEncoding: '',
     server: 
      Server {
        domain: null,
        _events: [Object],
        _eventsCount: 3,
        _maxListeners: undefined,
        _connections: 1,
        _handle: [Object],
        _usingSlaves: false,
        _slaves: [],
        _unref: false,
        allowHalfOpen: true,
        pauseOnConnect: false,
        httpAllowHalfOpen: false,
        timeout: 120000,
        _pendingResponseData: 0,
        _connectionKey: '4:127.0.0.1:3000' },
     _server: 
      Server {
        domain: null,
        _events: [Object],
        _eventsCount: 3,
        _maxListeners: undefined,
        _connections: 1,
        _handle: [Object],
        _usingSlaves: false,
        _slaves: [],
        _unref: false,
        allowHalfOpen: true,
        pauseOnConnect: false,
        httpAllowHalfOpen: false,
        timeout: 120000,
        _pendingResponseData: 0,
        _connectionKey: '4:127.0.0.1:3000' },
     _idleTimeout: 120000,
     _idleNext: 
      { [Function: utcDate]
        _onTimeout: [Function],
        _idleTimeout: 880,
        _idleNext: [Object],
        _idlePrev: [Circular],
        _idleStart: 1599 },
     _idlePrev: { _idleNext: [Circular], _idlePrev: [Object] },
     _idleStart: 1694,
     parser: 
      HTTPParser {
        '0': [Function: parserOnHeaders],
        '1': [Function: parserOnHeadersComplete],
        '2': [Function: parserOnBody],
        '3': [Function: parserOnMessageComplete],
        '4': [Function: onParserExecute],
        _headers: [],
        _url: '',
        _consumed: true,
        socket: [Circular],
        incoming: [Circular],
        outgoing: null,
        maxHeaderPairs: 2000,
        onIncoming: [Function: parserOnIncoming] },
     on: [Function: socketOnWrap],
     _paused: false,
     read: [Function],
     _consuming: true,
     _httpMessage: 
      ServerResponse {
        domain: null,
        _events: [Object],
        _eventsCount: 1,
        _maxListeners: undefined,
        output: [],
        outputEncodings: [],
        outputCallbacks: [],
        outputSize: 0,
        writable: true,
        _last: false,
        chunkedEncoding: false,
        shouldKeepAlive: false,
        useChunkedEncodingByDefault: true,
        sendDate: true,
        _removedHeader: {},
        _contentLength: null,
        _hasBody: true,
        _trailer: '',
        finished: false,
        _headerSent: false,
        socket: [Circular],
        connection: [Circular],
        _header: null,
        _headers: null,
        _headerNames: {},
        _onPendingData: [Function: updateOutgoingData] } },
  connection: 
   Socket {
     _connecting: false,
     _hadError: false,
     _handle: 
      TCP {
        _externalStream: {},
        fd: 54,
        reading: true,
        owner: [Circular],
        onread: [Function: onread],
        onconnection: null,
        writeQueueSize: 0 },
     _parent: null,
     _host: null,
     _readableState: 
      ReadableState {
        objectMode: false,
        highWaterMark: 16384,
        buffer: [],
        length: 0,
        pipes: null,
        pipesCount: 0,
        flowing: true,
        ended: false,
        endEmitted: false,
        reading: true,
        sync: false,
        needReadable: true,
        emittedReadable: false,
        readableListening: false,
        resumeScheduled: false,
        defaultEncoding: 'utf8',
        ranOut: false,
        awaitDrain: 0,
        readingMore: false,
        decoder: null,
        encoding: null },
     readable: true,
     domain: null,
     _events: 
      { end: [Object],
        finish: [Function: onSocketFinish],
        _socketEnd: [Function: onSocketEnd],
        drain: [Object],
        timeout: [Function],
        error: [Function: socketOnError],
        close: [Object],
        data: [Function: socketOnData],
        resume: [Function: onSocketResume],
        pause: [Function: onSocketPause] },
     _eventsCount: 10,
     _maxListeners: undefined,
     _writableState: 
      WritableState {
        objectMode: false,
        highWaterMark: 16384,
        needDrain: false,
        ending: false,
        ended: false,
        finished: false,
        decodeStrings: false,
        defaultEncoding: 'utf8',
        length: 0,
        writing: false,
        corked: 0,
        sync: true,
        bufferProcessing: false,
        onwrite: [Function],
        writecb: null,
        writelen: 0,
        bufferedRequest: null,
        lastBufferedRequest: null,
        pendingcb: 0,
        prefinished: false,
        errorEmitted: false,
        bufferedRequestCount: 0,
        corkedRequestsFree: [Object] },
     writable: true,
     allowHalfOpen: true,
     destroyed: false,
     bytesRead: 0,
     _bytesDispatched: 0,
     _sockname: null,
     _pendingData: null,
     _pendingEncoding: '',
     server: 
      Server {
        domain: null,
        _events: [Object],
        _eventsCount: 3,
        _maxListeners: undefined,
        _connections: 1,
        _handle: [Object],
        _usingSlaves: false,
        _slaves: [],
        _unref: false,
        allowHalfOpen: true,
        pauseOnConnect: false,
        httpAllowHalfOpen: false,
        timeout: 120000,
        _pendingResponseData: 0,
        _connectionKey: '4:127.0.0.1:3000' },
     _server: 
      Server {
        domain: null,
        _events: [Object],
        _eventsCount: 3,
        _maxListeners: undefined,
        _connections: 1,
        _handle: [Object],
        _usingSlaves: false,
        _slaves: [],
        _unref: false,
        allowHalfOpen: true,
        pauseOnConnect: false,
        httpAllowHalfOpen: false,
        timeout: 120000,
        _pendingResponseData: 0,
        _connectionKey: '4:127.0.0.1:3000' },
     _idleTimeout: 120000,
     _idleNext: 
      { [Function: utcDate]
        _onTimeout: [Function],
        _idleTimeout: 880,
        _idleNext: [Object],
        _idlePrev: [Circular],
        _idleStart: 1599 },
     _idlePrev: { _idleNext: [Circular], _idlePrev: [Object] },
     _idleStart: 1694,
     parser: 
      HTTPParser {
        '0': [Function: parserOnHeaders],
        '1': [Function: parserOnHeadersComplete],
        '2': [Function: parserOnBody],
        '3': [Function: parserOnMessageComplete],
        '4': [Function: onParserExecute],
        _headers: [],
        _url: '',
        _consumed: true,
        socket: [Circular],
        incoming: [Circular],
        outgoing: null,
        maxHeaderPairs: 2000,
        onIncoming: [Function: parserOnIncoming] },
     on: [Function: socketOnWrap],
     _paused: false,
     read: [Function],
     _consuming: true,
     _httpMessage: 
      ServerResponse {
        domain: null,
        _events: [Object],
        _eventsCount: 1,
        _maxListeners: undefined,
        output: [],
        outputEncodings: [],
        outputCallbacks: [],
        outputSize: 0,
        writable: true,
        _last: false,
        chunkedEncoding: false,
        shouldKeepAlive: false,
        useChunkedEncodingByDefault: true,
        sendDate: true,
        _removedHeader: {},
        _contentLength: null,
        _hasBody: true,
        _trailer: '',
        finished: false,
        _headerSent: false,
        socket: [Circular],
        connection: [Circular],
        _header: null,
        _headers: null,
        _headerNames: {},
        _onPendingData: [Function: updateOutgoingData] } },
  httpVersionMajor: 1,
  httpVersionMinor: 1,
  httpVersion: '1.1',
  complete: false,
  headers: { host: '127.0.0.1:3000', connection: 'close' },
  rawHeaders: [ 'host', '127.0.0.1:3000', 'Connection', 'close' ],
  trailers: {},
  rawTrailers: [],
  upgrade: false,
  url: '/arglebargle',
  method: 'GET',
  statusCode: null,
  statusMessage: null,
  client: 
   Socket {
     _connecting: false,
     _hadError: false,
     _handle: 
      TCP {
        _externalStream: {},
        fd: 54,
        reading: true,
        owner: [Circular],
        onread: [Function: onread],
        onconnection: null,
        writeQueueSize: 0 },
     _parent: null,
     _host: null,
     _readableState: 
      ReadableState {
        objectMode: false,
        highWaterMark: 16384,
        buffer: [],
        length: 0,
        pipes: null,
        pipesCount: 0,
        flowing: true,
        ended: false,
        endEmitted: false,
        reading: true,
        sync: false,
        needReadable: true,
        emittedReadable: false,
        readableListening: false,
        resumeScheduled: false,
        defaultEncoding: 'utf8',
        ranOut: false,
        awaitDrain: 0,
        readingMore: false,
        decoder: null,
        encoding: null },
     readable: true,
     domain: null,
     _events: 
      { end: [Object],
        finish: [Function: onSocketFinish],
        _socketEnd: [Function: onSocketEnd],
        drain: [Object],
        timeout: [Function],
        error: [Function: socketOnError],
        close: [Object],
        data: [Function: socketOnData],
        resume: [Function: onSocketResume],
        pause: [Function: onSocketPause] },
     _eventsCount: 10,
     _maxListeners: undefined,
     _writableState: 
      WritableState {
        objectMode: false,
        highWaterMark: 16384,
        needDrain: false,
        ending: false,
        ended: false,
        finished: false,
        decodeStrings: false,
        defaultEncoding: 'utf8',
        length: 0,
        writing: false,
        corked: 0,
        sync: true,
        bufferProcessing: false,
        onwrite: [Function],
        writecb: null,
        writelen: 0,
        bufferedRequest: null,
        lastBufferedRequest: null,
        pendingcb: 0,
        prefinished: false,
        errorEmitted: false,
        bufferedRequestCount: 0,
        corkedRequestsFree: [Object] },
     writable: true,
     allowHalfOpen: true,
     destroyed: false,
     bytesRead: 0,
     _bytesDispatched: 0,
     _sockname: null,
     _pendingData: null,
     _pendingEncoding: '',
     server: 
      Server {
        domain: null,
        _events: [Object],
        _eventsCount: 3,
        _maxListeners: undefined,
        _connections: 1,
        _handle: [Object],
        _usingSlaves: false,
        _slaves: [],
        _unref: false,
        allowHalfOpen: true,
        pauseOnConnect: false,
        httpAllowHalfOpen: false,
        timeout: 120000,
        _pendingResponseData: 0,
        _connectionKey: '4:127.0.0.1:3000' },
     _server: 
      Server {
        domain: null,
        _events: [Object],
        _eventsCount: 3,
        _maxListeners: undefined,
        _connections: 1,
        _handle: [Object],
        _usingSlaves: false,
        _slaves: [],
        _unref: false,
        allowHalfOpen: true,
        pauseOnConnect: false,
        httpAllowHalfOpen: false,
        timeout: 120000,
        _pendingResponseData: 0,
        _connectionKey: '4:127.0.0.1:3000' },
     _idleTimeout: 120000,
     _idleNext: 
      { [Function: utcDate]
        _onTimeout: [Function],
        _idleTimeout: 880,
        _idleNext: [Object],
        _idlePrev: [Circular],
        _idleStart: 1599 },
     _idlePrev: { _idleNext: [Circular], _idlePrev: [Object] },
     _idleStart: 1694,
     parser: 
      HTTPParser {
        '0': [Function: parserOnHeaders],
        '1': [Function: parserOnHeadersComplete],
        '2': [Function: parserOnBody],
        '3': [Function: parserOnMessageComplete],
        '4': [Function: onParserExecute],
        _headers: [],
        _url: '',
        _consumed: true,
        socket: [Circular],
        incoming: [Circular],
        outgoing: null,
        maxHeaderPairs: 2000,
        onIncoming: [Function: parserOnIncoming] },
     on: [Function: socketOnWrap],
     _paused: false,
     read: [Function],
     _consuming: true,
     _httpMessage: 
      ServerResponse {
        domain: null,
        _events: [Object],
        _eventsCount: 1,
        _maxListeners: undefined,
        output: [],
        outputEncodings: [],
        outputCallbacks: [],
        outputSize: 0,
        writable: true,
        _last: false,
        chunkedEncoding: false,
        shouldKeepAlive: false,
        useChunkedEncodingByDefault: true,
        sendDate: true,
        _removedHeader: {},
        _contentLength: null,
        _hasBody: true,
        _trailer: '',
        finished: false,
        _headerSent: false,
        socket: [Circular],
        connection: [Circular],
        _header: null,
        _headers: null,
        _headerNames: {},
        _onPendingData: [Function: updateOutgoingData] } },
  _consuming: false,
  _dumped: false }
*/