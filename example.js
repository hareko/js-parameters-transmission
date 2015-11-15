/**
 * JS parameters transmission
 * 
 * Usage sample's front-end
 * 
 * @package ParmTran
 * @author Vallo Reima
 * @copyright (C)2015
 */

window.onload = function() {

  var ts = new ParmTran(); /* transmission object */

  /**
   * set storage and events
   */
  var Init = function() {
    var bts = document.getElementsByTagName('input');
    for (var i = 0; i < bts.length; i++) {
      AttachEventListener(bts[i], 'click', Send);
    }
    Status();
  };

  /**
   * perform action
   * @param {object} evt button click
   */
  var Send = function(evt) {
    var rlt;
    var trg = window.event ? evt.srcElement : evt.target;
    var btn = trg.value.toLowerCase();  // button name
    var prm = {};
    if (btn === 'get') {
      prm.btn = ts.Get('btn');  // inform about the request method used
    } else { // send data values
      prm[ts.Get('brw')] = navigator.userAgent; // save under speified id name
      prm[ts.Get('tzo')] = (new Date()).getTimezoneOffset();
    }
    if (btn === 'ajax') {
      rlt = ts.Ajax(prm, Receive);
    } else {
      rlt = ts.Send(prm, btn);  // button name is method name
    }
    if (typeof rlt === 'string') {  // unsuccessful
      Status(ts.Dec(rlt));  // decode the error info and show
    }
    return false; // don't propagate
  };

  /**
   * get ajax response
   * @param {object} rsp status,prompt,factor
   * @param {object} prm request parameters
   */
  var Receive = function(rsp, prm) {
    if (rsp.status) {
      for (var id in prm) {   // display requested values
        var o = document.getElementById(id);
        o.innerHTML = rsp.factor[id];
        o.parentNode.className = '';
      }
      document.getElementById('ajax').className = 'hide'; // switch the buttons
      document.getElementById('done').className = 'button';
      ts.Set('btn', rsp.factor.btn);  // save clicked button token
      ts.Set('sts', rsp.factor.sts);  // save status text
      Status();
    } else {
      Status([rsp.prompt, rsp.factor]);  // bad response
    }
  };

  /**
   * show (error) status
   * @param {mixed} err -- array - error
   */
  var Status = function(err) {
    var txt;
    var pmt = document.getElementById(ts.Get('pmt')); // message area
    if (err) {
      txt = err;
      pmt.className = 'error'; // indicate error
    } else {
      txt = [ts.Get('sts')];  // current status
      pmt.className = '';
    }
    pmt.innerHTML = txt[0];
    if (txt.length > 1) {
      alert(txt.join("\n"));
    }
  };

  /**
   * cross-browser event handler
   * @param {object} target element
   * @param {string} eventType - click, ...
   * @param {func} functionRef - handler
   * @param {bool} capture -- false - bubble (default)
   *                          true - propagation
   */
  var AttachEventListener = function(target, eventType, functionRef, capture) {
    if (typeof capture === 'undefined') {
      capture = false;
    }
    if (target.addEventListener) {
      target.addEventListener(eventType, functionRef, capture);
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventType, functionRef);
    } else {
      target['on' + eventType] = functionRef;
    }
  };

  Init();
};

