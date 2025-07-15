<!DOCTYPE html>
<html>
<head>
    <title>New Home Enquiry</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1f2937; color: white; padding: 20px; border-radius: 8px; }
        .content { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .urgent { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Home Enquiry Received</h1>
        </div>
        
        <div class="urgent">
            <strong>Action Required:</strong> Please respond within 24 hours
        </div>
        
        <div class="content">
            <h3>Customer Details:</h3>
            <ul>
                <li><strong>Name:</strong> {{ $enquiry->name }}</li>
                <li><strong>Email:</strong> {{ $enquiry->email }}</li>
                @if($enquiry->phone)
                <li><strong>Phone:</strong> {{ $enquiry->phone }}</li>
                @endif
                <li><strong>Status:</strong> {{ ucfirst($enquiry->status) }}</li>
                <li><strong>Received:</strong> {{ $enquiry->formatted_created_at }}</li>
            </ul>
            
            <h3>Enquiry Message:</h3>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #10b981;">
                {{ $enquiry->message }}
            </div>
        </div>
    </div>
</body>
</html>