const addBookForm = document.getElementById('add-book-form');
const bookImageInput = document.getElementById('book-image'); // 이미지 업로드 필드
const previewImg = document.getElementById('preview-img'); // 이미지 미리 보기

// 📌 이미지 미리보기 기능 추가
bookImageInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      previewImg.src = e.target.result;
      previewImg.style.display = "block"; // 이미지 미리보기 표시
    };
    reader.readAsDataURL(file);
  }
});

addBookForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // 책 정보 가져오기
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const publisher = document.getElementById('publisher').value;
  const year = document.getElementById('year').value;
  const description = document.getElementById('description').value;
  const bookImageFile = bookImageInput.files[0]; // 업로드한 이미지 파일

  // 현재 로그인한 유저 정보 가져오기 (로컬스토리지)
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    alert('로그인이 필요합니다.');
    return;
  }

  // 📌 이미지 파일을 Base64로 변환하는 함수
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  let imageBase64 = ''; // 기본값 (이미지가 없을 수도 있음)

  if (bookImageFile) {
    try {
      imageBase64 = await convertImageToBase64(bookImageFile); // 이미지 변환
    } catch (error) {
      console.error('이미지 변환 오류:', error);
    }
  }

  // 📌 책 객체 만들기 (이미지 포함)
  const newBook = {
    id: new Date().getTime(), // 고유 ID 생성
    title,
    author,
    publisher,
    year,
    description,
    image: imageBase64 || null, // 이미지가 없으면 null 저장
    addedBy: currentUser.username  // 또는 currentUser.id
  };

  // 📌 로컬스토리지에서 기존 책 목록 가져오기
  const books = JSON.parse(localStorage.getItem('books')) || [];

  // 새 책 추가
  books.push(newBook);

  // 로컬스토리지에 책 목록 저장
  localStorage.setItem('books', JSON.stringify(books));

  alert('책이 추가되었습니다!');
  addBookForm.reset(); // 폼 초기화
  previewImg.style.display = "none"; // 미리보기 숨김
  window.location.href = 'home.html'; // 홈 페이지로 이동
});
