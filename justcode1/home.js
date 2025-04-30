// 📌 1️⃣ 현재 로그인한 사용자 정보 가져오기
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const profileName = document.getElementById('profile-name');
const profileImg = document.getElementById('profile-img'); // 프로필 이미지 요소
const logoutBtn = document.getElementById('logout-btn'); // 로그아웃 버튼

if (!currentUser) {
  console.error('로그인된 사용자가 없습니다.');
  window.location.href = 'login.html'; // 로그인 페이지로 이동
} else {
  profileName.textContent = currentUser.username; // 사용자 이름 표시

  // localStorage에서 저장된 프로필 이미지 가져오기
  const storedProfileImg = currentUser.profileImg || localStorage.getItem(`${currentUser.username}-profileImg`);
  
  console.log("불러온 프로필 이미지:", storedProfileImg); // 디버깅 로그 추가

  // 저장된 이미지가 있으면 적용, 없으면 기본 이미지 사용
  profileImg.src = storedProfileImg && storedProfileImg.startsWith("data:image") ? storedProfileImg : 'default_profile.png';
}

// 📌 2️⃣ 프로필 사진 변경 시 즉시 반영
window.addEventListener('storage', (event) => {
  if (event.key === 'currentUser') {
    const updatedUser = JSON.parse(event.newValue);
    console.log("업데이트된 사용자 정보:", updatedUser); // 디버깅 로그 추가
    profileImg.src = updatedUser.profileImg || 'default-avatar.png';
  }
});

// 📌 3️⃣ 책 목록 관련 기능 (이미지 추가)
const bookList = document.getElementById('book-list');

// 로컬스토리지에서 책 목록 가져오기
let books = JSON.parse(localStorage.getItem('books')) || [];

// 📌 책 목록 렌더링 (이미지 추가)
function renderBooks() {
  bookList.innerHTML = ''; // 기존 책 목록 초기화

  if (books.length === 0) {
    bookList.innerHTML = '<p>추가된 책이 없습니다.</p>';
    return;
  }

  books.forEach((book) => {
    const bookDiv = document.createElement('div');
    bookDiv.classList.add('book');

    // 📌 이미지가 있는 경우만 추가
    if (book.image) {
      const bookImg = document.createElement('img');
      bookImg.src = book.image;
      bookImg.alt = book.title;
      bookImg.style.maxWidth = '100px';
      bookDiv.appendChild(bookImg);
    }

    // 📌 책 정보 추가
    const bookInfo = document.createElement('div');
    bookInfo.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>저자:</strong> ${book.author}</p>
    `;

    // 📌 책 클릭 시 상세 페이지로 이동
    bookDiv.addEventListener('click', () => {
      localStorage.setItem('selectedBook', JSON.stringify(book)); // 선택한 책 정보 저장
      window.location.href = 'book.html';
    });

    bookDiv.appendChild(bookInfo);
    bookList.appendChild(bookDiv);
  });
}

// 📌 4️⃣ 새로운 책 추가 시 자동으로 화면 업데이트
window.addEventListener('storage', (event) => {
  if (event.key === 'books') {
    books = JSON.parse(event.newValue) || [];
    renderBooks();
  }
});

// 📌 5️⃣ 로그아웃 기능 추가
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser'); // 로그인 정보 삭제
    window.location.href = 'login.html'; // 로그인 페이지로 이동
  });
};

// 📌 6️⃣ 페이지 로드 시 책 목록 렌더링
renderBooks();
