<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 10px;
            font-size: 20px;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
            color: #333;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777;
        }
        .guest-list {
            margin-top: 10px;
            padding-left: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">Appointment Confirmation</div>
        <div class="content">
            <p>Dear <strong>{{$data['name']}}</strong>,</p>
            <p>Your appointment titled <strong>"{{$data['title']}}"</strong> has been successfully booked for <strong>{{date('Y-m-d H:i', strtotime($data['bdate']))}}</strong>.</p>
            <p><strong>Description:</strong> {{$data['description']}}</p>
            <p><strong>Guests:</strong></p>
            <ul class="guest-list">
                <li>[Guest Email 1]</li>
                <li>[Guest Email 2]</li>
                <li>[Guest Email 3]</li>
                <!-- Add more guests as needed -->
            </ul>
            <p>Thank you!</p>
        </div>
        <div class="footer">&copy; 2025 Your Company Name. All rights reserved.</div>
    </div>
</body>
</html>