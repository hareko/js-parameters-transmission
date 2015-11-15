/**
 * JS parameters transmission class
 *
 * @package ParmTran
 * @author Vallo Reima
 * @copyright (C)2015
 */

/**
 * @param {mixed} id transit source id
 */
function ParmTran(id) {

  var transit = {/* data storage */
    nosnd: "Can't send data",
    noxhr: "Can't access server"
  };
  var form = null;  /* request form object */
  var busy = false; /* send busy status */
  var that = this;

  /**
   * save transit data
   */
  var Init = function() {
    var d;
    if (typeof id !== 'string') {
      id = 'transit';
    }
    form = document.getElementById(id);
    if (form) {
      d = that.Dec(form.innerHTML, true); // decode transit data
      form.innerHTML = '';
      if (form.tagName.toLowerCase() !== 'form' || !form.action) {
        form = null;  // unsuitable form
      }
    } else {
      d = {};
    }
    for (var i in d) {
      transit[i] = d[i];
    }
  };

  /**
   * get saved value
   * @param {string} name
   * @return {mixed} 
   */
  that.Get = function(name) {
    if (typeof transit[name] === 'undefined') {
      return null;
    } else {
      return transit[name];
    }
  };

  /**
   * save value
   * @param {string} name
   * @param {mixed} value
   * @return {mixed} 
   */
  that.Set = function(name, value) {
    transit[name] = value;
    return value;
  };

  /**
   * make GET/POST request
   * @param {object} parm parameters
   * @param {string} meth method (post/get)
   * @return {mixed} string -- error
   */
  that.Send = function(parm, meth) {
    if (busy) {
      return; // just sending 
    }else if (form) {
      form.method = meth === 'get' ? 'get' : 'post';
      for (var a in parm) {  // form fields to send
        var obj = document.createElement('input');
        obj.type = 'hidden';
        obj.name = a;
        obj.value = parm[a];
        form.appendChild(obj);
      }
      form.submit();
    } else {// no useable form (you can create dynamically)
      return transit.nosnd;
    }
  };
  /**
   * read data thru XHR
   * @param {object} parm parameters
   * @param {function} func callback
   * @return {mixed}
   */
  that.Ajax = function(parm, func) {
    if (busy) {
      return; // just sending 
    } else {
      busy = true;
    }
    var xhr = GetHTTPObject();
    if (!xhr || !form) {
      return transit.nosnd; // unuseable object(s)
    }
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var f = true;
        if (xhr.status === 200) { // received
          var rlt = that.Dec(xhr.responseText); // json string to object
          if (typeof rlt.status === 'undefined') {  // unknown respone
            f = form.action;
          }
        } else {  // unsuccessful
          f = xhr.statusText + " (" + xhr.status + ")";
        }
        if (typeof f === 'string'){
            rlt = {status: false, prompt: transit.noxhr, factor: f};  // error info
        }
        busy = false; // unlock
        func(rlt, parm);  // return to sender
      }
    };
    xhr.open('POST', form.action, true);  // async
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(parm));  // send json string in request body
  };

  /**
   * @return {mixed} -- object -  Ajax compatible
   *                    string - error
   */
  var GetHTTPObject = function() {
    var obj = false;//set to false, so if it fails, do nothing
    if (window.XMLHttpRequest) {//detect to see if browser allows this method
      obj = new XMLHttpRequest();//set var the new request
    } else if (window.ActiveXObject) {//detect to see if browser allows this method
      try {
        obj = new ActiveXObject("Msxml2.XMLHTTP");//try this method first
      } catch (e) {//if it fails move onto the next
        try {
          obj = new ActiveXObject("Microsoft.XMLHTTP");//try this method next
        } catch (e) {//if that also fails return false.
          obj = e.description;
        }
      }
    }
    return obj;
  };

  /**
   *  convert data from transit format
   *  @param {string} data
   *  @param {bool} flag -- true - urlencode
   * @return {object} 
   */
  that.Dec = function(data, flag) {
    var a;
    var d = data;
    try {
      if (flag === true) {
        d = urldecode(d); // decode PHP urlencoded
      }
      a = JSON.parse(d);  // string to array
    } catch (e) { // bad format
      a = {};
    }
    return a;
  };

  /**
   *  decode the string
   *  @author http://kevin.vanzonneveld.net
   *  
   *  @param {string} str
   *  @return {string}
   */
  var urldecode = function(str) {
    var histogram = {};
    var ret = str.toString();

    var replacer = function(search, replace, str) {
      var tmp_arr = [];
      tmp_arr = str.split(search);
      return tmp_arr.join(replace);
    };

    // The histogram is identical to the one in urlencode.
    histogram["'"] = '%27';
    histogram['('] = '%28';
    histogram[')'] = '%29';
    histogram['*'] = '%2A';
    histogram['~'] = '%7E';
    histogram['!'] = '%21';
    histogram['%20'] = '+';

    for (var replace in histogram) {
      var search = histogram[replace]; // Switch order when decoding
      ret = replacer(search, replace, ret); // Custom replace. No regexing
    }

    ret = decodeURIComponent(ret);

    return ret;
  };

  Init();
}
