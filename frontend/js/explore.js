main_data = ""

fetch(`/api/explore`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include'
})
.then(response => response.json())
.then(data => {
    // 동적으로 추가
    main_data=data;
    setList("");
})

function setList(keyword) {
    var followerContainer = document.getElementById('tweetContainer');
    followerContainer.innerHTML = ""
    // 팔로워 목록 불러오기
    main_data.forEach(function (item) {
        // alert(keyword)
        if(!item.id.includes("")) {
            return;
        }
        const followElement = document.createElement('div');
        followElement.classList.add('follow');
        followElement.innerHTML =`
        <div class="post">
            <div class="post__avatar">
                <img 
                    src="http://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png" 
                    alt=""
                />
            </div>
            <div class="post__body">
                <div class="post__header">
                    <div class="post__headerText">
                        <a href="/frontend/profile.html?user_id=${item.id}">${item.id}</a>
                    </div>
                </div>          
            </div>
        </div>
    `;

        followerContainer.appendChild(followElement);
    })
}

function searchKeyword() {
    var search_keyword_parse = document.getElementById('search_keyword');
    var keyword = search_keyword_parse.value;
    setList(keyword);
}