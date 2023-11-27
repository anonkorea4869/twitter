$(document).ready(function () {
    const limit = 2;
    let skip = 0;
    let loading = false;
    let maxItemsReached = false; // 최대 아이템 도달 여부

    function loadItems() {
        if (loading || maxItemsReached) return;
        loading = true;

        $.get(`/api/article?skip=${skip}&limit=${limit}`, function (data) {
            const itemList = $("#tweetContainer");
            data.forEach(function (item) {
                // 데이터 값을 row_code 문자열에 동적으로 삽입
                const row = `
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
                            ${item.user_id}
                                <span class="post__headerSpecial">
                                ${item.time.replace("T", " ")}
                                </span>
                            </h3>
                        </div>
                        <div class="post__headerDescription">
                            <p>${item.content}</p>
                        </div>
                    </div>
            
                    <div class="post__footer">
                        <span class="material-icons" onclick="">repeat</span>
                        <span class="material-icons" id="likeIcon${item.idx}" onclick="updateLike(${item.idx})">${item.user_liked === 1 ? "favorite" : "favorite_border"}</span>
                        <span id="likeCount${item.idx}">${item.like_count}</span>
                        <span class="material-icons"> publish </span>
                    </div>
                </div>
            </div>
                `;

        itemList.append(row); // 생성된 row를 itemList에 추가
    });

            skip += limit;
            loading = false;

            // 최대 아이템 도달 시 프리로딩 중단
            if (data.length < limit) {
                maxItemsReached = true;
            }

            // 프리로딩: 다음 데이터 미리 로드
            preloadNextItems();
        });
    }

    // 페이지 로드 시 초기 데이터 로딩
    loadItems();

    // 스크롤 이벤트 핸들러
    $('#feed').scroll(function () {
        const scrollTop = $('#feed').scrollTop();
        const windowHeight = $('#feed').height();
        const documentHeight = $('#feed').prop('scrollHeight');

        // 스크롤이 맨 아래에 도달하면 추가 아이템 로딩
        if (scrollTop + windowHeight >= documentHeight - 30) {
            loadItems();
        }
    });

    // 다음 데이터 미리 로드
    function preloadNextItems() {
        const preloadingThreshold = 30; // 스크롤 이전에 얼마나 미리 로드할 것인가
        const scrollTop = $('#feed').scrollTop();
        const windowHeight = $('#feed').height();
        const documentHeight = $('#feed').prop('scrollHeight');

        // 현재 스크롤 위치에서 미리 로딩 임계값 이하일 때 다음 데이터 미리 로드
        if (!maxItemsReached && documentHeight - (scrollTop + windowHeight) < preloadingThreshold) {
            loadItems();
        }
    }
});

var tweetForm = document.getElementById('tweet_form'); // form 요소 선택

tweetForm.addEventListener('submit', function(event) { // form에 이벤트 추가
    event.preventDefault();
    
    var content = document.getElementById('tweet_content').value;

    fetch(`/api/article`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content }),
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if(data.result === "success") {
            // alert(data.result);
            location.href="/frontend/index.html";
        } else {
            alert(data.result);
        }
    })
});

function updateLike(idx) {
    // let like_count = document.getElementById("likeCount");
    let icon = document.getElementById("likeIcon" + idx);
    let like_count = document.getElementById("likeCount" + idx);
    
    fetch(`/api/article/like/${idx}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })

    if (icon.textContent === 'favorite_border') {
        icon.textContent = 'favorite';
        like_count.innerText = parseInt(like_count.innerText) + 1;
    }
    else if (icon.textContent === 'favorite'){
        icon.textContent = "favorite_border"
        like_count.innerText = parseInt(like_count.innerText) - 1;
    }
}