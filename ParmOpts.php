<?php

/*
 * Parameters and Options handler
 * 
 * Accept request/CLI parameters
 * Save options according to defaults
 * Supply saved parameters/options as array/object
 *
 * @package System
 * @author Vallo Reima
 * @copyright (C)2015
 */

class ParmOpts {

  private $rqt = array(); /* input parameters */
  private $opt = array(); /* option values */
  private $jsn = false;   /* json request flag */

  /**
   * accept the request or CLI parameters
   * @param string $pty request data priority:
   *                                    J - json
   *                                    P - post
   *                                    G - get
   */
  public function __construct($pty = 'JPG') {
    global $argc, $argv;
    if (empty($argc)) { // request parameters
      $jsn = @json_decode(file_get_contents('php://input'), true);  // check for json body
      if (is_array($jsn)) {
        $this->jsn = true;  // json request
      } else {
        $jsn = array(); // no json 
      }
      $this->Merge(array('J' => $jsn, 'P' => $_POST, 'G' => $_GET), strtoupper($pty));  // save
    } else {  // CLI arguments
      for ($i = 1; $i < $argc; $i++) {  // loop the arguments
        $arg = mb_split('=', $argv[$i]);  // split to key/value
        $this->rqt[$arg[0]] = $arg[1];  // save
      }
    }
  }

  /**
   * merge the request data according to priority
   * @param array $rqt
   * @param string $pty
   */
  private function Merge($rqt, $pty) {
    $seq = array_reverse(str_split($pty));  //processing sequence
    foreach ($seq as $r) {
      if (isset($rqt[$r])) {  //not skipped
        $this->rqt = array_merge($this->rqt, $rqt[$r]); // append/replace
      }
    }
  }

  /**
   * save option values, set type
   * @param array $opt defaults
   * @param array $rqt values -- null - take accepted ones
   * @return array Description
   */
  public function Opts($opt, $rqt = null) {
    if (is_null($rqt)) {
      $rqt = & $this->rqt;
    }
    foreach ($opt as $key => $val) {  // loop defaults
      if (array_key_exists($key, $rqt) && (!empty($rqt[$key]) || $this->Check($val))) {  // user's value or allowed empty
        $val = $rqt[$key];
        if (is_array($opt[$key])) {
          $val = (array) $val;  // array required
        } else if ($this->Check($opt[$key], true)) {
          settype($val, gettype($opt[$key])); // adjust type
        }
      }
      $this->opt[$key] = $val;  // save value
    }
    return $this->opt;
  }

  /**
   * check allowance
   * @param mixed $val -- option value
   * @param bool $flg -- check allowance of:
   *                        false - replace with empty value
   *                        true - adjust data type
   * @return bool
   */
  private function Check($val, $flg = false) {
    if ($flg) {
      $f = is_numeric($val) || is_string($val) || is_bool($val);  // set only these types
    } else {
      $f = empty($val) || is_bool($val) || is_array($val);  // replace only these empties
    }
    return $f;
  }

  /**
   * supply the values
   * @param string $prp property name (rqt/opt/jsn)
   * @param bool $flg -- true - dual mode
   * @return mixed
   */
  public function Get($prp = 'rqt', $flg = false) {
    if (!isset($this->$prp)) {
      $r = array();
    } else if ($flg && is_array($this->$prp)) {
      $r = new ArrayObject($this->$prp, ArrayObject::ARRAY_AS_PROPS); // object looking like array
    } else {
      $r = $this->$prp;
    }
    return $r;
  }

}
