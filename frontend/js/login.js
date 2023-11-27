document.addEventListener('DOMContentLoaded', function() {
    var loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var id = document.getElementById('loginUsername').value;
        var pw = document.getElementById('loginPassword').value;

        // URL에 쿼리 문자열 추가하여 GET 요청 보내기
        fetch(`/api/login?id=${id}&pw=${pw}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if(data.result === "success") {
                location.href="/frontend/index.html";
            } else {
                alert(data.result);
            }
        })
    });
});
