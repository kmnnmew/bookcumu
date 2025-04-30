// 📌 1️⃣ 로컬스토리지에서 선택된 책 정보 가져오기
const selectedBook = JSON.parse(localStorage.getItem('selectedBook'));
if (!selectedBook) {
  alert('책 정보를 불러오지 못했습니다.');
  window.location.href = "home.html";
}

// 📌 2️⃣ 책 정보를 읽어오는 함수 (이미지 추가)
function renderBookDetails() {
  document.getElementById('book-title').textContent = selectedBook.title;
  document.getElementById('book-author').textContent = `저자: ${selectedBook.author}`;
  document.getElementById('book-publisher').textContent = `출판사: ${selectedBook.publisher}`;
  document.getElementById('book-year').textContent = `출판 연도: ${selectedBook.year}`;
  document.getElementById('book-description').textContent = `소개: ${selectedBook.description}`;

  // 책 이미지 표시 (이미지가 있는 경우만)
  const bookImage = document.getElementById('book-image');
  if (selectedBook.image) {
    bookImage.src = selectedBook.image;
    bookImage.style.display = 'block'; // 이미지 표시
  } else {
    bookImage.style.display = 'none'; // 이미지 없으면 숨김
  }
}

// 초기 렌더링
renderBookDetails();

// 📌 3️⃣ 현재 로그인한 유저 정보 가져오기
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

// 📌 4️⃣ 수정/삭제 버튼 동적 추가
if (currentUser && selectedBook.addedBy === currentUser.username) {
  const controlsContainer = document.createElement('div');
  controlsContainer.id = 'book-controls';
  controlsContainer.style.marginTop = "20px";

  // 수정 버튼
  const editButton = document.createElement('button');
  editButton.textContent = '수정';
  editButton.addEventListener('click', createEditForm);
  controlsContainer.appendChild(editButton);

  // 삭제 버튼
  const deleteButton = document.createElement('button');
  deleteButton.textContent = '삭제';
  deleteButton.style.marginLeft = "10px";
  deleteButton.addEventListener('click', deleteBook);
  controlsContainer.appendChild(deleteButton);

  document.querySelector('.book-detail').appendChild(controlsContainer);
}

// 📌 5️⃣ 책 삭제 기능
function deleteBook() {
  if (!confirm('정말로 이 책을 삭제하시겠습니까?')) return;

  const books = JSON.parse(localStorage.getItem('books')) || [];
  const updatedBooks = books.filter(book => book.id !== selectedBook.id);
  localStorage.setItem('books', JSON.stringify(updatedBooks));

  let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
  reviews = reviews.filter(review => review.bookId !== selectedBook.id);
  localStorage.setItem('reviews', JSON.stringify(reviews));

  alert('책이 삭제되었습니다.');
  window.location.href = 'home.html';
}

// 📌 6️⃣ 책 수정 기능 (이미지 수정 포함)
function createEditForm() {
  const bookDetailSection = document.querySelector('.book-detail');
  bookDetailSection.style.display = 'none';

  const editFormContainer = document.createElement('section');
  editFormContainer.id = 'edit-book-form';
  editFormContainer.innerHTML = `
    <h2>책 수정</h2>
    <form id="edit-book-form-element">
      <input type="text" id="edit-title" value="${selectedBook.title}" required>
      <input type="text" id="edit-author" value="${selectedBook.author}" required>
      <input type="text" id="edit-publisher" value="${selectedBook.publisher}" required>
      <input type="number" id="edit-year" value="${selectedBook.year}" required>
      <textarea id="edit-description" required>${selectedBook.description}</textarea>
      
      <!-- 이미지 수정 -->
      <input type="file" id="edit-image" accept="image/*">
      <img id="preview-edit-img" style="display: none; max-width: 200px;">

      <button type="submit">저장</button>
      <button type="button" id="cancel-edit">취소</button>
    </form>
  `;

  document.querySelector('main').insertBefore(editFormContainer, document.querySelector('.reviews'));

  // 이미지 미리보기 기능
  document.getElementById("edit-image").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const previewImg = document.getElementById("preview-edit-img");
        previewImg.src = e.target.result;
        previewImg.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('edit-book-form-element').addEventListener('submit', function (e) {
    e.preventDefault();

    selectedBook.title = document.getElementById('edit-title').value;
    selectedBook.author = document.getElementById('edit-author').value;
    selectedBook.publisher = document.getElementById('edit-publisher').value;
    selectedBook.year = document.getElementById('edit-year').value;
    selectedBook.description = document.getElementById('edit-description').value;

    const imageInput = document.getElementById('edit-image').files[0];
    if (imageInput) {
      const reader = new FileReader();
      reader.onload = function (event) {
        selectedBook.image = event.target.result;
        updateBookData();
      };
      reader.readAsDataURL(imageInput);
    } else {
      updateBookData();
    }
  });

  document.getElementById('cancel-edit').addEventListener('click', () => {
    editFormContainer.remove();
    bookDetailSection.style.display = '';
  });
}

// 📌 7️⃣ 로컬스토리지 업데이트 함수
function updateBookData() {
  localStorage.setItem('selectedBook', JSON.stringify(selectedBook));

  const books = JSON.parse(localStorage.getItem('books')) || [];
  const updatedBooks = books.map(book => (book.id === selectedBook.id ? selectedBook : book));
  localStorage.setItem('books', JSON.stringify(updatedBooks));

  alert('책 정보가 수정되었습니다.');
  location.reload();
}

// 📌 8️⃣ 리뷰 관리 기능 (추가 및 삭제)
const reviewList = document.getElementById('review-list');
const reviewContent = document.getElementById('review-content');
const submitReviewButton = document.getElementById('submit-review');

let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

function getBookReviews() {
  return reviews.filter(review => review.bookId === selectedBook.id);
}

function renderReviews() {
  reviewList.innerHTML = '';
  const bookReviews = getBookReviews();

  if (bookReviews.length === 0) {
    reviewList.innerHTML = '<li>아직 작성된 리뷰가 없습니다.</li>';
    return;
  }

  bookReviews.forEach(review => {
    const li = document.createElement('li');
    li.textContent = `${review.username}: ${review.content}`;

    if (currentUser && (review.username === currentUser.username || selectedBook.addedBy === currentUser.username)) {
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '삭제';
      deleteBtn.style.marginLeft = '10px';
      deleteBtn.addEventListener('click', () => {
        if (confirm('이 리뷰를 삭제하시겠습니까?')) {
          deleteReview(review);
        }
      });
      li.appendChild(deleteBtn);
    }

    reviewList.appendChild(li);
  });
}

function deleteReview(reviewToDelete) {
  reviews = reviews.filter(review => review !== reviewToDelete);
  localStorage.setItem('reviews', JSON.stringify(reviews));
  renderReviews();
}

submitReviewButton.addEventListener('click', () => {
  if (!currentUser) {
    alert('로그인 후 리뷰를 작성할 수 있습니다.');
    return;
  }
  const content = reviewContent.value.trim();
  if (!content) return;

  reviews.push({ bookId: selectedBook.id, username: currentUser.username, content });
  localStorage.setItem('reviews', JSON.stringify(reviews));

  reviewContent.value = '';
  renderReviews();
});

// 📌 9️⃣ 초기 리뷰 렌더링
renderReviews();
