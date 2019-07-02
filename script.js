$(function() {
    $('.js-calc').submit(function(event) {
        
        //Stop the defalut form sub behavior.
        event.preventDefault();

        const loanAmount = $('.js-loan-amount').val();
        const term = $('.js-term').val();
        const rate = $('.js-rate').val();
        const monthlyRate = rate/12;
        const payment = monthlyPayment(loanAmount, term, monthlyRate);
        let results = [{
            month: 0, 
            payment: 0,
            balance: loanAmount, 
            principle: 0, 
            interest: 0,
            principleToDate: 0,
            interestToDate: 0,
            
        }];
        
        for (i=1; i<=term; i++) {
            results[i] = {};
            results[i].month = i;
            results[i].payment = payment;
            results[i].balance = loanBalance(loanAmount, term, monthlyRate, i);
            results[i].principle = monthsPrinciple(i, results);
            results[i].interest = monthsInterest(i, results);
            results[i].principleToDate = totalPrincipleToDate(results);
            results[i].interestToDate = totalInterestToDate(results);
            
            $(".js-results").append($(
                `<div>
                ${results[i].month}
                ${results[i].payment}
                ${results[i].balance}
                ${results[i].principle}
                ${results[i].interest}
                ${results[i].principleToDate}
                ${results[i].interestToDate}
                </div>`
            ))
        }
        console.log(results);
    });

    //Payment(monthly) = L[c(1+c)^n]/[(1+c)^n -1]
    //L = loan amount
    //n = term in months
    //c = monthly interest rate
    function monthlyPayment(amount, term, rate) {
        return parseFloat((amount * (rate * Math.pow(1 + rate, term))/(Math.pow(1 + rate, term) - 1)).toFixed(2));
    };

    //Loan Balance = L[(1+c)^n - (1+c)^p]/[(1+c)^n -1]
    //L = loan amount
    //n = term in months
    //c = monthly interest rate
    //p = after p# of months
    function loanBalance(amount, term, rate, numMonths) {
        return parseFloat((amount * (Math.pow(1+rate, term) - Math.pow(1 + rate, numMonths)) / (Math.pow(1 + rate, term) - 1)).toFixed(2));
    };

    //calculate the principle paid in a given month
    //Principle paid = Previous month's balance subtract the current month's balance.
    function monthsPrinciple(month, arr=results) {
        return parseFloat((arr[month-1].balance - arr[month].balance).toFixed(2));
    };

    //calculate the interest paid in a given month
    //Interest paid = month's payment - month's principle
    function monthsInterest(month, arr) {
        return parseFloat((arr[month].payment - arr[month].principle).toFixed(2));
    };

    //sum the total principle paid to date.
    function totalPrincipleToDate(arr) {
        return arr.reduce(function(acc, obj) {
            return parseFloat(acc) + parseFloat(obj.principle);
        }, 0)
    };
    //The sum of interest paid to date.
    function totalInterestToDate(arr) {
        return arr.reduce(function(acc, obj) {
            return parseFloat(acc) + parseFloat(obj.interest);
        }, 0)
    };

})