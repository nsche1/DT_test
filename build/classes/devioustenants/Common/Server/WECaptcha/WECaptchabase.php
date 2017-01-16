<?php
// ATTENTION!! SAUVEGARDER EN UTF-8 SANS BOM (utiliser Notepad++) !!

// -----------------------------------------------
// Cryptographp v1.4
// (c) 2006-2007 Sylvain BRISON 
//
// www.cryptographp.com 
// cryptographp@alphpa.com 
//
// Licence CeCILL modifiée
// => Voir fichier Licence_CeCILL_V2-fr.txt)
// -----------------------------------------------

error_reporting(E_ALL ^ (E_WARNING | E_NOTICE));
session_start();

$cfg = htmlentities(strip_tags($_GET['cfg']));
$idElem = htmlentities(strip_tags($_GET['ElInd']));

SetCookie("WECaptcha", "1");


Header("Location: "."WECaptcha.inc-v".$_SESSION['OEVersion'].".php?ElInd=".$idElem."&cfg=".$cfg."&sn=".session_name()."&".SID); // enleve .$_SESSION['WECaptchaCryptdir']."/"

/* Alternative way, probably faster, can try later when there's no imminent release:
// DD changed behavior from redirect to require, to make it work on local webserver and probably to improve performance:
//Header("Location: "."WECaptcha.inc-v".$_SESSION['OEVersion'].".php?ElInd=".$idElem."&cfg=".$cfg."&sn=".session_name()."&".SID); // enleve .$_SESSION['WECaptchaCryptdir']."/"
$_GET['ElInd'] = $idElem;
$_GET['cfg'] = $cfg;
$_GET['sn'] = session_name();

require "WECaptcha.inc-v".$_SESSION['OEVersion'].".php";
*/

?>