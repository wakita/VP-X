// Chrome API のスキーマを定義した JSON に手をいれたドキュメントシステムです．
// どう便利かは，以下を開いて！
//
// http://gyazo.com/f47c3f6cce44fe6c74a959668df3e783.png
//
// Slightly modified from
//   Chromium/src/third_party/WebKit/Source/WebCore/inspector/Inspector.json
//   which is also available from
//
// http://trac.webkit.org/browser/trunk/Source/WebCore/inspector/Inspector.json

var inspector_schema = [
{
  "domain": "Inspector",
  "types": [],
  "commands": [
  ],
  "events": [
  {
    "name": "frontendReused"
  },
  {
    "name": "bringToFront"
  },
  {
    "name": "disconnectFromBackend"
  },
  {
    "name": "reset"
  },
  {
    "name": "showPanel",
    "parameters": [
    { "name": "panel", "type": "string" }
    ]
  },
  {
    "name": "startUserInitiatedDebugging"
  },
  {
    "name": "evaluateForTestInFrontend",
    "parameters": [
    { "name": "testCallId", "type": "integer" },
    { "name": "script", "type": "string" }
    ]
  },
  {
    "name": "inspect",
    "parameters": [
    { "name": "object", "$ref": "Runtime.RemoteObject" },
    { "name": "hints", "type": "object" }
    ]
  },
  {
    "name": "didCreateWorker",
    "parameters": [
    { "name": "id", "type": "integer" },
    { "name": "url", "type": "string" },
    { "name": "isShared", "type": "boolean" }
    ]
  },
  {
    "name": "didDestroyWorker",
    "parameters": [
    { "name": "id", "type": "integer" }
    ]
  }
  ]
},
{
  "domain": "Page",
  "description": "Actions and events related to the inspected page belong to the page domain.",
  "types": [
  {
    "id": "ResourceType",
    "type": "string",
    "enum": ["Document", "Stylesheet", "Image", "Font", "Script", "XHR", "WebSocket", "Other"],
    "description": "Resource type as it was perceived by the rendering engine."
  },
  {
    "id": "Frame",
    "type": "object",
    "description": "Information about the Frame on the page.",
    "properties": [
    { "name": "id", "type": "string", "description": "Frame unique identifier." },
    { "name": "parentId", "type": "string", "optional": true, "description": "Parent frame identifier." },
    { "name": "loaderId", "type": "string", "description": "Identifier of the loader associated with this frame." },
    { "name": "name", "type": "string", "optional": true, "description": "Frame's name as specified in the tag." },
    { "name": "url", "type": "string", "description": "Frame document's URL." }
    ]
  },
  {
    "id": "FrameResourceTree",
    "type": "object",
    "description": "Information about the Frame hierarchy along with their cached resources.",
    "properties": [
    { "name": "frame", "$ref": "Frame", "description": "Frame information for this tree item." },
    { "name": "childFrames", "type": "array", "optional": true, "items": { "$ref": "FrameResourceTree" }, "description": "Child frames." },
    { "name": "resources", "type": "array",
      "items": {
        "type": "object",
        "properties": [
        { "name": "url", "type": "string", "description": "Resource URL." },
        { "name": "type", "$ref": "ResourceType", "description": "Type of this resource." }
        ]
      },
      "description": "Information about frame resources."
    }
    ]
  },
  {
    "id": "SearchResult",
    "type": "object",
    "description": "Search result for resource.",
    "properties": [
    { "name": "url", "type": "string", "description": "Resource URL." },
    { "name": "frameId", "type": "string", "description": "Resource frame id." },
    { "name": "matchesCount", "type": "number", "description": "Number of matches in the resource content." }
    ]
  }
  ],
  "commands": [
  {
    "name": "addScriptToEvaluateOnLoad",
    "parameters": [
    { "name": "scriptSource", "type": "string" }
    ]
  },
  {
    "name": "removeAllScriptsToEvaluateOnLoad"
  },
  {
    "name": "reload",
    "parameters": [
    { "name": "ignoreCache", "type": "boolean", "optional": true }
    ],
    "description": "Reloads given page optionally ignoring the cache."
  },
  {
    "name": "open",
    "parameters": [
    { "name": "url", "type": "string", "description": "URL to open." },
    { "name": "newWindow", "optional": true, "type": "boolean", "description": "If True, opens given URL in a new window or tab." }
    ],
    "description": "Opens given URL either in the inspected page or in a new tab / window."
  },
  {
    "name": "getCookies",
    "returns": [
    { "name": "cookies", "type": "array", "items": { "$ref": "Cookie"}, "description": "Array of cookie objects." },
    { "name": "cookiesString", "type": "string", "description": "document.cookie string representation of the cookies." }
    ],
    "description": "Returns all browser cookies. Depending on the backend support, will either return detailed cookie information in the <code>cookie</code> field or string cookie representation using <code>cookieString</code>."
  },
  {
    "name": "deleteCookie",
    "parameters": [
    { "name": "cookieName", "type": "string", "description": "Name of the cookie to remove." },
    { "name": "domain", "type": "string", "description": "Domain of the cookie to remove." }
    ],
    "description": "Deletes browser cookie with given name for the given domain."
  },
  {
    "name": "getResourceTree",
    "description": "Returns present frame / resource tree structure.",
    "returns": [
    { "name": "frameTree", "$ref": "FrameResourceTree", "description": "Present frame / resource tree structure." }
    ]
  },
  {
    "name": "getResourceContent",
    "description": "Returns content of the given resource.",
    "parameters": [
    { "name": "frameId", "type": "string", "description": "Frame id to get resource for." },
    { "name": "url", "type": "string", "description": "URL of the resource to get content for." },
    { "name": "base64Encode", "type": "boolean", "optional": true, "description": "Requests that resource content is served as base64." }
    ],
    "returns": [
    { "name": "content", "type": "string", "description": "Resource content." }
    ]
  },
  {
    "name": "searchInResources",
    "description": "Searches for given string in frame / resource tree structure.",
    "parameters": [
    { "name": "text", "type": "string", "description": "String to search for."  },
    { "name": "caseSensitive", "type": "boolean", "optional": true, "description": "If true, search is case sensitive." },
  { "name": "isRegex", "type": "boolean", "optional": true, "description": "If true, treats string parameter as regex." }
  ],
  "returns": [
  { "name": "result", "type": "array", "items": { "$ref": "SearchResult" }, "description": "List of search results." }
  ]
}
],
"events": [
{
  "name": "domContentEventFired",
  "parameters": [
  { "name": "timestamp", "type": "number" }
  ]
},
{
  "name": "loadEventFired",
  "parameters": [
  { "name": "timestamp", "type": "number" }
  ]
},
{
  "name": "frameNavigated",
  "description": "Fired once navigation of the frame has completed. Frame is now associated with the new loader.",
  "parameters": [
  { "name": "frame", "$ref": "Frame", "description": "Frame object." },
  { "name": "loaderId", "type": "string", "description": "Loader identifier." }
  ]
},
{
  "name": "frameDetached",
  "description": "Fired when frame has been detached from its parent.",
  "parameters": [
  { "name": "frameId", "type": "string", "description": "Id of the frame that has been detached." }
  ]
}
]
    },
    {
      "domain": "Runtime",
      "description": "Runtime domain exposes JavaScript runtime by means of remote evaluation and mirror objects. Evaluation results are returned as mirror object that expose type, string representation and unique identifier that can be used for further object interaction. Original objects are maintained in memory unless they are either explicitly released or are released along with the other objects in their object group.",
      "types": [
      {
        "id": "RemoteObject",
        "type": "object",
        "description": "Mirror object referencing original JavaScript object.",
        "properties": [
        { "name": "description", "type": "string", "description": "String representation of the object." },
        { "name": "hasChildren", "type": "boolean", "optional": true, "description": "True when this object can be queried for children." },
        { "name": "objectId", "type": "string", "optional": true, "description": "Unique object identifier (for non-primitive values)." },
        { "name": "type", "type": "string", "enum": ["object", "array", "function", "null", "node", "undefined", "string", "number", "boolean", "regexp", "date"], "description": "Object type." },
        { "name": "className", "type": "string", "optional": true, "description": "Object class name." }
        ]
      },
      {
        "id": "RemoteProperty",
        "type": "object",
        "description": "Mirror object property.",
        "properties": [
        { "name": "name", "type": "string", "description": "Property name." },
        { "name": "value", "$ref": "RemoteObject", "description": "Property value." },
        { "name": "wasThrown", "type": "boolean", "optional": true, "description": "True if exception was thrown on attempt to get the property value, in that case the value propery will contain thrown value." },
        { "name": "isGetter", "type": "boolean", "optional": true, "description": "True if this property is getter." }
        ]
      }
      ],
      "commands": [
      {
        "name": "evaluate",
        "parameters": [
        { "name": "expression", "type": "string", "description": "Expression to evaluate." },
        { "name": "objectGroup", "type": "string", "optional": true, "description": "Symbolic group name that can be used to release multiple objects." },
        { "name": "includeCommandLineAPI", "type": "boolean", "optional": true, "description": "Determines whether Command Line API should be available during the evaluation." }
        ],
        "returns": [
        { "name": "result", "$ref": "RemoteObject", "description": "Evaluation result." },
        { "name": "wasThrown", "type": "boolean", "optional": true, "description": "True iff the result was thrown during the evaluation." }
        ],
        "description": "Evaluate expression on global object."
      },
      {
        "name": "evaluateOn",
        "parameters": [
        { "name": "objectId", "type": "string", "description": "Identifier of the object to evaluate expression on." },
        { "name": "expression", "type": "string", "description": "Expression to evaluate." }
        ],
        "returns": [
        { "name": "result", "$ref": "RemoteObject", "description": "Evaluation result." },
        { "name": "wasThrown", "type": "boolean", "optional": true, "description": "True iff the result was thrown during the evaluation." }
        ],
        "description": "Evaluate expression on given object using it as <code>this</code>."
      },
      {
        "name": "getProperties",
        "parameters": [
        { "name": "objectId", "type": "string", "description": "Identifier of the object to return properties for." },
        { "name": "ignoreHasOwnProperty", "type": "boolean", "description": "If true, returns properties belonging to any element of the prototype chain." }
        ],
        "returns": [
        { "name": "result", "type": "array", "items": { "$ref": "RemoteProperty"}, "description": "Object properties." }
        ],
        "description": "Returns properties of a given object."
      },
      {
        "name": "setPropertyValue",
        "parameters": [
        { "name": "objectId", "type": "string", "description": "Identifier of the object to set property on." },
        { "name": "propertyName", "type": "string", "description": "Property name to set value for." },
        { "name": "expression", "type": "string", "description": "Expression to evaluate." }
        ],
        "description": "Makes property with given name equal to the expression evaluation result."
      },
      {
        "name": "releaseObject",
        "parameters": [
        { "name": "objectId", "type": "string", "description": "Identifier of the object to release." }
        ],
        "description": "Releases remote object with given id."
      },
      {
        "name": "releaseObjectGroup",
        "parameters": [
        { "name": "objectGroup", "type": "string", "description": "Symbolic object group name." }
        ],
        "description": "Releases all remote objects that belong to a given group."
      }
      ]
    },
    {
      "domain": "Console",
      "description": "Console domain defines methods and events for interaction with the JavaScript console. One needs to enable this domain using <code>enable</code> function in order to start receiving the console messages.",
      "types": [
      {
        "id": "ConsoleMessage",
        "type": "object",
        "description": "Console message.",
        "properties": [
        { "name": "source", "type": "string", "enum": ["html", "wml", "xml", "javascript", "css", "other"], "description": "Message source." },
        { "name": "type", "type": "string", "enum": ["log", "other", "trace", "startGroup", "startGroupCollapsed", "endGroup", "assert", "uncaughtException", "networkError", "result"], "description": "Message type." },
        { "name": "level", "type": "string", "enum": ["tip", "log", "warning", "error", "debug"], "description": "Message severity." },
        { "name": "line", "type": "integer", "description": "JavaScript source line that created console message." },
        { "name": "url", "type": "string", "description": "JavaScript source url that created console message." },
        { "name": "repeatCount", "type": "integer", "optional": true, "description": "Repeat count for repeated messages." },
        { "name": "text", "type": "string", "description": "Message text." },
        { "name": "networkIdentifier", "type": "integer", "optional": true, "description": "Identifier of the network request associated with the console message." },
        { "name": "parameters", "type": "array", "items": { "$ref": "Runtime.RemoteObject" }, "description": "Message parameters in case of the formatted message." },
        { "name": "stackTrace", "type": "array", "optional": true, "items": { "$ref": "CallFrame" }, "description": "Call frames for assert and error messages." }
        ]
      },
      {
        "id": "CallFrame",
        "type": "object",
        "description": "Stack entry for console errors and assertions.",
        "properties": [
        { "name": "functionName", "type": "string", "description": "JavaScript function name." },
        { "name": "url", "type": "string", "description": "JavaScript source name / url." },
        { "name": "lineNumber", "type": "string", "description": "JavaScript source line number." },
        { "name": "columnNumber", "type": "string", "description": "JavaScript source column number." }
        ]
      }
      ],
      "commands": [
      {
        "name": "enable",
        "returns": [
        { "name": "expiredMessagesCount", "type": "integer", "description": "Number of messages cleared due to message threashold overflow." }
        ],
        "description": "Enables console domain, sends all the messages collected so far to the client." 
      },
      {
        "name": "disable",
        "description": "Disables console domain, prevents further console messages from being sent to the client." 
      },
      {
        "name": "clearConsoleMessages",
        "description": "Clears collected console messages." 
      },
      {
        "name": "setMonitoringXHREnabled",
        "parameters": [
        { "name": "enabled", "type": "boolean", "description": "Monitoring enabled state." }
        ],
        "description": "Toggles monitoring of XMLHttpRequest. If <code>true</code>, console will receive messages upon each XHR issued." 
      },
      {
        "name": "addInspectedNode",
        "parameters": [
        { "name": "nodeId", "type": "integer", "description": "DOM node id to be accessible by means of $x command line API." }
        ],
        "description": "Enables console to refer to the node with given id via $x (see Command Line API for more details $x functions)." 
      }
      ],
      "events": [
      {
        "name": "messageAdded",
        "parameters": [
        { "name": "messageObj", "$ref": "ConsoleMessage", "description": "Console message that has been added." }
        ],
        "description": "Issued for each console message added."
      },
      {
        "name": "messageRepeatCountUpdated",
        "parameters": [
        { "name": "count", "type": "integer", "description": "New repeat count value." }
        ],
        "description": "In case of subsequent message being equal to the previous one, only repeat count is being updated."
      },
      {
        "name": "messagesCleared",
        "description": "Issued when console is cleared."
      }
      ]
    },
    {
      "domain": "Network",
      "description": "Network domain allows tracking network activities of the page. It exposes information about HTTP and WebSocket requests and responses, their headers, bodies, timing, etc. It also allows getting the tree of the Frames on the page along with information about their resources.",
      "types": [
      {
        "id": "ResourceTiming",
        "type": "object",
        "description": "Timing information for the request.",
        "properties": [
        { "name": "requestTime", "type": "number", "description": "Timing's requestTime is a baseline in seconds, while the other numbers are ticks in milliseconds relatively to this requestTime." },
        { "name": "proxyStart", "type": "number", "description": "Started resolving proxy." },
        { "name": "proxyEnd", "type": "number", "description": "Finished resolving proxy." },
        { "name": "dnsStart", "type": "number", "description": "Started DNS address resolve." },
        { "name": "dnsEnd", "type": "number", "description": "Finished DNS address resolve." },
        { "name": "connectStart", "type": "number", "description": "Started connecting to the remote host." },
        { "name": "connectEnd", "type": "number", "description": "Connected to the remote host." },
        { "name": "sslStart", "type": "number", "description": "Started SSL handshake." },
        { "name": "sslEnd", "type": "number", "description": "Finished SSL handshake." },
        { "name": "sendStart", "type": "number", "description": "Started sending request." },
        { "name": "sendEnd", "type": "number", "description": "Finished sending request." },
        { "name": "receiveHeadersEnd", "type": "number", "description": "Finished receiving response headers." }
        ]
      },
      {
        "id": "ResourceRequest",
        "type": "object",
        "description": "HTTP request data.",
        "properties": [
        { "name": "url", "type": "string", "description": "Request URL." },
        { "name": "method", "type": "string", "description": "HTTP request method." },
        { "name": "headers", "type": "object", "description": "HTTP request headers." },
        { "name": "postData", "type": "string", "optional": true, "description": "HTTP POST request data." }
        ]
      },
      {
        "id": "ResourceResponse",
        "type": "object",
        "description": "HTTP response data.",
        "properties": [
        { "name": "status", "type": "number", "description": "HTTP response status code." },
        { "name": "statusText", "type": "string", "description": "HTTP response status text." },
        { "name": "headers", "type": "object", "description": "HTTP response headers." },
        { "name": "headersText", "type": "string", "optional": true, "description": "HTTP response headers text." },
        { "name": "mimeType", "type": "string", "description": "Resource mimeType as determined by the browser." },
        { "name": "requestHeaders", "type": "object", "optional": true, "description": "Refined HTTP request headers that were actually transmitted over the network." },
        { "name": "requestHeadersText", "type": "string", "optional": true, "description": "HTTP request headers text." },
        { "name": "connectionReused", "type": "boolean", "description": "Specifies whether physical connection was actually reused for this request." },
        { "name": "connectionId", "type": "number", "description": "Physical connection id that was actually used for this request." },
        { "name": "fromDiskCache", "type": "boolean", "optional": true, "description": "Specifies that the resource was loaded from the disk cache." },
        { "name": "timing", "$ref": "ResourceTiming", "optional": true, "description": "Timing information for the given request." }
        ]
      },
      {
        "id": "CachedResource",
        "type": "object",
        "description": "Information about the cached resource.",
        "properties": [
        { "name": "url", "type": "string", "description": "Resource URL." },
        { "name": "type", "$ref": "Page.ResourceType", "description": "Type of this resource." },
        { "name": "response", "$ref": "ResourceResponse", "description": "Cached response data." },
        { "name": "bodySize", "type": "number", "description": "Cached response body size." }
        ]
      }
      ],
      "commands": [
      {
        "name": "enable",
        "description": "Enables network tracking, network events will now be delivered to the client."
      },
      {
        "name": "disable",
        "description": "Disables network tracking, prevents network events from being sent to the client."
      },
      {
        "name": "setUserAgentOverride",
        "description": "Allows overriding user agent with the given string.",
        "parameters": [
        { "name": "userAgent", "type": "string", "description": "User agent to use." }
        ]
      },
      {
        "name": "setExtraHeaders",
        "description": "Allows sending extra HTTP headers with the requests from this page.",
        "parameters": [
        { "name": "headers", "type": "object", "description": "Map with extra HTTP headers." }
        ]
      },
      {
        "name": "setBackgroundEventsCollectionEnabled",
        "description": "Toggles background network event collection.",
        "parameters": [
        { "name": "enabled", "type": "boolean", "description": "true - enable collection, false - disable" }
        ]
      },
      {
        "name": "isBackgroundEventsCollectionEnabled",
        "returns": [
        { "name": "enabled", "type": "boolean" }
        ]
      }
      ],
      "events": [
      {
        "name": "requestWillBeSent",
        "description": "Fired when page is about to send HTTP request.",
        "parameters": [
        { "name": "identifier", "type": "integer", "description": "Request identifier." },
        { "name": "frameId", "type": "string", "description": "Frame identifier." },
        { "name": "loaderId", "type": "string", "description": "Loader identifier." },
        { "name": "documentURL", "type": "string", "description": "URL of the document this resource is loaded for." },
        { "name": "request", "$ref": "ResourceRequest", "description": "Request data." },
        { "name": "timestamp", "type": "number", "description": "Timestamp." },
        { "name": "stackTrace", "type": "array", "items": { "$ref": "Console.CallFrame"}, "description": "JavaScript stack trace upon issuing this request." },
        { "name": "redirectResponse", "optional": true, "$ref": "ResourceResponse", "description": "Redirect response data." }
        ]
      },
      {
        "name": "resourceMarkedAsCached",
        "description": "Fired when request is known to be served from disk cache.",
        "parameters": [
        { "name": "identifier", "type": "integer", "description": "Request identifier." }
        ]
      },
      {
        "name": "responseReceived",
        "description": "Fired when HTTP response is available.",
        "parameters": [
        { "name": "identifier", "type": "integer", "description": "Request identifier." },
        { "name": "timestamp", "type": "number", "description": "Timestamp." },
        { "name": "type", "$ref": "Page.ResourceType", "description": "Resource type." },
        { "name": "response", "$ref": "ResourceResponse", "description": "Response data." }
        ]
      },
      {
        "name": "dataReceived",
        "description": "Fired when data chunk was received over the network.",
        "parameters": [
        { "name": "identifier", "type": "integer", "description": "Request identifier." },
        { "name": "timestamp", "type": "number", "description": "Timestamp." },
        { "name": "dataLength", "type": "integer", "description": "Data chunk length." },
        { "name": "encodedDataLength", "type": "integer", "description": "Actual bytes received (might be less than dataLength for compressed encodings)." }
        ]
      },
      {
        "name": "loadingFinished",
        "description": "Fired when HTTP request has finished loading.",
        "parameters": [
        { "name": "identifier", "type": "integer", "description": "Request identifier." },
        { "name": "timestamp", "type": "number", "description": "Timestamp." }
        ]
      },
      {
        "name": "loadingFailed",
        "description": "Fired when HTTP request has failed to load.",
        "parameters": [
        { "name": "identifier", "type": "integer", "description": "Request identifier." },
        { "name": "timestamp", "type": "number", "description": "Timestamp." },
        { "name": "errorText", "type": "string", "description": "User friendly error message." },
        { "name": "canceled", "type": "boolean", "optional": true, "description": "True if loading was canceled." }
        ]
      },
      {
        "name": "resourceLoadedFromMemoryCache",
        "description": "Fired when HTTP request has been served from memory cache.",
        "parameters": [
        { "name": "frameId", "type": "string", "description": "Frame identifier." },
        { "name": "loaderId", "type": "string", "description": "Loader identifier." },
        { "name": "documentURL", "type": "string", "description": "URL of the document this resource is loaded for." },
        { "name": "timestamp", "type": "number", "description": "Timestamp." },
        { "name": "resource", "$ref": "CachedResource", "description": "Cached resource data." }
        ]
      },
      {
        "name": "initialContentSet",
        "description": "Fired for XMLHttpRequests when their content becomes available.",
        "parameters": [
        { "name": "identifier", "type": "integer", "description": "Request identifier." },
        { "name": "content", "type": "string", "description": "Resource content." },
        { "name": "type", "$ref": "Page.ResourceType", "description": "Resource type." }
        ]
      },
      {
        "name": "webSocketWillSendHandshakeRequest",
        "description": "Fired when WebSocket is about to initiate handshake.",
        "parameters": [
        { "name": "identifier", "type": "integer", "description": "Request identifier." },
        { "name": "timestamp", "type": "number", "description": "Timestamp." },
        { "name": "request", "type": "object", "description": "WebSocket request data." }
        ]
      },
      {
        "name": "webSocketHandshakeResponseReceived",
        "description": "Fired when WebSocket handshake response becomes available.",
        "parameters": [
        { "name": "identifier", "type": "integer", "description": "Request identifier." },
        { "name": "timestamp", "type": "number", "description": "Timestamp." },
        { "name": "response", "type": "object", "description": "WebSocket response data." }
        ]
      },
      {
        "name": "webSocketCreated",
        "description": "Fired upon WebSocket creation.",
        "parameters": [
        { "name": "identifier", "type": "integer", "description": "Request identifier." },
        { "name": "url", "type": "string", "description": "WebSocket request URL." }
        ]
      },
      {
        "name": "webSocketClosed",
        "description": "Fired when WebSocket is closed.",
        "parameters": [
        { "name": "identifier", "type": "integer", "description": "Request identifier." },
        { "name": "timestamp", "type": "number", "description": "Timestamp." }
        ]
      }
      ]
    },
    {
      "domain": "Database",
      "types": [],
      "commands": [
      {
        "name": "enable",
        "description": "Enables database tracking, database events will now be delivered to the client."
      },
      {
        "name": "disable",
        "description": "Disables database tracking, prevents database events from being sent to the client."
      },
      {
        "name": "getDatabaseTableNames",
        "parameters": [
        { "name": "databaseId", "type": "integer" }
        ],
        "returns": [
        { "name": "tableNames", "type": "array", "items": { "type": "string" } }
        ]
      },
      {
        "name": "executeSQL",
        "parameters": [
        { "name": "databaseId", "type": "integer" },
        { "name": "query", "type": "string" }
        ],
        "returns": [
        { "name": "success", "type": "boolean" },
        { "name": "transactionId", "type": "integer" }
        ]
      }
      ],
      "events": [
      {
        "name": "addDatabase",
        "parameters": [
        { "name": "database", "$ref": "DatabaseDatabase" }
        ]
      },
      {
        "name": "sqlTransactionSucceeded",
        "parameters": [
        { "name": "transactionId", "type": "integer" },
        { "name": "columnNames", "type": "array", "items": { "type": "string" } },
        { "name": "values", "type": "array", "items": { "type": "string or number" }}
        ]
      },
      {
        "name": "sqlTransactionFailed",
        "parameters": [
        { "name": "transactionId", "type": "integer" },
        { "name": "sqlError", "$ref": "DatabaseError" }
        ]
      }
      ]
    },
    {
      "domain": "DOMStorage",
      "types": [],
      "commands": [
      {
        "name": "enable",
        "description": "Enables storage tracking, storage events will now be delivered to the client."
      },
      {
        "name": "disable",
        "description": "Disables storage tracking, prevents storage events from being sent to the client."
      },
      {
        "name": "getDOMStorageEntries",
        "parameters": [
        { "name": "storageId", "type": "integer" }
        ],
        "returns": [
        { "name": "entries", "type": "array", "items": { "$ref": "DOMStorageEntry"} }
        ]
      },
      {
        "name": "setDOMStorageItem",
        "parameters": [
        { "name": "storageId", "type": "integer" },
        { "name": "key", "type": "string" },
        { "name": "value", "type": "string" }
        ],
        "returns": [
        { "name": "success", "type": "boolean" }
        ]
      },
      {
        "name": "removeDOMStorageItem",
        "parameters": [
        { "name": "storageId", "type": "integer" },
        { "name": "key", "type": "string" }
        ],
        "returns": [
        { "name": "success", "type": "boolean" }
        ]
      }
      ],
      "events": [
      {
        "name": "addDOMStorage",
        "parameters": [
        { "name": "storage", "$ref": "DOMStorageStorage" }
        ]
      },
      {
        "name": "updateDOMStorage",
        "parameters": [
        { "name": "storageId", "type": "integer" }
        ]
      }
      ]
    },
    {
      "domain": "ApplicationCache",
      "types": [],
      "commands": [
      {
        "name": "getApplicationCaches",
        "returns": [
        { "name": "applicationCaches", "$ref": "AppCache" }
        ]
      }
      ],
      "events": [
      {
        "name": "updateApplicationCacheStatus",
        "parameters": [
        { "name": "status", "type": "integer" }
        ]
      },
      {
        "name": "updateNetworkState",
        "parameters": [
        { "name": "isNowOnline", "type": "boolean" }
        ]
      }
      ]
    },
    {
      "domain": "DOM",
      "description": "This domain exposes DOM read/write operations. Each DOM Node is represented with its mirror object that has an <code>id</code>. This <code>id</code> can be used to get additional information on the Node, convert it into the JavaScript object, etc. It is important that client receives DOM events only for the nodes that are known to the client. Backend keeps track of the nodes that were sent to the client and never sends the same node twice. It is client's responsibility to collect information about the nodes that were sent to the client.",
      "types": [
      {
        "id": "DOMNode",
        "type": "object",
        "properties": [
        { "name": "id", "type": "integer", "description": "Node identifier that is passed into the rest of the DOM messages as the <code>nodeId</code>. Backend will only push node with given <code>id</code> once. It is aware of all requested nodes and will only fire DOM events for nodes known to the client." },
        { "name": "nodeType", "type": "integer", "description": "<code>Node</code>'s nodeType." },
        { "name": "nodeName", "type": "string", "description": "<code>Node</code>'s nodeName." },
        { "name": "localName", "type": "string", "description": "<code>Node</code>'s localName." },
        { "name": "nodeValue", "type": "string", "description": "<code>Node</code>'s nodeValue." },
        { "name": "childNodeCount", "type": "integer", "optional": true, "description": "Child count for <code>Container</code> nodes." },
        { "name": "children", "type": "array", "optional": true, "items": { "$ref": "DOMNode" }, "description": "Child nodes of this node when requested with children." },
        { "name": "attributes", "type": "array", "optional": true, "items": { "type": "string" }, "description": "Attributes of the <code>Element</code> node in the form of flat array <code>[name1, value1, name2, value2]</code>." },
        { "name": "documentURL", "type": "string", "optional": true, "description": "Document URL that <code>Document</code> or <code>FrameOwner</code> node points to." },
        { "name": "publicId", "type": "string", "optional": true, "description": "<code>DocumentType</code>'s publicId. // FIXME" },
        { "name": "systemId", "type": "string", "optional": true, "description": "<code>DocumentType</code>'s systemId. // FIXME" },
        { "name": "internalSubset", "type": "string", "optional": true, "description": "<code>DocumentType</code>'s internalSubset. // FIXME" },
        { "name": "name", "type": "string", "optional": true, "description": "<code>Attr</code>'s name. // FIXME" },
        { "name": "value", "type": "string", "optional": true, "description": "<code>Attr</code>'s value. // FIXME" }
        ],
        "description": "DOM interaction is implemented in terms of mirror objects that represent the actual DOM nodes. DOMNode is a base node mirror type."
      },
      {
        "id": "DOMEventListener",
        "type": "object",
        "properties": [
        { "name": "type", "type": "string", "description": "<code>EventListener</code>'s type." },
        { "name": "useCapture", "type": "boolean", "description": "<code>EventListener</code>'s useCapture." },
        { "name": "isAttribute", "type": "boolean", "description": "<code>EventListener</code>'s isAttribute." },
        { "name": "nodeId", "type": "integer", "description": "Target <code>DOMNode</code> id." },
        { "name": "listenerBody", "type": "string", "description": "Listener function body." },
        { "name": "sourceName", "type": "string", "optional": true, "description": "Handler location source name." },
        { "name": "lineNumber", "type": "number", "optional": true, "description": "Handler location line number." }
        ],
        "description": "DOM interaction is implemented in terms of mirror objects that represent the actual DOM nodes. DOMNode is a base node mirror type."
      }
      ],
      "commands": [
      {
        "name": "getDocument",
        "returns": [
        { "name": "root", "$ref": "DOMNode", "description": "Resulting node." }
        ],
        "description": "Returns the root DOM node to the caller."
      },
      {
        "name": "getChildNodes",
        "parameters": [
        { "name": "nodeId", "type": "integer", "description": "Id of the node to get children for." }
        ],
        "description": "Requests that children of the node with given id are returned to the caller in form of <code>setChildNodes</code> events."
      },
      {
        "name": "querySelector",
        "parameters": [
        { "name": "nodeId", "type": "integer", "description": "Id of the node to query upon." },
        { "name": "selectors", "type": "string", "description": "Selector string." }
        ],
        "returns": [
        { "name": "nodeId", "type": "integer", "description": "Query selector result." }
        ],
        "description": "Executes <code>querySelector</code> on a given node. Setting <code>documentWide</code> to true starts selecting from the document node."
      },
      {
        "name": "querySelectorAll",
        "parameters": [
        { "name": "nodeId", "type": "integer", "description": "Id of the node to query upon." },
        { "name": "selectors", "type": "string", "description": "Selector string." }
        ],
        "returns": [
        { "name": "nodeIds", "type": "array", "items": { "type": "integer" }, "description": "Query selector result." }
        ],
        "description": "Executes <code>querySelectorAll</code> on a given node. Setting <code>documentWide</code> to true starts selecting from the document node."
      },
      {
        "name": "setNodeName",
        "parameters": [
        { "name": "nodeId", "type": "integer", "description": "Id of the node to set name for." },
        { "name": "name", "type": "string", "description": "New node's name." }
        ],
        "returns": [
        { "name": "outNodeId", "type": "integer", "description": "New node's id." }
        ],
        "description": "Sets node name for a node with given id."
      },
      {
        "name": "setNodeValue",
        "parameters": [
        { "name": "nodeId", "type": "integer", "description": "Id of the node to set value for." },
        { "name": "value", "type": "string", "description": "New node's value." }
        ],
        "description": "Sets node value for a node with given id."
      },
      {
        "name": "removeNode",
        "parameters": [
        { "name": "nodeId", "type": "integer", "description": "Id of the node to remove." }
        ],
        "description": "Removes node with given id."
      },
      {
        "name": "setAttribute",
        "parameters": [
        { "name": "nodeId", "type": "integer", "description": "Id of the element to set attribute for." },
        { "name": "name", "type": "string", "description": "Attribute name." },
        { "name": "value", "type": "string", "description": "Attribute value." }
        ],
        "description": "Sets attribute for an element with given id."
      },
      {
        "name": "removeAttribute",
        "parameters": [
        { "name": "nodeId", "type": "integer", "description": "Id of the element to remove attribute from." },
        { "name": "name", "type": "string", "description": "Name of the attribute to remove." }
        ],
        "description": "Removes attribute with given name from an element with given id."
      },
      {
        "name": "getEventListenersForNode",
        "parameters": [
        { "name": "nodeId", "type": "integer", "description": "Id of the node to get listeners for." }
        ],
        "returns": [
        { "name": "listeners", "type": "array", "items": { "$ref": "DOMEventListener"}, "description": "Array of relevant listeners." }
        ],
        "description": "Returns event listeners relevant to the node."
      },
      {
        "name": "copyNode",
        "parameters": [
        { "name": "nodeId", "type": "integer", "description": "Id of the node to copy." }
        ],
        "description": "Copies node's HTML markup into the clipboard."
      },
      {
        "name": "getOuterHTML",
        "parameters": [
        { "name": "nodeId", "type": "integer", "description": "Id of the node to get markup for." }
        ],
        "returns": [
        { "name": "outerHTML", "type": "string", "description": "Outer HTML markup." }
        ],
        "description": "Returns node's HTML markup."
      },
      {
        "name": "setOuterHTML",
        "parameters": [
        { "name": "nodeId", "type": "integer", "description": "Id of the node to set markup for." },
        { "name": "outerHTML", "type": "string", "description": "Outer HTML markup to set." }
        ],
        "returns": [
        { "name": "newNodeId", "type": "integer", "description": "Setting outer HTML can change node's id." }
        ],
        "description": "Sets node HTML markup, returns new node id."
      },
      {
        "name": "performSearch",
        "parameters": [
        { "name": "query", "type": "string", "description": "Plain text or query selector or XPath search query." },
        { "name": "runSynchronously", "type": "boolean", "optional": true, "description": "When set to true, performing search synchronously (can block user interaction)." }
        ],
        "description": "Starts asynchronous search for a given string in the DOM tree. Use <code>cancelSearch</code> to stop given asynchronous search task."
      },
      {
        "name": "cancelSearch",
        "description": "Cancels asynchronous search started with <code>performSearch</code>."
      },
      {
        "name": "pushNodeToFrontend",
        "parameters": [
        { "name": "objectId", "type": "string", "description": "JavaScript object id to convert into node." }
        ],
        "returns": [
        { "name": "nodeId", "type": "integer", "description": "Node id for given object." }
        ],
        "description": "Requests that the node is sent to the caller given the JavaScript node object reference."
      },
      {
        "name": "setInspectModeEnabled",
        "parameters": [
        { "name": "enabled", "type": "boolean", "description": "True to enable inspection mode, false to disable it." }
        ],
        "description": "Enters the 'inspect' mode. In this mode, elements that user is hovering over are highlighted. Backend then generates 'inspect' command upon element selection."
      },
      {
        "name": "highlightNode",
        "parameters": [
        { "name": "nodeId", "type": "integer", "description": "Identifier of the node to highlight" },
        { "name": "mode", "type": "string", "enum": ["all", "content", "padding", "border", "margin"], "optional": true, "description": "The box model component(s) to highlight (default: \"all\")." }
      ],
      "description": "Highlights DOM node with given id."
    },
    {
      "name": "hideNodeHighlight",
      "description": "Hides DOM node highlight."
    },
    {
      "name": "highlightFrame",
      "parameters": [
      { "name": "frameId", "type": "string", "description": "Identifier of the frame to highlight" }
      ],
      "description": "Highlights owner element of the frame with given id."
    },
    {
      "name": "hideFrameHighlight",
      "description": "Hides frame owner highlight."
    },
    {
      "name": "pushNodeByPathToFrontend",
      "parameters": [
      { "name": "path", "type": "string", "description": "Path to node in the proprietary format." }
      ],
      "returns": [
      { "name": "nodeId", "type": "integer", "description": "Id of the node for given path." }
      ],
      "description": "Requests that the node is sent to the caller given its path. // FIXME, use XPath"
    },
    {
      "name": "resolveNode",
      "parameters": [
      { "name": "nodeId", "type": "integer", "description": "Id of the node to resolve." }
      ],
      "returns": [
      { "name": "object", "$ref": "Runtime.RemoteObject", "description": "JavaScript object wrapper for given node." }
      ],
      "description": "Resolves JavaScript node object for given node id."
    }
    ],
    "events": [
    {
      "name": "documentUpdated",
      "description": "Fired when <code>Document</code> has been totally updated. Node ids are no longer valid."
    },
    {
      "name": "setChildNodes",
      "parameters": [
      { "name": "parentId", "type": "integer", "description": "Parent node id to populate with children." },
      { "name": "nodes", "type": "array", "items": { "$ref": "DOMNode"}, "description": "Child nodes array." }
      ],
      "description": "Fired when backend wants to provide client with the missing DOM structure. This happens upon most of the calls requesting node ids."
    },
    {
      "name": "attributesUpdated",
      "parameters": [
      { "name": "id", "type": "integer", "description": "Id of the node that has changed." },
      { "name": "attributes", "type": "array", "items": { "$ref": "DOMAttribute"}, "description": "New attributes value." }
      ],
      "description": "Fired when <code>Element</code>'s attributes are updated."
    },
    {
      "name": "characterDataModified",
      "parameters": [
      { "name": "id", "type": "integer", "description": "Id of the node that has changed." },
      { "name": "newValue", "type": "string", "description": "New text value." }
      ],
      "description": "Mirrors <code>DOMCharacterDataModified</code> event."
    },
    {
      "name": "childNodeCountUpdated",
      "parameters": [
      { "name": "id", "type": "integer", "description": "Id of the node that has changed." },
      { "name": "newValue", "type": "integer", "description": "New node count." }
      ],
      "description": "Fired when <code>Container</code>'s child node count has changed."
    },
    {
      "name": "childNodeInserted",
      "parameters": [
      { "name": "parentId", "type": "integer", "description": "Id of the node that has changed." },
      { "name": "prevId", "type": "integer", "description": "If of the previous siblint." },
      { "name": "node", "$ref": "DOMNode", "description": "Inserted node data." }
      ],
      "description": "Mirrors <code>DOMNodeInserted</code> event."
    },
    {
      "name": "childNodeRemoved",
      "parameters": [
      { "name": "parentId", "type": "integer", "description": "Parent id." },
      { "name": "id", "type": "integer", "description": "Id of the node that has been removed." }
      ],
      "description": "Mirrors <code>DOMNodeRemoved</code> event."
    },
    {
      "name": "searchResults",
      "parameters": [
      { "name": "nodeIds", "type": "array", "items": { "type": "integer" }, "description": "Ids of the search result nodes." }
      ],
      "description": "Pushes search results initiated using <code>performSearch</code> to the client."
    }
    ]
  },
  {
    "domain": "CSS",
    "description": "This domain exposes CSS read/write operations. All CSS objects, like stylesheets, rules, and styles, have an associated <code>id</code> used in subsequent operations on the related object. Each object type has a specific <code>id</code> structure, and those are not interchangeable between objects of different kinds. CSS objects can be loaded using the <code>get*ForNode()</code> calls (which accept a DOM node id). Alternatively, a client can discover all the existing stylesheets with the <code>getAllStyleSheets()</code> method and subsequently load the required stylesheet contents using the <code>getStyleSheet[Text]()</code> methods.",
    "types": [
    {
      "id": "CSSStyleId",
      "type": "object",
      "properties": [
      { "name": "styleSheetId", "type": "string", "description": "Enclosing stylesheet identifier." },
      { "name": "ordinal", "type": "integer", "description": "The style ordinal within the stylesheet." }
      ],
      "description": "This object identifies a CSS style in a unique way."
    },
    {
      "id": "CSSRuleId",
      "type": "object",
      "properties": [
      { "name": "styleSheetId", "type": "string", "description": "Enclosing stylesheet identifier." },
      { "name": "ordinal", "type": "integer", "description": "The rule ordinal within the stylesheet." }
      ],
      "description": "This object identifies a CSS rule in a unique way."
    },
    {
      "id": "CSSNodeStyles",
      "type": "object",
      "properties": [
      { "name": "inlineStyle", "$ref": "CSSStyle", "optional": true, "description": "The node's inline style, if any." },
      { "name": "computedStyle", "$ref": "CSSComputedStyle", "description": "The node's computed style." },
      { "name": "matchedCSSRules", "type": "array", "items": { "$ref": "CSSRule" }, "description": "CSS rules matching this node, from all applicable stylesheets." },
      { "name": "styleAttributes", "type": "array", "items": { "$ref": "CSSStyleAttribute" }, "description": "Entries for style-related element attributes (e.g. width=20)."},
      { "name": "pseudoElements", "type": "array", "items": { "$ref": "PseudoIdRules" }, "description": "Pseudo style rules for this node." },
      { "name": "inherited", "type": "array", "items": { "$ref": "InheritedStyleEntry" }, "description": "A chain of inherited styles (from the immediate node parent up to the DOM tree root)." }
      ],
      "description": "A holder for all CSS styles applicable to a particular DOM node."
    },
    {
      "id": "PseudoIdRules",
      "type": "object",
      "properties": [
      { "name": "pseudoId", "type": "integer", "description": "Pseudo style identifier (see <code>enum PseudoId</code> in <code>RenderStyleConstants.h</code>)."},
      { "name": "rules", "type": "array", "items": { "$ref": "CSSRule" }, "description": "CSS rules applicable to the pseudo style."}
      ],
      "description": "CSS rule collection for a single pseudo style."
    },
    {
      "id": "InheritedStyleEntry",
      "type": "object",
      "properties": [
      { "name": "inlineStyle", "$ref": "CSSStyle", "optional": true, "description": "The ancestor node's inline style, if any, in the style inheritance chain." },
      { "name": "matchedCSSRules", "type": "array", "items": { "$ref": "CSSRule" }, "description": "CSS rules matching the ancestor node in the style inheritance chain." }
      ],
      "description": "CSS rule collection for a single pseudo style."
    },
    {
      "id": "CSSStyleAttribute",
      "type": "object",
      "properties": [
      { "name": "name", "type": "string", "description": "DOM attribute name (e.g. \"width\")."},
      { "name": "style", "$ref": "CSSStyle", "description": "CSS style generated by the respective DOM attribute."}
      ],
      "description": "CSS style information for a DOM style attribute."
    },
    {
      "id": "CSSStyleSheetHeader",
      "type": "object",
      "properties": [
      { "name": "styleSheetId", "type": "string", "description": "The stylesheet identifier."},
      { "name": "sourceURL", "type": "string", "description": "Stylesheet resource URL."},
      { "name": "title", "type": "string", "description": "Stylesheet title."},
      { "name": "disabled", "type": "boolean", "description": "Denotes whether the stylesheet is disabled."}
      ],
      "description": "CSS stylesheet metainformation."
    },
    {
      "id": "CSSStyleSheetBody",
      "type": "object",
      "properties": [
      { "name": "styleSheetId", "type": "string", "description": "The stylesheet identifier."},
      { "name": "rules", "type": "array", "items": { "$ref": "CSSRule" }, "description": "Stylesheet resource URL."},
      { "name": "text", "type": "string", "optional": true, "description": "Stylesheet resource contents (if available)."}
      ],
      "description": "CSS stylesheet contents."
    },
    {
      "id": "CSSRule",
      "type": "object",
      "properties": [
      { "name": "ruleId", "$ref": "CSSRuleId", "description": "The CSS rule identifier."},
      { "name": "selectorText", "type": "string", "description": "Rule selector."},
      { "name": "sourceURL", "type": "string", "optional": true, "description": "Parent stylesheet resource URL (for regular rules)."},
      { "name": "sourceLine", "type": "integer", "description": "Line ordinal of the rule selector start character in the resource."},
      { "name": "origin", "type": "string", "enum": ["user", "user-agent", "inspector", ""], "description": "The parent stylesheet type: \"user\" for user stylesheets, \"user-agent\" for user-agent stylesheets, \"inspector\" for stylesheets created by the inspector (i.e. those holding new rules created with <code>addRule()</code>), \"\" for regular stylesheets."},
      { "name": "style", "$ref": "CSSStyle", "description": "Associated style declaration." },
      { "name": "selectorRange", "$ref": "SourceRange", "optional": true, "description": "The rule selector range in the underlying resource (if available)." }
      ],
      "description": "CSS rule representation."
    },
    {
      "id": "SourceRange",
      "type": "object",
      "properties": [
      { "name": "start", "type": "integer", "description": "Start of range (inclusive)."},
      { "name": "end", "type": "integer", "description": "End of range (exclusive)."}
      ],
      "description": "Text range within a resource."
    },
    {
      "id": "CSSStyle",
      "type": "object",
      "properties": [
      { "name": "styleId", "$ref": "CSSStyleId", "description": "The CSS style identifier."},
      { "name": "cssProperties", "type": "array", "items": { "$ref": "CSSProperty" }, "description": "CSS properties in the style."},
      { "name": "shorthandEntries", "type": "array", "items": { "$ref": "ShorthandEntry" }, "description": "Computed values for all shorthands found in the style." },
      { "name": "cssText", "type": "string", "optional": true, "description": "Style declaration text (if available)."},
      { "name": "range", "$ref": "SourceRange", "optional": true, "description": "Style declaration range in the enclosing stylesheet (if available)." },
      { "name": "width", "type": "integer", "description": "The effective \"width\" property value from this style." },
      { "name": "height", "type": "integer", "description": "The effective \"height\" property value from this style." }
      ],
      "description": "CSS style representation."
    },
    {
      "id": "CSSProperty",
      "type": "object",
      "properties": [
      { "name": "name", "type": "string", "description": "The property name." },
      { "name": "value", "type": "string", "description": "The property value." },
      { "name": "priority", "type": "string", "optional": true, "description": "The property priority (implies \"\" if absent)." },
      { "name": "implicit", "type": "boolean", "optional": true, "description": "Whether the property is implicit (implies <code>false</code> if absent)." },
      { "name": "parsedOk", "type": "boolean", "optional": true, "description": "Whether the property is understood by the browser (implies <code>true</code> if absent)." },
      { "name": "status", "type": "string", "enum": ["active", "inactive", "disabled", "style"], "optional": true, "description": "The property status: \"active\" (implied if absent) if the property is effective in the style, \"inactive\" if the property is overridden by a same-named property in this style later on, \"disabled\" if the property is disabled by the user, \"style\" if the property is reported by the browser rather than by the CSS source parser." },
      { "name": "shorthandName", "type": "string", "description": "The related shorthand property name (absent if this property is not a longhand)." },
      { "name": "range", "$ref": "SourceRange", "optional": true, "description": "The entire property range in the enclosing style declaration (if available)." }
      ],
      "description": "CSS style effective visual dimensions and source offsets."
    }
    ],
    "commands": [
    {
      "name": "getStylesForNode",
      "parameters": [
      { "name": "nodeId", "type": "integer" }
      ],
      "returns": [
      { "name": "styles", "$ref": "CSSNodeStyles", "description": "All styles for the specified DOM node." }
      ],
      "description": "Returns all styles for a DOM node identified by <code>nodeId</code>."
    },
    {
      "name": "getComputedStyleForNode",
      "parameters": [
      { "name": "nodeId", "type": "integer" }
      ],
      "returns": [
      { "name": "style", "$ref": "CSSStyle", "description": "Computed style for the specified DOM node." }
      ],
      "description": "Returns the computed style for a DOM node identified by <code>nodeId</code>."
    },
    {
      "name": "getInlineStyleForNode",
      "parameters": [
      { "name": "nodeId", "type": "integer" }
      ],
      "returns": [
      { "name": "style", "$ref": "CSSStyle", "description": "Inline style for the specified DOM node." }
      ],
      "description": "Returns the inline style (if present) for a DOM node identified by <code>nodeId</code>."
    },
    {
      "name": "getAllStyleSheets",
      "returns": [
      { "name": "headers", "type": "array", "items": { "$ref": "CSSStyleSheetHeader" }, "description": "Descriptor entries for all available stylesheets." }
      ],
      "description": "Returns metainfo entries for all known stylesheets."
    },
    {
      "name": "getStyleSheet",
      "parameters": [
      { "name": "styleSheetId", "type": "string" }
      ],
      "returns": [
      { "name": "styleSheet", "$ref": "CSSStyleSheetBody", "description": "Stylesheet contents for the specified <code>styleSheetId</code>." }
      ],
      "description": "Returns stylesheet data for the specified <code>styleSheetId</code>."
    },
    {
      "name": "getStyleSheetText",
      "parameters": [
      { "name": "styleSheetId", "type": "string" }
      ],
      "returns": [
      { "name": "text", "type": "string", "description": "The stylesheet text." }
      ],
      "description": "Returns the current textual content and the URL for a stylesheet."
    },
    {
      "name": "setStyleSheetText",
      "parameters": [
      { "name": "styleSheetId", "type": "string" },
      { "name": "text", "type": "string" }
      ],
      "description": "Sets the new stylesheet text, thereby invalidating all existing <code>CSSStyleId</code>'s and <code>CSSRuleId</code>'s contained by this stylesheet."
    },
    {
      "name": "setPropertyText",
      "parameters": [
      { "name": "styleId", "$ref": "CSSStyleId" },
      { "name": "propertyIndex", "type": "integer" },
      { "name": "text", "type": "string" },
      { "name": "overwrite", "type": "boolean" }
      ],
      "returns": [
      { "name": "style", "$ref": "CSSStyle", "description": "The resulting style after the property text modification." }
      ],
      "description": "Sets the new <code>text</code> for a property in the respective style, at offset <code>propertyIndex</code>. If <code>overwrite</code> is <code>true</code>, a property at the given offset is overwritten, otherwise inserted. <code>text</code> entirely replaces the property <code>name: value</code>."
    },
    {
      "name": "toggleProperty",
      "parameters": [
      { "name": "styleId", "$ref": "CSSStyleId" },
      { "name": "propertyIndex", "type": "integer" },
      { "name": "disable", "type": "boolean" }
      ],
      "returns": [
      { "name": "style", "$ref": "CSSStyle", "description": "The resulting style after the property toggling." }
      ],
      "description": "Toggles the property in the respective style, at offset <code>propertyIndex</code>. The <code>disable</code> parameter denotes whether the property should be disabled (i.e. removed from the style declaration). If <code>disable == false</code>, the property gets put back into its original place in the style declaration."
    },
    {
      "name": "setRuleSelector",
      "parameters": [
      { "name": "ruleId", "$ref": "CSSRuleId" },
      { "name": "selector", "type": "string" }
      ],
      "returns": [
      { "name": "rule", "$ref": "CSSRule", "description": "The resulting rule after the selector modification." }
      ],
      "description": "Modifies the rule selector."
    },
    {
      "name": "addRule",
      "parameters": [
      { "name": "contextNodeId", "type": "integer" },
      { "name": "selector", "type": "string" }
      ],
      "returns": [
      { "name": "rule", "$ref": "CSSRule", "description": "The newly created rule." }
      ],
      "description": "Creates a new empty rule with the given <code>selector</code> in a special \"inspector\" stylesheet in the owner document of the context node."
    },
    {
      "name": "getSupportedCSSProperties",
      "returns": [
      { "name": "cssProperties", "type": "array", "items": { "type": "string" }, "description": "Supported property names." }
      ],
      "description": "Returns all supported CSS property names."
    }
    ]
  },
  {
    "domain": "Timeline",
    "description": "Timeline provides its clients with instrumentation records that are generated during the page runtime. Timeline instrumentation can be started and stopped using corresponding commands. While timeline is started, it is generating timeline event records.",
    "types": [
    {
      "id": "TimelineRecord",
      "type": "object",
      "properties": [
      { "name": "type", "type": "string", "description": "Event type." },
      { "name": "data", "type": "object", "description": "Event data." },
      { "name": "children", "type": "array", "optional": true, "items": { "$ref": "TimelineRecord" }, "description": "Nested records." }
      ],
      "description": "Timeline record contains information about the recorded activity."
    }
    ],
    "commands": [
    {
      "name": "start",
      "description": "Starts capturing instrumentation events."
    },
    {
      "name": "stop",
      "description": "Stops capturing instrumentation events."
    }
    ],
    "events": [
    {
      "name": "started",
      "description": "Fired when timeline has been started."
    },
    {
      "name": "stopped",
      "description": "Fired when timeline has been stopped."
    },
    {
      "name": "eventRecorded",
      "parameters": [
      { "name": "record", "$ref": "TimelineRecord", "description": "Timeline record data." }
      ],
      "description": "Fired for every instrumentation event while timeline is started."
    }
    ]
  },
  {
    "domain": "Debugger",
    "description": "Debugger domain exposes JavaScript debugging functions. It allows setting and removing breakpoints, stepping through execution, exploring stack traces, etc.",
    "types": [
    {
      "id": "Location",
      "type": "object",
      "properties": [
      { "name": "sourceId", "type": "string", "description": "Script identifier as reported by the <code>scriptParsed</code>" },
      { "name": "lineNumber", "type": "integer", "description": "Line number in the script." },
      { "name": "columnNumber", "type": "integer", "optional": true, "description": "Column number in the script." }
      ],
      "description": "Location in the source code."
    },
    {
      "id": "CallFrame",
      "type": "object",
      "properties": [
      { "name": "id", "type": "string", "description": "Call frame identifier." },
      { "name": "functionName", "type": "string", "description": "Name of the function called on this frame." },
      { "name": "location", "$ref": "Location", "description": "Location in the source code." },
      { "name": "scopeChain", "type": "array", "items": { "$ref": "Scope" }, "description": "Scope chain for given call frame." },
      { "name": "this", "$ref": "Runtime.RemoteObject", "description": "<code>this</code> object for this call frame." }
      ],
      "description": "Debugger call frame. Array of call frames form call stack."
    },
    {
      "id": "Scope",
      "type": "object",
      "properties": [
      { "name": "type", "type": "string", "enum": ["global", "local", "with", "closure", "catch"], "description": "Scope type." },
      { "name": "object", "$ref": "Runtime.RemoteObject", "description": "Object representing the scope." }
      ],
      "description": "Debugger call frame. Array of call frames form call stack."
    }
    ],
    "commands": [
    {
      "name": "enable",
      "description": "Enables debugger for given page."
    },
    {
      "name": "disable",
      "description": "Disables debugger for given page."
    },
    {
      "name": "setBreakpointsActive",
      "parameters": [
      { "name": "active", "type": "boolean", "description": "New value for breakpoints active state." }
      ],
      "description": "Activates / deactivates all breakpoints on the page."
    },
    {
      "name": "setBreakpointByUrl",
      "parameters": [
      { "name": "url", "type": "string", "description": "URL of the resource to set breakpoint on." },
      { "name": "lineNumber", "type": "integer", "description": "Line number to set breakpoint at." },
      { "name": "columnNumber", "type": "integer", "optional": true, "description": "Offset in the line to set breakpoint at." },
      { "name": "condition", "type": "string", "optional": true, "description": "Expression to use as a breakpoint condition. When specified, debugger will only stop on the breakpoint if this expression evaluates to true." }
      ],
      "returns": [
      { "name": "breakpointId", "type": "string", "description": "Id of the created breakpoint for further manipulations." },
      { "name": "locations", "optional": true, "type": "array", "items": { "$ref": "Location"}, "description": "List of the locations this breakpoint resolved into." }
      ],
      "description": "Sets JavaScript breakpoint at a given location specified by URL. This breakpoint will survive page reload."
    },
    {
      "name": "setBreakpoint",
      "parameters": [
      { "name": "location", "$ref": "Location", "description": "Location to set breakpoint in." },
      { "name": "condition", "type": "string", "optional": true, "description": "Expression to use as a breakpoint condition. When specified, debugger will only stop on the breakpoint if this expression evaluates to true." }
      ],
      "returns": [
      { "name": "breakpointId", "type": "string", "description": "Id of the created breakpoint for further manipulations." },
      { "name": "actualLocation", "$ref": "Location", "description": "Location this breakpoint resolved into." }
      ],
      "description": "Sets JavaScript breakpoint at a given location."
    },
    {
      "name": "removeBreakpoint",
      "parameters": [
      { "name": "breakpointId", "type": "string" }
      ],
      "description": "Removes JavaScript breakpoint."
    },
    {
      "name": "continueToLocation",
      "parameters": [
      { "name": "location", "$ref": "Location", "description": "Location to continue to." }
      ],
      "description": "Continues execution until specific location is reached."
    },
    {
      "name": "stepOver",
      "description": "Steps over the statement."
    },
    {
      "name": "stepInto",
      "description": "Steps into the statement."
    },
    {
      "name": "stepOut",
      "description": "Steps out of the function."
    },
    {
      "name": "pause",
      "description": "Stops on the next JavaScript statement."
    },
    {
      "name": "resume",
      "description": "Resumes JavaScript execution."
    },
    {
      "name": "editScriptSource",
      "parameters": [
      { "name": "sourceId", "type": "string", "description": "Id of the script to edit." },
      { "name": "scriptSource", "type": "string", "description": "New content of the script." }
      ],
      "returns": [
      { "name": "callFrames", "type": "array", "optional": true, "items": { "$ref": "CallFrame"}, "description": "New stack trace in case editing has happened while VM was stopped." }
      ],
      "description": "Edits JavaScript script live."
    },
    {
      "name": "getScriptSource",
      "parameters": [
      { "name": "sourceId", "type": "string", "description": "Id of the script to get source for." }
      ],
      "returns": [
      { "name": "scriptSource", "type": "string", "description": "Script source." }
      ],
      "description": "Returns source for the script with given ID."
    },
    {
      "name": "setPauseOnExceptions",
      "parameters": [
      { "name": "state", "type": "string", "enum": ["none", "uncaught", "all"], "description": "Pause on exceptions mode." }
      ],
      "description": "Defines pause on exceptions state. Can be set to stop on all exceptions, uncaught exceptions or no exceptions."
    },
    {
      "name": "evaluateOnCallFrame",
      "parameters": [
      { "name": "callFrameId", "type": "string", "description": "Call frame identifier to evaluate on. This identifier is a part of backtrace reported by the <code>pausedScript</code>." },
      { "name": "expression", "type": "string", "description": "Expression to evaluate." },
      { "name": "objectGroup", "type": "string", "optional": true, "description": "String object group name to put result into (allows rapid releasing resulting object handles using <code>releaseObjectGroup</code>)." },
      { "name": "includeCommandLineAPI", "type": "boolean", "optional": true, "description": "Specifies whether command line API should be available to the evaluated expression, defaults to false." }
      ],
      "returns": [
      { "name": "result", "$ref": "Runtime.RemoteObject", "description": "Object wrapper for the evaluation result." },
      { "name": "wasThrown", "type": "boolean", "optional": true, "description": "True iff the result was thrown during the evaluation." }
      ],
      "description": "Evaluates expression on a given call frame."
    }
    ],
    "events": [
    {
      "name": "debuggerWasEnabled",
      "description": "Fired when debugger gets enabled (deprecated)."
    },
    {
      "name": "debuggerWasDisabled",
      "description": "Fired when debugger gets disabled (deprecated)."
    },
    {
      "name": "scriptParsed",
      "parameters": [
      { "name": "sourceId", "type": "string", "description": "Identifier of the script parsed." },
      { "name": "url", "type": "string", "description": "URL of the script parsed (if any)." },
      { "name": "startLine", "type": "integer", "description": "Line offset of the script within the resource with given URL (for script tags)." },
      { "name": "startColumn", "type": "integer", "description": "Column offset of the script within the resource with given URL." },
      { "name": "endLine", "type": "integer", "description": "Last line of the script." },
      { "name": "endColumn", "type": "integer", "description": "Length of the last line of the script." },
      { "name": "isContentScript", "type": "boolean", "optional": true, "description": "Determines whether this script is a user extension script." }
      ],
      "description": "Fired when virtual machine parses script. This even is also fired for all known scripts upon enabling debugger."
    },
    {
      "name": "scriptFailedToParse",
      "parameters": [
      { "name": "url", "type": "string", "description": "URL of the script that failed to parse." },
      { "name": "data", "type": "string", "description": "Source text of the script that failed to parse." },
      { "name": "firstLine", "type": "integer", "description": "Line offset of the script within the resource." },
      { "name": "errorLine", "type": "integer", "description": "Line with error." },
      { "name": "errorMessage", "type": "string", "description": "Parse error message." }
      ],
      "description": "Fired when virtual machine fails to parse the script."
    },
    {
      "name": "breakpointResolved",
      "parameters": [
      { "name": "breakpointId", "type": "string", "description": "Breakpoint unique identifier." },
      { "name": "location", "$ref": "Location", "description": "Actual breakpoint location." }
      ],
      "description": "Fired when breakpoint is resolved to an actual script and location."
    },
    {
      "name": "paused",
      "parameters": [
      { 
        "name": "details",
        "type": "object",
        "properties": [
        { "name": "callFrames", "type": "array", "items": { "$ref": "CallFrame" }, "description": "Call stack the virtual machine stopped on." },
        { "name": "exception", "$ref": "Runtime.RemoteObject", "optional": true, "description": "Current exception object if script execution is paused when an exception is being thrown." }
        ],
        "description": "Call stack information."
      }
      ],
      "description": "Fired when the virtual machine stopped on breakpoint or exception or any other stop criteria."
    },
    {
      "name": "resumed",
      "description": "Fired when the virtual machine resumed execution."
    }
    ]
  },
  {
    "domain": "DOMDebugger",
    "description": "DOM debugging allows setting breakpoints on particular DOM operations and events. JavaScript execution will stop on these operations as if there was a regular breakpoint set.",
    "commands": [
    {
      "name": "setDOMBreakpoint",
      "parameters": [
      { "name": "nodeId", "type": "integer", "description": "Identifier of the node to set breakpoint on." },
      { "name": "type", "type": "integer", "description": "Type of the operation to stop upon." }
      ],
      "description": "Sets breakpoint on particular operation with DOM. "
    },
    {
      "name": "removeDOMBreakpoint",
      "parameters": [
      { "name": "nodeId", "type": "integer", "description": "Identifier of the node to remove breakpoint from." },
      { "name": "type", "type": "integer", "description": "Type of the breakpoint to remove." }
      ],
      "description": "Removes DOM breakpoint that was set using <code>setDOMBreakpoint</code>."
    },
    {
      "name": "setEventListenerBreakpoint",
      "parameters": [
      { "name": "eventName", "type": "string", "description": "Event name to stop on (any DOM event will do)." }
      ],
      "description": "Sets breakpoint on particular DOM event."
    },
    {
      "name": "removeEventListenerBreakpoint",
      "parameters": [
      { "name": "eventName", "type": "string", "description": "Event name." }
      ],
      "description": "Removes breakpoint on particular DOM event."
    },
    {
      "name": "setXHRBreakpoint",
      "parameters": [
      { "name": "url", "type": "string", "description": "Resource URL substring. All XHRs having this substring in the URL will get stopped upon." }
      ],
      "description": "Sets breakpoint on XMLHttpRequest."
    },
    {
      "name": "removeXHRBreakpoint",
      "parameters": [
      { "name": "url", "type": "string", "description": "Resource URL substring." }
      ],
      "description": "Removes breakpoint from XMLHttpRequest."
    }
    ]
  },
  {
    "domain": "Profiler",
    "types": [],
    "commands": [
    {
      "name": "enable"
    },
    {
      "name": "disable"
    },
    {
      "name": "isEnabled",
      "returns": [
      { "name": "state", "type": "boolean" }
      ]
    },
    {
      "name": "start"
    },
    {
      "name": "stop"
    },
    {
      "name": "getProfileHeaders",
      "returns": [
      { "name": "headers", "type": "array", "items": { "$ref": "ProfileHeader"} }
      ]
    },
    {
      "name": "getProfile",
      "parameters": [
      { "name": "type", "type": "string" },
      { "name": "uid", "type": "integer" }
      ],
      "returns": [
      { "name": "profile", "$ref": "Profile" }
      ]
    },
    {
      "name": "removeProfile",
      "parameters": [
      { "name": "type", "type": "string" },
      { "name": "uid", "type": "integer" }
      ]
    },
    {
      "name": "clearProfiles"
    },
    {
      "name": "takeHeapSnapshot",
      "parameters": [
      { "name": "detailed", "type": "boolean" }
      ]
    },
    {
      "name": "collectGarbage"
    }
    ],
    "events": [
    {
      "name": "profilerWasEnabled"
    },
    {
      "name": "profilerWasDisabled"
    },
    {
      "name": "addProfileHeader",
      "parameters": [
      { "name": "header", "$ref": "ProfileHeader" }
      ]
    },
    {
      "name": "addHeapSnapshotChunk",
      "parameters": [
      { "name": "uid", "type": "integer" },
      { "name": "chunk", "type": "string" }
      ]
    },
    {
      "name": "finishHeapSnapshot",
      "parameters": [
      { "name": "uid", "type": "integer" }
      ]
    },
    {
      "name": "setRecordingProfile",
      "parameters": [
      { "name": "isProfiling", "type": "boolean" }
      ]
    },
    {
      "name": "resetProfiles"
    },
    {
      "name": "reportHeapSnapshotProgress",
      "parameters": [
      { "name": "done", "type": "integer" },
      { "name": "total", "type": "integer" }
      ]
    }
    ]
  },
  {
    "domain": "Worker",
    "types": [],
    "commands": [
    {
      "name": "sendMessageToWorker",
      "parameters": [
      { "name": "workerId", "type": "integer" },
      { "name": "message", "type": "object" }
      ]
    },
    {
      "name": "connectToWorker",
      "parameters": [
      { "name": "workerId", "type": "integer" }
      ]
    },
    {
      "name": "disconnectFromWorker",
      "parameters": [
      { "name": "workerId", "type": "integer" }
      ]
    },
    {
      "name": "setAutoconnectToWorkers",
      "parameters": [
      { "name": "value", "type": "boolean" }
      ]
    }

    ],
    "events": [
    {
      "name": "workerCreated",
      "parameters": [
      { "name": "workerId", "type": "integer" },
      { "name": "url", "type": "string" },
      { "name": "inspectorConnected", "type": "boolean" }
      ]
    },
    {
      "name": "workerTerminated",
      "parameters": [
      { "name": "workerId", "type": "integer" }
      ]
    },
    {
      "name": "dispatchMessageFromWorker",
      "parameters": [
      { "name": "workerId", "type": "integer" },
      { "name": "message", "type": "object" }
      ]
    }
    ]
  }
  ];

var inspector = {};
inspector_schema.forEach(function (schema) {
    // array -> object
    var a2o = function (a, id) {
      var o = {};
      a.forEach(function (x) { o[x[id]] = x; });
      return o;
    };

    if (schema.types) schema.types = a2o(schema.types, 'id');
    if (schema.events) schema.events = a2o(schema.events, 'name');

    if (schema.commands) {
      schema.commands.forEach(function (c) {
          if (c.parameters) c.parameters = a2o(c.parameters, 'name');
          if (c.returns) c.returns = a2o(c.returns, 'name');
        });
      schema.commands = a2o(schema.commands, 'name');
    }

    inspector[schema.domain] = schema;
  });
