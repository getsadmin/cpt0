document.addEventListener('DOMContentLoaded', function() {
    function fetchInvoiceData() {
      fetch('/get/AllCustomerIds') // Assuming this endpoint returns an array of customer IDs
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(customerIds => {
        // Now that we have customer IDs, let's fetch invoices for each customer
        customerIds.forEach(customerId => {
          fetch('/submit/Invoice/InvoiceByCustomerId', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ customerId: customerId })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(invoices => {
            console.log(`Invoices for customer ${customerId}:`, invoices);
            // Handle the retrieved invoices here
          })
          .catch(error => {
            console.error(`Error fetching invoices for customer ${customerId}:`, error);
            // Handle errors here
          });
        });
      })
      .catch(error => {
        console.error('Error fetching customer IDs:', error);
        // Handle errors here
      });
    }

    fetchInvoiceData();
  });