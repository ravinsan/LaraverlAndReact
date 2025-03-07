<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Reminder</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007bff;
            color: #ffffff;
            text-align: center;
            padding: 15px;
            border-radius: 8px 8px 0 0;
            font-size: 20px;
        }
        .content {
            padding: 20px;
            font-size: 16px;
            color: #333333;
        }
        .footer {
            text-align: center;
            padding: 15px;
            font-size: 14px;
            color: #777777;
        }
    </style>
</head>
<body>

    <div class="email-container">
        <div class="header">
            Appointment Reminder
        </div>
        <div class="content">
            <p>Dear <strong>{{ $appointment->user->name }}</strong>,</p>
            <p>This is a reminder for your upcoming appointment titled "<strong>{{ $appointment->title }}</strong>" scheduled for <strong>{{ \Carbon\Carbon::parse($appointment->bdate)->format('d M Y, h:i A') }}</strong>.</p>
            <p>Thank you!</p>
        </div>
        <div class="footer">
            &copy; 2025 Your Company Name | All Rights Reserved
        </div>
    </div>

</body>
</html>
