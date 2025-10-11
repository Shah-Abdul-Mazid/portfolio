<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Include PHPMailer
require '../assets/phpmailer/src/Exception.php';
require '../assets/phpmailer/src/PHPMailer.php';
require '../assets/phpmailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Collect and sanitize form data
    $name    = htmlspecialchars($_POST['name']);
    $email   = htmlspecialchars($_POST['email']);
    $subject = htmlspecialchars($_POST['subject']);
    $message = htmlspecialchars($_POST['message']);

    // Basic validation
    if(empty($name) || empty($email) || empty($subject) || empty($message)){
        die("Please fill in all required fields.");
    }

    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
        die("Invalid email format.");
    }

    $mail = new PHPMailer(true);

    try {
        // SMTP settings for Yahoo
        $mail->isSMTP();
        $mail->Host       = 'smtp.mail.yahoo.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'shahabdulmazid.ezan@yahoo.com'; // your Yahoo email
        $mail->Password   = 'Ilovepopy2023@02@126';       // Yahoo App Password
        $mail->SMTPSecure = 'ssl';
        $mail->Port       = 465;

        // Email sender & recipient
        $mail->setFrom($email, $name);
        $mail->addAddress('shahabdulmazid.ezan@yahoo.com', 'Shah Abdul Mazid');

        // Email content
        $mail->isHTML(true);
        $mail->Subject = "New Contact Message: $subject";
        $mail->Body    = "
            <h3>New Message from Website</h3>
            <p><strong>Name:</strong> $name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Subject:</strong> $subject</p>
            <p><strong>Message:</strong><br>$message</p>
        ";

        // Send email
        $mail->send();
        echo "✅ Message sent successfully!";
    } catch (Exception $e) {
        echo "❌ Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
?>
