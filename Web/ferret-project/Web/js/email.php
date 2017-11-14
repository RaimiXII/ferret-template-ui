<?php
$email_to = "jeff.jenkins.1986@gmail.com";
$name = "Jeff"; #$_POST["name"];
$email_from = "jeff.jenkins.1986@gmail.com"; #$_POST["email"];
$message = "This is  amessage...."; #$_POST["message"];
$email_subject = "Feedback from website";
$headers = "From: " . $email_from . "\n";
$headers .= "Reply-To: " . $email_from . "\n";
$message = "Name: ". $name . "\r\nMessage: " . $message;
ini_set("sendmail_from", $email_from);
$sent = mail($email_to, $email_subject, $message, $headers, "-f" .$email_from);
if ($sent)
{
header("Location: https://www.google.com");
} else {
echo "There has been an error sending your comments. Please try later.";
}
?>
