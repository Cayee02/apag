<?php
// Copy to config.local.php for local development; keep it outside the public root.
return [
    'smtp_host' => '',
    'smtp_port' => 587,
    'smtp_encryption' => 'tls', // tls (STARTTLS), ssl (SMTPS); none only for loopback testing.
    'smtp_username' => '',
    'smtp_password' => '',
    'mail_from' => '', // Verified address authorized by your SMTP provider.
    'mail_from_name' => 'APAG',
    'mail_to' => '', // Empty uses the institutional email edited in the panel.
];
