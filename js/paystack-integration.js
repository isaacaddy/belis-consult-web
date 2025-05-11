/**
 * Paystack Payment Integration
 * This file handles all Paystack payment functionality for Belis Consult
 */

// Initialize Paystack integration when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the payment forms
    const paymentForm = document.getElementById('paymentForm');
    const paystackForm = document.getElementById('paystackForm');
    
    // Add event listeners to the forms if they exist
    if (paymentForm) {
        paymentForm.addEventListener("submit", handleCardPayment, false);
    }
    
    if (paystackForm) {
        paystackForm.addEventListener("submit", handlePaystackPayment, false);
    }
    
    // Initialize payment tabs if they exist
    initializePaymentTabs();
});

/**
 * Initialize payment method tabs
 */
function initializePaymentTabs() {
    const paymentTabs = document.querySelectorAll('.payment-tab');
    
    paymentTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            paymentTabs.forEach(t => {
                t.classList.remove('active', 'bg-blue-50', 'text-blue-600');
                t.classList.add('text-gray-600');
            });
            
            // Add active class to clicked tab
            tab.classList.add('active', 'bg-blue-50', 'text-blue-600');
            tab.classList.remove('text-gray-600');
            
            // Show the corresponding form
            const paymentMethod = tab.getAttribute('data-method');
            showPaymentForm(paymentMethod);
        });
    });
}

/**
 * Show the appropriate payment form based on selected method
 * @param {string} method - The payment method to display
 */
function showPaymentForm(method) {
    // Hide all payment forms
    const paymentForms = document.querySelectorAll('[id$="-form"]');
    paymentForms.forEach(form => {
        form.classList.add('hidden');
    });
    
    // Show the selected payment form
    const selectedForm = document.getElementById(`${method}-form`);
    if (selectedForm) {
        selectedForm.classList.remove('hidden');
    }
}

/**
 * Handle regular card payment
 * @param {Event} e - The form submission event
 */
function handleCardPayment(e) {
    e.preventDefault();
    
    // Get form values
    const amount = document.getElementById("payment-amount").value;
    const email = document.querySelector('input[type="email"]').value;
    
    // Validate form
    if (!validatePaymentForm(amount, email)) {
        return;
    }
    
    // Process payment (implement your payment gateway logic here)
    alert('Processing card payment...');
}

/**
 * Handle Paystack payment initialization
 * @param {Event} e - The form submission event
 */
function handlePaystackPayment(e) {
    e.preventDefault();
    
    // Get form values
    const amount = document.getElementById("paystack-amount").value;
    const email = document.getElementById("paystack-email").value;
    const fullName = document.querySelector('input[placeholder="Full Name"]')?.value || '';
    const firstName = fullName.split(' ')[0] || '';
    const lastName = fullName.split(' ').slice(1).join(' ') || '';
    const phone = document.querySelector('input[type="tel"]')?.value || '';
    const service = getSelectedService();
    
    // Validate form
    if (!validatePaymentForm(amount, email)) {
        return;
    }
    
    // Convert amount to kobo (Paystack uses the smallest currency unit)
    const amountInKobo = amount ? parseFloat(amount) * 100 : getServicePrice(service) * 100;
    
    // Generate a reference
    const reference = generateReference();
    
    // Initialize Paystack
    let handler = PaystackPop.setup({
        key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with your public key
        email: email,
        amount: amountInKobo,
        currency: 'USD', // Change to your preferred currency
        ref: reference,
        metadata: {
            custom_fields: [
                {
                    display_name: "First Name",
                    variable_name: "first_name",
                    value: firstName
                },
                {
                    display_name: "Last Name",
                    variable_name: "last_name",
                    value: lastName
                },
                {
                    display_name: "Phone Number",
                    variable_name: "phone",
                    value: phone
                },
                {
                    display_name: "Service",
                    variable_name: "service",
                    value: service
                }
            ]
        },
        callback: function(response) {
            // This happens after the payment is completed successfully
            const reference = response.reference;
            
            // Make an AJAX call to your server to verify the transaction
            verifyTransaction(reference);
            
            // Show success message
            showSuccessMessage('Payment complete! Reference: ' + reference);
        },
        onClose: function() {
            // This happens when the user closes the payment modal
            showErrorMessage('Transaction was not completed, window closed.');
        }
    });
    
    handler.openIframe();
}

/**
 * Get the selected service from the radio buttons
 * @returns {string} The selected service name
 */
function getSelectedService() {
    const selectedService = document.querySelector('input[name="service"]:checked');
    if (selectedService) {
        const serviceLabel = selectedService.closest('label');
        const serviceName = serviceLabel.querySelector('span')?.textContent || 'Travel Consultation';
        return serviceName;
    }
    return 'Travel Consultation';
}

/**
 * Get the price for a service based on its name
 * @param {string} serviceName - The name of the service
 * @returns {number} The price of the service
 */
function getServicePrice(serviceName) {
    const servicePrices = {
        'Travel Consultation': 50,
        'Flight Booking': 30,
        'Hotel Booking': 25,
        'Group Tours': 299,
        'Custom Packages': 100,
        'Visa Assistance': 100
    };
    
    return servicePrices[serviceName] || 50;
}

/**
 * Validate the payment form
 * @param {string} amount - The payment amount
 * @param {string} email - The customer's email
 * @returns {boolean} Whether the form is valid
 */
function validatePaymentForm(amount, email) {
    if (!email) {
        showErrorMessage('Please enter your email address');
        return false;
    }
    
    if (!validateEmail(email)) {
        showErrorMessage('Please enter a valid email address');
        return false;
    }
    
    return true;
}

/**
 * Validate an email address
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Generate a unique reference for the transaction
 * @returns {string} A unique reference
 */
function generateReference() {
    const prefix = 'BELIS';
    const randomNum = Math.floor((Math.random() * 1000000000) + 1);
    const timestamp = new Date().getTime();
    return `${prefix}_${randomNum}_${timestamp}`;
}

/**
 * Verify a transaction with the server
 * @param {string} reference - The transaction reference
 */
function verifyTransaction(reference) {
    // This function should make an AJAX call to your server
    // to verify the transaction using the Paystack API
    
    // For now, just log the reference
    console.log('Verifying transaction:', reference);
}

/**
 * Show a success message to the user
 * @param {string} message - The message to display
 */
function showSuccessMessage(message) {
    alert(message); // Replace with a better UI notification
}

/**
 * Show an error message to the user
 * @param {string} message - The message to display
 */
function showErrorMessage(message) {
    alert(message); // Replace with a better UI notification
}