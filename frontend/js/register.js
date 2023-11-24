document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();

    var username = document.getElementById('signupUsername').value;
    var email = document.getElementById('signupEmail').value;
    var password = document.getElementById('signupPassword').value;

    console.log('회원가입 시도:', username, email, password);

    // 여기에 서버에 회원가입 요청
    // 예: fetch('/signup', { method: 'POST', body: JSON.stringify({ username, email, password }) })
});
