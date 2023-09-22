let displayValue = '';

function appendToDisplay(value) {
    displayValue += value;
    document.getElementById('display').value = displayValue;
}

function clearDisplay() {
    displayValue = '';
    document.getElementById('display').value = '';
}

function calculateResult() {
    try {
        let result;
        if (displayValue.includes('sin(')) {
            const degreeValue = parseFloat(displayValue.slice(4, -1));
            const radiansValue = (degreeValue * Math.PI) / 180; // Convert degrees to radians
            result = Math.sin(radiansValue);
        } else if (displayValue.includes('cos(')) {
            const degreeValue = parseFloat(displayValue.slice(4, -1));
            const radiansValue = (degreeValue * Math.PI) / 180; // Convert degrees to radians
            result = Math.cos(radiansValue);
        } else if (displayValue.includes('tan(')) {
            const degreeValue = parseFloat(displayValue.slice(4, -1));
            const radiansValue = (degreeValue * Math.PI) / 180; // Convert degrees to radians
            result = Math.tan(radiansValue);
        } else if (displayValue.includes('sqrt(')) {
            const value = parseFloat(displayValue.slice(5, -1));
            if (value < 0) {
                throw new Error('Cannot take square root of a negative number');
            }
            result = Math.sqrt(value);
        } else {
            result = eval(displayValue);
        }
        document.getElementById('display').value = result;
        displayValue = result.toString();
    } catch (error) {
        document.getElementById('display').value = 'Error';
    }
}