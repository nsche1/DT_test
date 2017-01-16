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





//Chemin des donnéees de la page
$PageVarPhp = dirname(__FILE__)."/../../../".$_SESSION['WECaptchaPage']."(var).php";

$IdElem=$_SESSION['IdElem'];


global $OEConfWECaptcha; // DD necessary when (var).php was included somewhere before
require_once $PageVarPhp; // DD _once is sometimes necessary

require_once dirname(__FILE__)."/../openElement.php";  // ajout de la class globale

$objJson = new OEJSON();

 
if (empty( $OEConfWECaptcha )) 
{
 	$json = ""; 
} else {
	$json = $OEConfWECaptcha ;	
}



//Deserialisation de OEConfWECaptcha
$output = $objJson->Decode($json);

//Gestion des erreurs de déserialisation
if ($output==null) {
	echo "error Json";
	exit(0);
}

$WECaptchaInfo= $output->$IdElem;
$OECssUnit= new OECssUnit();


//print_r($test);


function hex2RGB($hexStr, $returnAsString = false, $seperator = ',') {
    $hexStr = preg_replace("/[^0-9A-Fa-f]/", '', $hexStr); // Gets a proper hex string
    $rgbArray = array();
    if (strlen($hexStr) == 6) { //If a proper hex code, convert using bitwise operation. No overhead... faster
        $colorVal = hexdec($hexStr);
        $rgbArray['red'] = 0xFF & ($colorVal >> 0x10);
        $rgbArray['green'] = 0xFF & ($colorVal >> 0x8);
        $rgbArray['blue'] = 0xFF & $colorVal;
    } elseif (strlen($hexStr) == 3) { //if shorthand notation, need some string manipulations
        $rgbArray['red'] = hexdec(str_repeat(substr($hexStr, 0, 1), 2));
        $rgbArray['green'] = hexdec(str_repeat(substr($hexStr, 1, 1), 2));
        $rgbArray['blue'] = hexdec(str_repeat(substr($hexStr, 2, 1), 2));
    } else {
        return false; //Invalid hex color code
    }
    return $returnAsString ? implode($seperator, $rgbArray) : $rgbArray; // returns the rgb string or the associative array
}



// -------------------------------------
// Configuration du fond du cryptogramme
// -------------------------------------

$cryptwidth  = $OECssUnit->GetValue($WECaptchaInfo->CryptWidth);  // Largeur du cryptogramme (en pixels)
$cryptheight = $OECssUnit->GetValue($WECaptchaInfo->CryptHeight);   // Hauteur du cryptogramme (en pixels)





$bgR  = 255;         // Couleur du fond au format RGB: Red (0->255)
$bgG  = 255;         // Couleur du fond au format RGB: Green (0->255)
$bgB  = 255;         // Couleur du fond au format RGB: Blue (0->255)

$bgclear = true;     		// Fond transparent (true/false)
							// Uniquement valable pour le format PNG

$bgimg = '';                 // Le fond du cryptogramme peut-être une image  
                             // PNG, GIF ou JPG. Indiquer le fichier image
                             // Exemple: $fondimage = 'photo.gif';
				                     // L'image sera redimensionnée si nécessaire
                             // pour tenir dans le cryptogramme.
                             // Si vous indiquez un répertoire plutôt qu'un 
                             // fichier l'image sera prise au hasard parmi 
                             // celles disponibles dans le répertoire

$bgframe = false;    // Ajoute un cadre de l'image (true/false)


// ----------------------------
// Configuration des caractères
// ----------------------------

// Couleur de base des caractères

$CharColor=hex2RGB("#".$WECaptchaInfo->CharColorHex);
//print_r($CharColor);

$charR = $CharColor["red"];     // Couleur des caractères au format RGB: Red (0->255)
$charG = $CharColor["green"];     // Couleur des caractères au format RGB: Green (0->255)
$charB = $CharColor["blue"];     // Couleur des caractères au format RGB: Blue (0->255)

$charcolorrnd = $WECaptchaInfo->CharColorRnd;      // Choix aléatoire de la couleur.
$charcolorrndlevel = $WECaptchaInfo->CharColorRndLevel;    // Niveau de clarté des caractères si choix aléatoire (0->4)
                           // 0: Aucune sélection
                           // 1: Couleurs très sombres (surtout pour les fonds clairs)
                           // 2: Couleurs sombres
                           // 3: Couleurs claires
                           // 4: Couleurs très claires (surtout pour fonds sombres)

// $charclear = $WECaptchaInfo->CharClear;   // Intensité de la transparence des caractères (0->127)
                  // 0=opaques; 127=invisibles
	                // interessant si vous utilisez une image $bgimg
	                // Uniquement si PHP >=3.2.1
// DD correction - $WECaptchaInfo->CharClear is Boolean
$charclear = ($WECaptchaInfo->CharClear) ? 64: 0; // true = half-transparent, false=opaque

// Polices de caractères

$OELinks=new OELinks;
$Font=$OELinks->Get($WECaptchaInfo->Tfont,"DEFAULT");



//$tfont[] = 'Alanden_.ttf';       // Les polices seront aléatoirement utilisées.
//$tfont[] = 'bsurp___.ttf';       // Vous devez copier les fichiers correspondants
//$tfont[] = 'ELECHA__.TTF';       // sur le serveur.
$tfont[] = $Font; //'luggerbu.ttf';// Ajoutez autant de lignes que vous voulez   
//$tfont[] = 'RASCAL__.TTF';       // Respectez la casse ! 
//$tfont[] = 'SCRAWL.TTF';  
//$tfont[] = 'WAVY.TTF';   


// Caracteres autorisés
// Attention, certaines polices ne distinguent pas (ou difficilement) les majuscules 
// et les minuscules. Certains caractères sont faciles à confondre, il est donc
// conseillé de bien choisir les caractères utilisés.

//$charel = $WECaptchaInfo->Charel; //'ABCDEFGHKLMNPRTWXYZ234569';       // Caractères autorisés

$crypteasy = true;       // Création de cryptogrammes "faciles à lire" (true/false)
                         // composés alternativement de consonnes et de voyelles.

$charelc = 'BCDFGHKLMNPRTVWXZ';   // Consonnes utilisées si $crypteasy = true
$charelv = 'AEIOUY';              // Voyelles utilisées si $crypteasy = true


$difuplow = 0;//$WECaptchaInfo->DifUpLow;// false;          // Différencie les Maj/Min lors de la saisie du code (true, false)

$charnbmin = $WECaptchaInfo->CharNbMin;//4;         // Nb minimum de caracteres dans le cryptogramme
$charnbmax = $WECaptchaInfo->CharNbMax;//6;         // Nb maximum de caracteres dans le cryptogramme


$charspace = $OECssUnit->GetValue($WECaptchaInfo->CharSpace);//20;        // Espace entre les caracteres (en pixels)
$charsizemin = $OECssUnit->GetValue($WECaptchaInfo->CharSizeMin);//14;      // Taille minimum des caractères
$charsizemax = $OECssUnit->GetValue($WECaptchaInfo->CharSizeMax);//19;      // Taille maximum des caractères


$charanglemax  = $WECaptchaInfo->CharAngleMax;//25;     // Angle maximum de rotation des caracteres (0-360)
$charup   = $WECaptchaInfo->CharUp;//true;        // Déplacement vertical aléatoire des caractères (true/false)

// Effets supplémentaires

$cryptgaussianblur = false; // Transforme l'image finale en brouillant: méthode Gauss (true/false)
                            // uniquement si PHP >= 5.0.0
$cryptgrayscal = false;     // Transforme l'image finale en dégradé de gris (true/false)
                            // uniquement si PHP >= 5.0.0

// ----------------------
// Configuration du bruit
// ----------------------

$noisepxmin = $WECaptchaInfo->NoisePxMin;//10;      // Bruit: Nb minimum de pixels aléatoires
$noisepxmax = $WECaptchaInfo->NoisePxMax;//20;      // Bruit: Nb maximum de pixels aléatoires

$noiselinemin = $WECaptchaInfo->NoiseLineMin;//1;     // Bruit: Nb minimum de lignes aléatoires
$noiselinemax = $WECaptchaInfo->NoiseLineMax;//10;     // Bruit: Nb maximum de lignes aléatoires

$nbcirclemin = $WECaptchaInfo->NbCircleMin;//1;      // Bruit: Nb minimum de cercles aléatoires 
$nbcirclemax = $WECaptchaInfo->NbCircleMax;//4;      // Bruit: Nb maximim de cercles aléatoires


$noisecolorchar  = $WECaptchaInfo->NoiseColorChar;//3;  // Bruit: Couleur d'ecriture des pixels, lignes, cercles: 
                       // 1: Couleur d'écriture des caractères
                       // 2: Couleur du fond
                       // 3: Couleur aléatoire
                       
$brushsize = 1;		   // Taille d'ecriture du princeaiu (en pixels) 
                       // de 1 à 25 (les valeurs plus importantes peuvent provoquer un 
                       // Internal Server Error sur certaines versions de PHP/GD)
                       // Ne fonctionne pas sur les anciennes configurations PHP/GD

					   
$noiseup = $WECaptchaInfo->NoiseUp;//false;      // Le bruit est-il par dessus l'ecriture (true) ou en dessous (false) 

// --------------------------------
// Configuration système & sécurité
// --------------------------------

$cryptformat = "png";   // Format du fichier image généré "GIF", "PNG" ou "JPG"
				                // Si vous souhaitez un fond transparent, utilisez "PNG" (et non "GIF")
				                // Attention certaines versions de la bibliotheque GD ne gerent pas GIF !!!

$cryptsecure = "md5";    // Méthode de crytpage utilisée: "md5", "sha1" ou "" (aucune)
                         // "sha1" seulement si PHP>=4.2.0
                         // Si aucune méthode n'est indiquée, le code du cyptogramme est stocké 
                         // en clair dans la session.
                       
$cryptusetimer = $WECaptchaInfo->CryptUseTimer;        // Temps (en seconde) avant d'avoir le droit de regénérer un cryptogramme

$cryptusertimererror = 3;  // Action à réaliser si le temps minimum n'est pas respecté:
                           // 1: Ne rien faire, ne pas renvoyer d'image.
                           // 2: L'image renvoyée est "images/erreur2.png" (vous pouvez la modifier)
                           // 3: Le script se met en pause le temps correspondant (attention au timeout
                           //    par défaut qui coupe les scripts PHP au bout de 30 secondes)
                           //    voir la variable "max_execution_time" de votre configuration PHP

$cryptusemax = $WECaptchaInfo->CryptUseMax;  // Nb maximum de fois que l'utilisateur peut générer le cryptogramme
                      // Si dépassement, l'image renvoyée est "images/erreur1.png"
                      // PS: Par défaut, la durée d'une session PHP est de 180 mn, sauf si 
                      // l'hebergeur ou le développeur du site en ont décidé autrement... 
                      // Cette limite est effective pour toute la durée de la session. 
                      
$cryptoneuse = false;  // Si vous souhaitez que la page de verification ne valide qu'une seule 
                       // fois la saisie en cas de rechargement de la page indiquer "true".
                       // Sinon, le rechargement de la page confirmera toujours la saisie.                          
                      
?>
