# belis-consult-web

## Setup Instructions

### EmailJS Integration

This project uses EmailJS for sending emails. Follow the steps below to set it up:

1. **Sign Up / Log In**: 
   - Go to the [EmailJS website](https://www.emailjs.com/) and create an account or log in if you already have one.

2. **Create an Email Service**: 
   - After logging in, create an email service by selecting your email provider and verifying your email.

3. **Find Your Public Key**: 
   - Navigate to your EmailJS dashboard.
   - Look for the "API Keys" section. Your public key will be listed there (it typically looks like `user_xxx`).

4. **Update Your Code**: 
   - Replace the placeholder in your code with your actual public key. For example:
     ```html
     emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
     ```

### Additional Information

- Ensure that you do not expose your API keys in public repositories.
- Refer to the [EmailJS documentation](https://www.emailjs.com/docs/) for more details on how to use the service.