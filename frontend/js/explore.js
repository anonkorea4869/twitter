keyword_parse= document.getElementById('search_keyword');

// 현재 URL을 가져옵니다.
let currentURL = window.location.href;
// URL을 URLSearchParams 객체로 변환합니다.
let url = new URL(currentURL);
// URLSearchParams 객체에서 user_id 매개변수의 값을 가져옵니다.
var keyword = url.searchParams.get("keyword");

const limit = 10;
let skip = 0;
let loading = false;
let maxItemsReached = false; // 최대 아이템 도달 여부

if(keyword == null) {
    keyword = ""
    loadItems(keyword);
} else {
    // loadItems(keyword);
}


function loadItems(keyword) {
    if (loading || maxItemsReached) return;
    loading = true;

    $.get(`/api/explore/${keyword}?skip=${skip}&limit=${limit}`, function (data) {

        const itemList = $("#tweetContainer");
        data.forEach(function (item) {
            // 데이터 값을 row_code 문자열에 동적으로 삽입
            row = `
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
// loadItems(keyword);

// 스크롤 이벤트 핸들러
$('#feed').scroll(function () {
    const scrollTop = $('#feed').scrollTop();
    const windowHeight = $('#feed').height();
    const documentHeight = $('#feed').prop('scrollHeight');

    // 스크롤이 맨 아래에 도달하면 추가 아이템 로딩
    if (scrollTop + windowHeight >= documentHeight - 30) {
        loadItems(keyword);
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
        loadItems(keyword);
    }
}


let search_button = document.getElementById('search_button');

search_button.addEventListener('click', function() {
    keyword = document.getElementById("search_keyword").value;
    loading = false
    maxItemsReached = false
    // loadItems(keyword);
    // location.href="/frontend/explore.html?keyword=dae"
})