<?php
/*
Uploadify v2.1.4
Release Date: November 8, 2010

Copyright (c) 2010 Ronnie Garcia, Travis Nickels

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
if (!empty($_FILES)) {
	$tempFile = $_FILES['Filedata']['tmp_name'];
	$targetPath = $_SERVER['DOCUMENT_ROOT'] . $_REQUEST['folder'] . '/';
	
	$targetFile =  str_replace('//','/',$targetPath) . $_REQUEST['uniqueFileID'] . '-' . $_FILES['Filedata']['name'];
	
	//$targetFile =  str_replace('//','/',$targetPath) . $_REQUEST['imageID'] . $_FILES['Filedata']['name'];
	
	//$targetFile = str_replace('//','/', $targetPath) . $_GET['name'] . '.' . $ext;
	
	// $fileTypes  = str_replace('*.','',$_REQUEST['fileext']);
	// $fileTypes  = str_replace(';','|',$fileTypes);
	// $typesArray = split('\|',$fileTypes);
	// $fileParts  = pathinfo($_FILES['Filedata']['name']);
	
	// if (in_array($fileParts['extension'],$typesArray)) {
		// Uncomment the following line if you want to make the directory if it doesn't exist
		// mkdir(str_replace('//','/',$targetPath), 0755, true);
		
		move_uploaded_file($tempFile,$targetFile);
		
		
		
		// Imagick stuff
		
		
		// TODO: Check the file type and fail if not image
		
		/* Create the Item JSON array */
		//$itemArray = array();
		
		//$imageArray = array("id" => str_replace($_SERVER['DOCUMENT_ROOT'],'',$targetFile));
		
		/* Add the imageID to the array */
		//array_push($itemArray, array("img" => $imageArray));
				
		/* The original image is the average colors */
		$average = new Imagick( $targetFile );
		 
		/* Reduce the amount of colors to 10 */
		$average->quantizeImage( 5, Imagick::COLORSPACE_RGB, 0, false, false );
		 
		/* Only save one pixel of each color */
		$average->uniqueImageColors();
		
		// Create an array
		$colorArray = array();
		
		
		// Create a pixel iterator
		$it = $average->getPixelIterator();
		
		// Start the iterator over
		$it->resetIterator();
		
		// This is useless, just used to check html
		//$colorBox = '';
		
		$i = 0;
		
		// Loop through and get the pixel values
		while($row = $it->getNextIteratorRow()) {
			foreach($row as $pixel) {
				$pixelArray = $pixel->getColor();
				
				$r = dechex($pixelArray['r']);
				$g = dechex($pixelArray['g']);
				$b = dechex($pixelArray['b']);
				
				if(strlen($r) < 2) { $r = 0 . $r; }
				if(strlen($g) < 2) { $g = 0 . $g; }
				if(strlen($b) < 2) { $b = 0 . $b; }
				
				$hex = "#" . $r . $g . $b;
				
				//$colorItem = array("id" => "$i", "color" => $hex);
				
				//array_push($colorArray, $colorItem);  
				
				$colorArray[] = $hex;
				
				// This is useless, just outputs html boxes with hex colors to make sure they are right.
				//$colorBox .= '<div style="height: 20px; width: 20px; border: solid 1px #000; float: left; margin: 5px; background: ' . $hex . ';">&nbsp;</div>';
				
				$i++;
				
			}
		}
		
		//array_push($itemArray, array('colors' => $colorArray));
		
		$itemArray = array();
		$itemArray['image'] = str_replace($_SERVER['DOCUMENT_ROOT'],'',$targetFile);
		$itemArray['colors'] = $colorArray;
		
		
		echo json_encode($itemArray, JSON_FORCE_OBJECT);
		
		
		
		
		//echo str_replace($_SERVER['DOCUMENT_ROOT'],'',$targetFile);
		
		
	// } else {
	// 	echo 'Invalid file type.';
	// }
}
?>