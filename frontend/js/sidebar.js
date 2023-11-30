let home = document.getElementById('sidebar-home');
home.addEventListener('click', function() {
    location.href='/frontend/index.html';
    // 다른 동작을 수행하려면 이곳에 코드를 추가하세요.
});

let search = document.getElementById('sidebar-search');
search.addEventListener('click', function() {
    location.href="/frontend/explore.html"
    // 다른 동작을 수행하려면 이곳에 코드를 추가하세요.
});

let message = document.getElementById('sidebar-message');
message.addEventListener('click', function() {
    location.href='/frontend/message.html';
    // 다른 동작을 수행하려면 이곳에 코드를 추가하세요.
});

let profile = document.getElementById('sidebar-profile');
profile.addEventListener('click', function() {
    location.href='/frontend/profile.html';
    // 다른 동작을 수행하려면 이곳에 코드를 추가하세요.
});

let more = document.getElementById('sidebar-more');
more.addEventListener('click', function() {
    alert("미완성")
    // 다른 동작을 수행하려면 이곳에 코드를 추가하세요.
});