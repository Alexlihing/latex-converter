document.addEventListener('DOMContentLoaded', function() {
    const form = document.createElement('form');
    const textarea = document.createElement('textarea');
    const button = document.createElement('button');
    const messageDiv = document.createElement('div');

    textarea.id = 'userInput';
    textarea.placeholder = 'Enter plain text to convert to LaTeX';
    textarea.rows = 6;
    textarea.cols = 50;

    button.type = 'submit';
    button.textContent = 'Submit';

    messageDiv.id = 'message';
    messageDiv.style.marginTop = '20px';
    messageDiv.style.fontWeight = 'bold';

    form.appendChild(textarea);
    form.appendChild(button);
    document.body.appendChild(form);
    document.body.appendChild(messageDiv);

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const userInput = document.getElementById('userInput').value;

        fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: userInput })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('message').innerHTML = data.message;
        })        
        .catch(error => console.error('Error:', error));
    });
    fetch('/message')
        .then(response => response.json())
        .then(data => {
            document.getElementById('message').innerHTML = data.message;
        });
});
