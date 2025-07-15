<!DOCTYPE html>
<html>

<head>
    <title>Enquiry Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: linear-gradient(135deg, #10b981, #3b82f6);
            color: white;
            padding: 20px;
            border-radius: 8px;
        }

        .content {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }

        .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Thank You for Your Enquiry!</h1>
        </div>

        <div class="content">
            <p>Dear {{ $enquiry->name }},</p>

            <p>We have received your home enquiry and our team will get back to you within 24 hours with personalized
                recommendations.</p>

            <h3>Your Enquiry Details:</h3>
            <ul>
                <li><strong>Name:</strong> {{ $enquiry->name }}</li>
                <li><strong>Email:</strong> {{ $enquiry->email }}</li>
                @if ($enquiry->phone)
                    <li><strong>Phone:</strong> {{ $enquiry->phone }}</li>
                @endif
                <li><strong>Message:</strong> {{ $enquiry->message }}</li>
                <li><strong>Submitted:</strong> {{ $enquiry->formatted_created_at }}</li>
            </ul>

            <p>We're excited to help you find your perfect home!</p>
        </div>

        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>

</html>
