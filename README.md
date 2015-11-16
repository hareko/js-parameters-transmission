# JS parameters transmission #

The communication between JavaScript client-side (hereinafter JS) and 
PHP server-side, for example, requires the two-way exchange of the parameters. 
You need to solve the following tasks to coordinate the activity on both sides:

- prepare the storage data server-side and accept them client-side;
- send/receive the request/response parameters;
- handle the storage and the parameters.

There are many different solutions for that and *ParmTran* JavaScript class is one of them.
This class supplies necessary front-end methods but assumes according support from the back-end.

## How it works ##

The back-end prepares and encodes the storage data, and places the data inside the *HTML* to be sent to the front-end.
JS accepts the data and saves it into the storage. The storage data is accessed by the Get/Set methods and used internally.

JS makes requests via GET/POST where AJAX request sends the *JSON* string in the request body.
The back-end detects the request format and saves the parameters.
The AJAX response is returned with the array in specific format (see below).

The *ParmTran* can be complemented with more methods and properties. So, it can be a template for your own framework.

## The usage ##

You can instantiate in the global scope making the functionality available overall:

**var ts = new ParmTran( [ id ] );**

**id** - the form id from where to read the storage data (default by *'transit'*):

The encoded data is located between the *form* tags. The data is decoded and saved, and the form content is cleared.
This form and its *action* attribute are used further to send the requests.

## Methods ##

**ts.Get( name );**

Read the data element from the storage.

- **name** - element name (property)

**ts.Set( name, value );**

Write the data element into the storage.

- **name** - element name (property)
- **value** - element (property) value

**ts.Enc( data [, flag = false ] );**

Convert the data to (encoded) json string

- **data** - input object, array, ...
- **flag** - bool (*true* - urlencode the output string)

**ts.Dec( data [, flag = false ] );**

Convert the (encoded) json string to the data object

- **data** - the string
- **flag** - bool (*true* - urldecode the string)

**ts.Send( parm [ , meth = 'post' ] );**

Send GET/POST request.

- **parm** - request parameters object
- **meth** - request method name (*get/post*)

**ts.Ajax( parm , func [ , meth = 'post' ] );**

Make AJAX request.

- **parm** - request parameters object
- **func** - callback function to receive the response
- **meth** - request method name (*put/post*)

## AJAX response ##

The callback specified in the **Ajax** method receives two arguments:

- **resp** - response object; back-end must return it in the following format:
    - **status** - bool (*true* - success, *false* - failed)
    - **prompt** - any prompt/error text or array of text lines
    - **factor** - action result data (format depends on the context)
- **parm** - request parameters object

## The example ##

The *example.php* processes the following requests:

1. startup - fills the demo table with the server-side data;
2. POST - receives the request data and fills the demo table with the client-side data;
3. AJAX -  receives the request data and returns the client-side data; the front-end fills the table;
4. GET - returns to (1) with the usage notice

The prompt text under the heading indicates the current status.
Examine the example files to follow the class' usage and the communication logic.
 
## The package ##

Upload the files to any web directory and run the *example.php*.
The following files are included:

- *ParmTran.js* - the parameters transmission class
- *example.php* - the sample's back-end
- *example.phtml* - the sample's template
- *example.js* - the sample's front-end
- *[ParmOpts.php]* - the class to handle parameters and options (used by example)
- *readme.md*


Please [contact] on any product-related questions.

[ParmOpts.php]: http://www.phpclasses.org/package/9457.html
[contact]: mailto://vallo@vregistry.com
