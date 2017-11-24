<?php

$firstNameField = $_POST['first_name'];
$lastNameField = $_POST['last_name'];
$nameField = $_POST['first_name'] .  $_POST['last_name'];
$emailField = $_POST['email'];
$institutionField = $_POST['institution'];
$messageField = $_POST['message'];

/**
 * This example shows making an SMTP connection with authentication.
 */
//Import the PHPMailer class into the global namespace
include("PHPMailer/class.phpmailer.php");

//SMTP needs accurate times, and the PHP time zone MUST be set
//This should be done in your php.ini, but this is how to do it if you don't have access to that
date_default_timezone_set('Etc/UTC');

require 'PHPMailer/AutoLoad.php';

//Create a new PHPMailer instance
$mail = new PHPMailer;

//Tell PHPMailer to use SMTP
$mail->isSMTP();

//Enable SMTP debugging
// 0 = off (for production use)
// 1 = client messages
// 2 = client and server messages
$mail->SMTPDebug = 0;

//Set the hostname of the mail server
$mail->Host = 'mailfwd.nih.gov';

//Set the SMTP port number - likely to be 25, 465 or 587
$mail->Port = 25;

//Whether to use SMTP authentication
$mail->SMTPAuth = true;

//Username to use for SMTP authentication
$mail->Username = 'test@test.com';

//Password to use for SMTP authentication
$mail->Password = '';

//Set who the message is to be sent from
$mail->setFrom($emailField , $nameField);

//Set who the message is to be sent to
$mail->addAddress('jeffrey.jenkins@nih.gov', 'Jeff');

//Set the subject line
$mail->Subject = 'Testing';

//Read an HTML message body from an external file, convert referenced images to embedded,

//convert HTML into a basic plain-text alternative body
$mail->msgHTML($messageField);

//Replace the plain text body with one created manually
$mail->AltBody = 'This is a plain-text message body';

//send the message, check for errors
if (!$mail->send()) {
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message sent!';
}
?>