document.addEventListener('DOMContentLoaded', function() {
    var signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var id = document.getElementById('signupUsername').value;
        var pw = document.getElementById('signupPassword').value;

        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'id': id,
                'pw': pw
            })
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if(data.result == "success") {
                alert("Register success");
                location.href="/frontend/login.html";
            } else {
                alert(data.result);
            }
        })
    });
});
