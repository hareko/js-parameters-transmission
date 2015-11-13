# JS parameters transmission #

The communication between JavaScript client-side (hereinafter JS) and 
PHP server-side, for example, requires the two-way exchange of the parameters. 
You need to solve the following tasks to coordinate the activity on both sides:

- prepare the storage data server-side and accept them client-side;
- send/receive the request/response parameters;
- handle the storage and request/response parameters.

There are many different solutions for that and *ParmTran* JavaScript class is one of them.
It supplies the necessary methods but assumes according support from the back-end.

## How it works ##

The back-end prepares and encodes the storage data, and places the data inside the *HTML* to be sent to JS.
JS accepts the data and saves it into the storage. The storage data is accessed by the Get/Set methods and used internally.

JS makes requests via GET/POST where the AJAX sends the *JSON* string in the request body.
The back-end detects the request format and saves its parameters according to the sources priority.
The AJAX response is returned with the jsoned array of the fixed format.

Examine the included example for the details.

## Instantiation ##

**ts = new ParmTrans( [ id ] );**

**id** - the form id from where to read the storage data (default by *'transit'*):

The encoded data is located between the *form* tags. The data is decoded and saved, and the form content is cleared.
This form (with its *action* attribute) is used further to send the requests.

## Methods ##

**ts.Get( name );**

Read the data element from the storage.

- **name** - element name (property)

**ts.Set( name, value );**

Write the data element into the storage.

- **name** - element name (property)
- **value** - element (property) value

**ts.Dec( data, flag );**

Convert the (encoded) json string to the object

- **data** - the string
- **flag** - bool (*true* - urldecode the string, default by *false*)

**ts.Request( prm, mth );**

Send GET/POST request.

- **prm** - request parameters object
- **mth** - request method (*get/post*, default by *'post'*)

**ts.Ajax( prm, mth );**

Make AJAX POST request.

- **prm** - request parameters object
- **mth** - callback method for the response

## AJAX response ##

The callback specified in the **Ajax** method receives two arguments:

- **rsp** - response object; back-end must return it in the following format:
    - **status** - bool (*true* - success, *false* - failed)
    - **prompt** - any prompt/error text or array of text lines
    - **factor** - result data returned by the back-end (format depends on context)
- **prm** - request parameters

## The example ##

The *example.php* processes the following requests:

1) startup - fills the demo table with the server-side data;
2) POST - receives the request data and fills the demo table with the client-side data;
3) AJAX -  receives the request data and returns the client-side data; the front-end fills the table;
4) GET - returns to (1) with the usage notice

The prompt text under the heading indicates the current status.
Examine the example files to follow the class' usage and the communication logic.
 
## The package ##

Upload the files to any web directory and run the *example.php*.
The following files are included:

- *ParmTrans.js* - the parameters transmission class
- *example.php* - the sample's back-end
- *example.phtml* - the sample's template
- *example.js* - the sample's front-end
- *[ParmOpts.php]* - the class to handle parameters and options (used by example)
- *readme.md*


Please [contact] on any product-related questions.

[ParmOpts.php]: http://www.phpclasses.org/package/9457.html
[contact]: mailto://vallo@vregistry.com
