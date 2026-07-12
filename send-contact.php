<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer-7.1.1/src/Exception.php';
require 'PHPMailer-7.1.1/src/PHPMailer.php';
require 'PHPMailer-7.1.1/src/SMTP.php';

$mail = new PHPMailer(true);

try {
    // Zoho SMTP settings
    $mail->isSMTP();
    $mail->Host = "smtppro.zoho.com";
    $mail->SMTPAuth = true;

    $mail->Username = "admin@century-adventures.com";
    $mail->Password = "cU7qAcMZYmqv"; // Zoho App-specific password

    $mail->SMTPSecure = "ssl";
    $mail->Port = 465;

    // Sender
    $mail->setFrom(
        "admin@century-adventures.com",
        "Century Adventures Website"
    );

    // Receiver
    $mail->addAddress(
        "admin@century-adventures.com"
    );

    // Customer reply
    $mail->addReplyTo(
        $_POST['email'],
        $_POST['name']
    );

    $mail->isHTML(true);
    $mail->Subject = "New Contact Enquiry - Century Adventures";

    $mail->Body = "
    <h2>New Website Enquiry</h2>
    <strong>Name:</strong> {$_POST['name']}<br>
    <strong>Email:</strong> {$_POST['email']}<br>
    <strong>Phone:</strong> {$_POST['phone']}<br>
    <strong>Safari Type:</strong> {$_POST['safari_type']}<br>
    <strong>Travel Date:</strong> {$_POST['travel_date']}<br>
    <strong>Guests:</strong> {$_POST['travelers']}<br><br>
    <strong>Message:</strong><br>
    " . nl2br(htmlspecialchars($_POST['message']));

    $mail->send();

    // Redirect to contact.html with a success status to show our premium success alert banner
    header("Location: contact.html?success=1");
    exit();

} catch (Exception $e) {
    echo "Error: " . $mail->ErrorInfo;
}
?>
