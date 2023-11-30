document.addEventListener('DOMContentLoaded', () => {
  // 좋아요 버튼 이벤트 리스너
  const likeButton = document.querySelector('.like-button');
  likeButton.addEventListener('click', () => {
    const isLiked = likeButton.dataset.liked === 'true';
    likeButton.dataset.liked = !isLiked;
    likeButton.textContent = isLiked ? '좋아요' : '좋아함';
    likeButton.classList.toggle('liked');
  });

  // 공유 버튼 이벤트 리스너
  const shareButton = document.getElementById('shareButton');
  shareButton.addEventListener('click', () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('URL이 클립보드에 복사되었습니다.');
    }).catch(err => {
      console.error('URL 복사에 실패했습니다.', err);
    });
  });

  const toggleCommentButton = document.getElementById('toggleCommentButton');
  const commentContainer = document.querySelector('.comment-container');

  toggleCommentButton.addEventListener('click', () => {
    // display 속성을 토글하여 댓글 컨테이너를 보이거나 숨깁니다.
    if (commentContainer.style.display === "none") {
      commentContainer.style.display = "block";
      toggleCommentButton.textContent = "댓글 숨기기";
    } else {
      commentContainer.style.display = "none";
      toggleCommentButton.textContent = "댓글 보기";
    }
  });
});

  // 댓글 폼 이벤트 리스너
  const commentForm = document.getElementById('commentForm');
  const commentInput = document.getElementById('commentInput');
  const commentList = document.getElementById('commentList');
  commentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const newComment = commentInput.value.trim();
    if (newComment) {
      // 서버에 댓글 데이터 전송
      fetch('https://example.com/api/comments', { // 실제 서버의 API 엔드포인트로 변경
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // 필요한 경우 인증 헤더 추가
        },
        body: JSON.stringify({ comment: newComment })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // 댓글 목록에 새 댓글 추가
        const commentDiv = document.createElement('div');
        commentDiv.textContent = newComment;
        commentDiv.classList.add('comment');
        commentList.prepend(commentDiv);

        // 입력 필드 초기화
        commentInput.value = '';
      })
      .catch(error => {
        console.error('Failed to post comment:', error);
      });
    }
  });

  // 게시물 데이터 로딩
  fetch('https://example.com/api/posts/123') // 실제 서버의 API 엔드포인트로 변경
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      document.querySelector('.post-title h1').textContent = data.title;
      document.querySelector('.post-image img').src = data.imageUrl;
      document.querySelector('.post-image img').alt = data.title;
      document.querySelector('.post-content p').textContent = data.content;
    })
    .catch(error => {
      console.error('Failed to fetch post:', error);
    });

  commentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const newComment = commentInput.value.trim();
    if (newComment) {
      // 예제로, 서버에 댓글을 저장하는 대신에 댓글을 직접 추가합니다.
      // 실제로는 서버에 데이터를 전송하고 응답을 받아야 합니다.
      addComment({
        username: "사용자 이름", // 서버에서 받은 사용자 이름
        userTag: "@usertag", // 서버에서 받은 유저 태그
        timestamp: "방금 전", // 서버에서 받은 시간 정보
        content: newComment // 작성된 댓글 내용
      });
      commentInput.value = '';
    }
  });

  function addComment(commentData) {
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');
    commentDiv.innerHTML = `
      <strong><a href="/user/${commentData.userTag}">${commentData.username}</a></strong>
      <span>${commentData.timestamp}</span>
      <p>${commentData.content}</p>
    `;
    commentList.prepend(commentDiv);
  };


  