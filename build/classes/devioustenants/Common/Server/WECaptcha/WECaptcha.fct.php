<?php

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


// session_start(); (enleve)

function dsp_crypt($cfg=0,$reload=1,$page="", $captchaIdElem=0) {
	$reslt_captcha = "";
	
    $_SESSION['WECaptchaPage']=$page;

	// store an unique index corresponding to the current IdElem:
	$numItems = (isset($_SESSION['CaptchaItemCount']) ? $_SESSION['CaptchaItemCount'] : 0);
	
	$_SESSION['CaptchaItemCount'] = $captchaInd = $_SESSION['ArIdElem'][$captchaIdElem] = $numItems+1;
	
	// session value validation:
	if ($_SESSION['WECaptchaCryptdir']) $_SESSION['WECaptchaCryptdir'] = htmlentities(strip_tags($_SESSION['WECaptchaCryptdir']));
	if ($_SESSION['OEVersion']) $_SESSION['OEVersion'] = htmlentities(strip_tags($_SESSION['OEVersion']));
	
	// DD apres v.1.26 bug - deux "//" dans le chemin, il faut retirer trailing / dans le chemin s'il est present; fixed:
	$captchadir = $_SESSION['WECaptchaCryptdir'];
	if ($captchadir && substr($captchadir, strlen($captchadir)-1, 1) == '/') $captchadir = substr($captchadir,0, strlen($captchadir)-1);
	$_SESSION['WECaptchaCryptdir'] = $captchadir;
	
	// links to generate initial and reload captcha (apparently identical for the moment unless $reload is false)
	$linkFirstCaptchaImg 	= 				$_SESSION['WECaptchaCryptdir']."/WECaptchabase-v".$_SESSION['OEVersion'].".php?ElInd=".$captchaInd."&cfg=".$cfg."&".SID; // link to the captcha image source
	$linkREloadedCaptchaImg = (($reload) ? ($_SESSION['WECaptchaCryptdir']."/WECaptchabase-v".$_SESSION['OEVersion'].".php?ElInd=".$captchaInd."&cfg=".$cfg."&".SID) : ""); // link to the reloaded captcha source (to use on Reload onclick)
	
    // retourne 2 liens separes pas ::
	$reslt_captcha .= $linkFirstCaptchaImg.'::'.$linkREloadedCaptchaImg;
 	    

    return $reslt_captcha;
 
}


 function chk_crypt($code, $captchaIdElem = "") {
 // Vérifie si le code est correct ($difuplow = false signifie pas de difference entre majuscule et minuscule - no diff between upper and lowercase)

 ob_start(); // in case configfile ever gets to be a hostile script
 include_once ($_SESSION['WECaptchaConfigfile']);
 ob_end_clean();
 
 // retrueve code corresponding to this captcha element (there may be several on a page):
 if (!isset($_SESSION['ArIdElem']) or !isset($_SESSION['ArIdElem'][$captchaIdElem])) return;
 $elInd = $_SESSION['ArIdElem'][$captchaIdElem];
 // echo " elInd = $elInd ";
 
 $code = addslashes ($code);
 $code = str_replace(' ','',$code);  // supprime les espaces saisis par erreur.
 $code = ($difuplow?$code:strtoupper($code));
 switch (strtoupper($cryptsecure)) {    
        case "MD5"  : $code = md5($code); break;
        case "SHA1" : $code = sha1($code); break;
        }
 if ($_SESSION['WECaptchaCryptcode'] and $_SESSION['WECaptchaCryptcode'][$elInd] and ($_SESSION['WECaptchaCryptcode'][$elInd] == $code))
    {
    unset($_SESSION['WECaptchaCryptreload']);
    if ($cryptoneuse) unset($_SESSION['WECaptchaCryptcode'][$elInd]);
    return true;
    }
 else { // no code or wrong
	$_SESSION['WECaptchaCryptreload']= true;
	return false;
	}
 }

?>
