 const loanAmountInput = document.getElementById('loanAmount');
 const tenureInput = document.getElementById('tenure');
 const interestRateInput = document.getElementById('interestRate');
 const emiElement = document.getElementById('emi');
 const principalAmountElement = document.getElementById('principalAmount');
 const interestAmountElement = document.getElementById('interestAmount');
 const totalAmountElement = document.getElementById('totalAmount');

 let chart;
 let debounceTimer;

 function debounce(func, delay) {
     return function() {
         clearTimeout(debounceTimer);
         debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
     };
 }    
 function updateCalculator() {
     const P = parseFloat(loanAmountInput.value);
     const N = parseFloat(tenureInput.value) * 12;
     const R = parseFloat(interestRateInput.value) / 12 / 100;

     const EMI = P * R * (Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1));
     const totalAmount = EMI * N;
     const interestAmount = totalAmount - P;

     emiElement.textContent = `₹ ${EMI.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
     principalAmountElement.textContent = `₹ ${P.toLocaleString()}`;
     interestAmountElement.textContent = `₹ ${interestAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
     totalAmountElement.textContent = `₹ ${totalAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

     document.getElementById('loanAmountValue').textContent = `₹ ${P.toLocaleString()}`;
     document.getElementById('tenureValue').textContent = tenureInput.value;
     document.getElementById('interestRateValue').textContent = `${interestRateInput.value}%`;

     debounce(updateChart, 300)(P, interestAmount);
     // setTimeout(function() {
     //     updateChart(P, interestAmount);
     // },500)
 }

 function updateChart(principal, interest) {
     if (chart) {
         chart.destroy();
     }

     const ctx = document.getElementById('pieChart').getContext('2d');
     chart = new Chart(ctx, {
         type: 'doughnut',
         data: {
             labels: ['Principal', 'Interest'],
             datasets: [{
                 data: [principal, interest],
                 backgroundColor: ['#0052CC', '#00875A']
             }]
         },
         options: {
             responsive: true,
             maintainAspectRatio: false,
             cutout: '70%',
             plugins: {
                 legend: {
                     position: 'bottom'
                 }
             }
         }
     });
 }

 loanAmountInput.addEventListener('input', updateCalculator);
 tenureInput.addEventListener('input', updateCalculator);
 interestRateInput.addEventListener('input', updateCalculator);

 updateCalculator();