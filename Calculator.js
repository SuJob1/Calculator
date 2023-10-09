        // Clear the display
        document.getElementById("clear").addEventListener("click", function() {
            document.getElementById("display").value = "";
        });

        // Append value to the display
        function get(value) {
            document.getElementById("display").value += value;
        }

        // Evaluate the result
        function calculates() {
            var displayValue = document.getElementById("display").value;
            displayValue = processTrigonometry(displayValue);
            try {
                 var result = eval(displayValue);
                 document.getElementById("display").value = result;
                } catch (error) {
                    document.getElementById("display").value = "Error";
                 }
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
            var display = document.getElementById("display");
            display.value = display.value.slice(0, -1);
        }
