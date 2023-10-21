    // Variables
    let currentFormula = '';
    let currentResult = '';

    // Clear the display
    document.getElementById("clear").addEventListener("click", function() {
        document.getElementById("display").value = "";
    });

    // Append value to the display
    function get(value) {
        document.getElementById("display").value += value;
    }

    function updateFormula(value) {
        currentFormula += value;
        document.getElementById("display").value = currentFormula;
        saveCalculation(currentFormula, currentResult);
    }

    // Evaluate the result
    function calculates() {
        const originalFormula = document.getElementById("display").value;
        const displayValue = processTrigonometry(originalFormula);

        try {
            const result = eval(displayValue);
            document.getElementById("display").value = result;
        } catch (error) {
            document.getElementById("display").value = "Error";
        }

        console.log("Checking value:", document.getElementById("display").value);
        saveCalculation(originalFormula, document.getElementById("display").value);
    }

    // Process trigonometric functions
    function processTrigonometry(value) {
        value = value.replace(/(\d*)sin(\d+)/g, function(match, coefficient, angle) {
        coefficient = coefficient || '1';  // Default coefficient to 1 if it's absent
        return roundNumber(coefficient * Math.sin(toRadians(Number(angle))), 5);
        });

        value = value.replace(/(\d*)cos(\d+)/g, function(match, coefficient, angle) {
        coefficient = coefficient || '1';  // Default coefficient to 1 if it's absent
        return roundNumber(coefficient * Math.cos(toRadians(Number(angle))), 5);
        });

        value = value.replace(/(\d*)tan(\d+)/g, function(match, coefficient, angle) {
        coefficient = coefficient || '1';  // Default coefficient to 1 if it's absent
        return roundNumber(coefficient * Math.tan(toRadians(Number(angle))), 5);
        });

        value = value.replace(/(\d+)\^(\d+)/g, function(match, base, exponent) {
        return Math.pow(Number(base), Number(exponent));
        });
        value = value.replace(/log(\d+)\((\d+)\)/g, function(match, base, number) {
        return Math.log(number) / Math.log(base);
        });
        value = value.replace(/e\^(\d+)/g, function(match, exponent) {
        return Math.pow(Math.E, Number(exponent));
        });
        value = value.replace(/(\d+)%(\d+)/g, function(match, firstValue, secondValue) {
        return Number(firstValue) % Number(secondValue);
        });
    return value;
}
    // Round number to a certain decimal place
    function roundNumber(num, scale) {
            if(!("" + num).includes("e")) {
                return +(Math.round(num + "e+" + scale) + "e-" + scale);
            } else {
                var arr = ("" + num).split("e");
                var sig = ""
                if(+arr[1] + scale > 0) {
                    sig = "+";
                }
                return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
            }
        }
    // Convert degrees to radians
    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    function deleteLastCharacter() {
        const display = document.getElementById("display");
        display.value = display.value.slice(0, -1);
    }

    function saveCalculation(formula, result) {
        fetch('http://localhost:3000/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ formula, result })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                console.error('Error saving result:', data.error);
            }
        });
    }

    // New function: Get the results of the last 10 calculations
    function fetchRecentCalculations() {
        fetch('http://localhost:3000/recent')
            .then(response => response.json())
            .then(data => {
                const tableBody = document.getElementById("calculationsTable").getElementsByTagName("tbody")[0];
                tableBody.innerHTML = "";
                data.forEach(calculation => {
                    const newRow = tableBody.insertRow();
                    newRow.insertCell(0).innerText = calculation.formula;
                    newRow.insertCell(1).innerText = calculation.result;
                });
            });
    }
       