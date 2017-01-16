<?php 

$PagePath=htmlentities(strip_tags($_GET["PagePath"]));
$OEVersion=htmlentities(strip_tags($_GET["OEVersion"]));

$RelativePath=htmlentities(strip_tags($_GET["RelativePath"])); 
// DD I've returned it (was commented), otherwise it fails when calling page is in subdirectory,
// and Notice was generated in {or (strpos($RelativePath, ':') !== false)}, so depending on hosting server failed also

session_start(); // DD important to do before everything else, in case register_globals=on which resets variables with same name as session vars etc. on session_start

$IdElem=htmlentities(strip_tags($_GET["IdElem"]));
$Cfg = htmlentities(strip_tags($_GET["Cfg"]));


// basic anti-hack check:
if (strlen($OEVersion) > 10) die('Wrong version string');
if (strlen($IdElem) > 20) die('Wrong idElem string');
if (($PagePath != $_GET["PagePath"]) or
	($OEVersion != $_GET["OEVersion"]) or
	//($RelativePath != $_GET["RelativePath"]) or
	($Cfg != $_GET["Cfg"]) or
	($IdElem != htmlentities($_GET["IdElem"]))) die ('Some crap in input'); //  tags in GET parameters or other stuff that should not be there
if ((strpos($PagePath, ':') !== false) or (strpos($RelativePath, ':') !== false)) die('Wrong link'); // extra check for no ":" (http:// etc.) - must not be present in these params
	
error_reporting(E_ALL ^ (E_WARNING | E_NOTICE));

$_SESSION['WECaptchaCryptdir']= $RelativePath."WEFiles/Server/WECaptcha/";
$_SESSION['OEVersion']=$OEVersion;
$_SESSION['IdElem']=$IdElem;
if (!$IdElem) $IdElem = 0;

$cryptinstall="WECaptcha.fct-v".$_SESSION['OEVersion'].".php";

include $cryptinstall; 

$reslt = dsp_crypt($Cfg,1,$PagePath, $IdElem);

echo strip_tags($reslt); // last paranoidal security squeak..
?>