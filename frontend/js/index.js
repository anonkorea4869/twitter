let likeCount = 0;


function addTweet(event) {
    event.preventDefault();

    // 입력된 트윗 내용 가져오기
    var tweetText = document.getElementById('tweetInput').value;

    // 트윗을 표시할 곳에 동적으로 추가
    var tweetContainer = document.getElementById('tweetContainer');

    // 새 트윗을 맨 위에 추가
    tweetContainer.innerHTML = `
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
                        <h3>
                            User Name
                            <span class="post__headerSpecial">
                                @user_id
                            </span>
                        </h3>
                    </div>
                    <div class="post__headerDescription">
                        <p>${tweetText}</p>
                    </div>
                </div>
        
                <div class="post__footer">
                    <span class="material-icons" onclick="toggleLike(this)">repeat</span>
                    <span class="material-icons" onclick="toggleLike(this)">favorite_border</span>
                    <span id="likeCount">0</span>
                    <span class="material-icons"> publish </span>
                </div>
            </div>
        </div>
    ` + tweetContainer.innerHTML;

    fetch('/api/article/{user_id}', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tweet: tweetText
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);

    
})
    // 트윗 입력창 초기화
    document.getElementById('tweetInput').value = '';
}

function toggleLike(icon) {
    let comment_like = document.getElementById("likeCount")
    // 'favorite_border' 아이콘이면 'favorite'로 변경
    if (icon.textContent === 'favorite_border') {
        icon.textContent = 'favorite';
        likeCount++;
        comment_like.innerHTML = likeCount;
    }
    else if (icon.textContent === 'favorite'){
        icon.textContent = "favorite_border"
        likeCount--;
        comment_like.innerHTML = likeCount;
    }
}