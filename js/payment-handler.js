/**
 * Payment Handler
 * Handles payment method selection and service price updates
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize payment tabs
    initializePaymentTabs();
    
    // Initialize service selection
    initializeServiceSelection();
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
 * Initialize service selection radio buttons
 */
function initializeServiceSelection() {
    const serviceRadios = document.querySelectorAll('input[name="service"]');
    
    // Set initial service and price
    updateSelectedService();
    
    // Add event listeners to service radio buttons
    serviceRadios.forEach(radio => {
        radio.addEventListener('change', updateSelectedService);
    });
}

/**
 * Update the selected service display and payment amounts
 */
function updateSelectedService() {
    const selectedService = document.querySelector('input[name="service"]:checked');
    
    if (selectedService) {
        const serviceLabel = selectedService.closest('label');
        const serviceName = serviceLabel.querySelector('span')?.textContent || 'Travel Consultation';
        const priceText = serviceLabel.querySelector('p.text-blue-600')?.textContent || '$50/hour';
        
        // Extract the price value
        const priceMatch = priceText.match(/\$(\d+)/);
        const price = priceMatch ? priceMatch[1] : '50';
        
        // Update the service display
        const serviceDisplay = document.getElementById('selected-service-display');
        const amountDisplay = document.getElementById('selected-amount-display');
        
        if (serviceDisplay) {
            serviceDisplay.textContent = serviceName;
        }
        
        if (amountDisplay) {
            amountDisplay.textContent = `$${price}.00`;
        }
        
        // Update hidden amount fields
        document.getElementById('payment-amount').value = price;
        document.getElementById('paystack-amount').value = price;
    }
}