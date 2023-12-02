// 현재 URL을 가져옵니다.
let currentURL = window.location.href;
// URL을 URLSearchParams 객체로 변환합니다.
let url = new URL(currentURL);
// URLSearchParams 객체에서 user_id 매개변수의 값을 가져옵니다.
var user_id = url.searchParams.get("user_id");

fetch(`/api/follow/following/${user_id}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include'
})
.then(response => response.json())
.then(data => {
    followerData = data.result;
    // 동적으로 추가
    var followerContainer = document.getElementById('followerContainer');

    // 팔로워 목록 불러오기
    followerData.forEach(function (item) {
        const followElement = document.createElement('div');
        followElement.classList.add('follow');
        followElement.innerHTML = `
        <div class="follow__avatar">
            <img src="http://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png" alt="" />
        </div>
        <div class="follow__header">
            <div class="follow__headerText">
                <h3>
                    ${item.following_id}
                    <span class="follow__headerSpecial">
                    </span>
                </h3>
            </div>
        </div>
        `;

        followerContainer.appendChild(followElement);
    })
})
