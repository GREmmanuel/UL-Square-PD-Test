document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('personalityForm');
    const results = document.getElementById('results');
    const resultText = document.getElementById('resultText');
    const likertButtons = document.querySelectorAll('.likert-scale button');
    
    likertButtons.forEach(button => {
        button.addEventListener('click', function() {
            const siblings = button.parentNode.querySelectorAll('button');
            siblings.forEach(sibling => sibling.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const data = new FormData(form);
        const selectedValues = {};
        let allQuestionsAnswered = true;
        
        likertButtons.forEach(button => {
            if (button.classList.contains('selected')) {
                selectedValues[button.name] = button.value;
            }
        });

        // Validate that all questions are answered
        const questions = form.querySelectorAll('.question-group');
        questions.forEach(group => {
            const errorMessages = group.querySelectorAll('.error-message');
            errorMessages.forEach(msg => msg.textContent = '');
            
            const buttons = group.querySelectorAll('button');
            const groupName = buttons[0].name;
            const isAnswered = !!selectedValues[groupName];
            
            if (!isAnswered) {
                allQuestionsAnswered = false;
                const errorMessage = group.querySelector('.error-message');
                errorMessage.textContent = 'Please answer this question.';
            }
        });

        if (!allQuestionsAnswered) {
            return;
        }
        
        // Calculate and display results
        let result = '';
        // Example calculation logic - this should be adjusted based on actual logic
        const eoScores = [selectedValues['eo1'], selectedValues['eo2'], selectedValues['eo3'], selectedValues['eo4']].map(val => mapLikertValue(val));
        const ipScores = [selectedValues['ip1'], selectedValues['ip2'], selectedValues['ip3'], selectedValues['ip4']].map(val => mapLikertValue(val));
        
        const eoAverage = average(eoScores);
        const ipAverage = average(ipScores);

        if (eoAverage > 3) {
            result += 'You are extroverted. ';
        } else {
            result += 'You are introverted. ';
        }

        if (ipAverage > 3) {
            result += 'You rely more on intuition.';
        } else {
            result += 'You rely more on concrete details.';
        }

        resultText.textContent = result;
        results.classList.remove('hidden');
    });

    function mapLikertValue(value) {
        switch(value) {
            case 'Strongly Disagree': return 1;
            case 'Disagree': return 2;
            case 'Neutral': return 3;
            case 'Agree': return 4;
            case 'Strongly Agree': return 5;
            default: return 0;
        }
    }

    function average(array) {
        return array.reduce((a, b) => a + b, 0) / array.length;
    }
});
