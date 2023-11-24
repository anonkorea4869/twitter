document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    var username = document.getElementById('loginUsername').value;
    var password = document.getElementById('loginPassword').value;

    console.log('로그인 시도:', username, password);

    // 로그인 요청
    //  fetch('/login', { method: 'POST', body: JSON.stringify({ username, password }) })
});
