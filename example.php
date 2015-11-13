<?php

/**
 * JS parameters transmission
 * 
 * Dependencies: ParmOpts and ParmTran classes
 * 
 * Usage sample's back-end
 * 
 * @package ParmTran
 * @author Vallo Reima
 * @copyright (C)2015
 */
error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', true);
ini_set('log_errors', false);

date_default_timezone_set(@date_default_timezone_get()); // define if not defined

$a = explode(' ', $_SERVER['SERVER_SOFTWARE']);
$def = array(/* default options */
    'server' => array_shift($a), // take 1st word
    'timezone' => date_default_timezone_get(),
    'browser' => '...',
    'offset' => '',
    'btn' => ''
);
$bts = array(// button names and titles
    'p' => array('POST', 'Send the client details via POST method'),
    'a' => array('AJAX', 'Use AJAX to send/receive the client details'),
    'g' => array('GET', 'Get to the beginning via GET method')
);
$sts = array(// status prompts
    'opn' => 'Use either POST or AJAX to request',
    'rqa' => 'Try AJAX this time',
    'rqp' => 'Try POST this time',
    'rsp' => 'The POST response',
    'rsa' => 'The AJAX response',
);
require('ParmOpts.php'); // load the class
$obj = new ParmOpts(); // receive request data
$opt = $obj->Opts($def);  // update defaults with the request values
$ajx = $obj->Get('jsn');  // ajax call flag

if ($opt['offset'] == '') { // startup/get
  if ($opt['btn'] == 'p') {// buton was pressed
    $s = 'rqa';
  } else if ($opt['btn'] == 'a') {
    $s = 'rqp';
  } else {
    $s = 'opn';
  }
  $prm = array('brw' => 'browser', 'tzo' => 'offset', // JS parameters to transmit: token -> field id 
      'sts' => $sts[$s], 'pmt' => 'prompt');  // status text and prompt field id
} else { // post/ajax 
  $a = explode(' ', $opt['browser']);
  $opt['browser'] = array_pop($a); // take last word of the string
  $opt['offset'] = 'UTC ' . Offset($opt['offset']); // response data
  if ($ajx) {// ajax 
    $opt['btn'] = 'a';  // buton pressed
    $opt['sts'] = $sts['rsa'];
  } else {// post
    $prm = array('btn' => 'p', 'sts' => $sts['rsp'], 'pmt' => 'prompt');
  }
}

/**
 * compose time offset string
 * @param int $mns -- offset in minutes
 * @return string hh:mm
 */
function Offset($mns) {
  $n = ABS($mns);
  $h = floor($n / 60);
  $m = $n % 60;
  $c = $mns > 0 ? '-' : '+';
  $c .= str_pad($h, 2, '0', STR_PAD_LEFT) . ':' . str_pad($m, 2, '0', STR_PAD_LEFT);
  return $c;
}

if ($ajx) { // ajax json
  header("Content-Type: text/json; charset=utf-8");
  header('Cache-Control: no-cache');
  echo json_encode(array('status' => true, 'string' => '', 'factor' => $opt));  // json response
} else {  // html
  $fld = array(// data to display
      'server' => 'Server software',
      'timezone' => 'Server timezone',
      'browser' => 'Client software',
      'offset' => 'Client time offset'
  );
  $action = basename(__FILE__); // form action
  $transit = urlencode(json_encode($prm));  // transmit format
  include(pathinfo(__FILE__, PATHINFO_FILENAME) . '.phtml'); // display
}
