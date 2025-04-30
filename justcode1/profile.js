// 📌 사용자 정보 가져오기
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const profileName = document.getElementById('profile-name');
const profileImg = document.getElementById('profile-img'); // 프로필 페이지의 프로필 이미지
const homeProfileImg = document.getElementById('home-profile-img'); // 홈 화면 프로필 이미지
const profileImgInput = document.getElementById('profile-img-input'); // 파일 선택 input
const uploadBtn = document.getElementById('upload-btn'); // 사진 선택 버튼

// 📌 로그인된 사용자 확인
if (!currentUser) {
  console.error('로그인 상태가 아님: currentUser가 localStorage에 없습니다.');
  window.location.href = "login.html"; // 로그인 페이지로 이동
} else {
  profileName.textContent = currentUser.username; // 아이디 표시
  updateProfileImages(); // 페이지 로드 시 프로필 이미지 설정
}

// 📌 사진 선택 버튼 클릭 시 파일 선택창 열기
uploadBtn.addEventListener('click', () => {
  profileImgInput.click();
});

// 📌 프로필 사진 변경 이벤트 처리
profileImgInput.addEventListener('change', function(event) {
  const file = event.target.files[0];

  if (!file) return; // 파일이 선택되지 않음

  if (file.size > 2 * 1024 * 1024) { // 2MB 제한
    alert("파일 크기가 너무 큽니다. (최대 2MB)");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const newProfileImg = e.target.result; // 새 프로필 이미지 데이터

    // 프로필 사진 변경 (프로필 페이지 & 홈 화면 동시 적용)
    updateProfileImages(newProfileImg);

    if (currentUser) {
      console.log("프로필 이미지 저장 중:", newProfileImg);

      // localStorage에 이미지 저장 (username을 키로 사용)
      localStorage.setItem(`${currentUser.username}-profileImg`, newProfileImg);

      // currentUser 객체 업데이트
      currentUser.profileImg = newProfileImg;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      console.log("프로필 이미지 저장 완료!");

      // 다른 탭에서도 즉시 반영되도록 storage 이벤트 트리거
      window.dispatchEvent(new Event('storage'));
    } else {
      console.error("currentUser 정보가 없습니다.");
    }
  };

  reader.readAsDataURL(file);
});

// 📌 프로필 이미지 업데이트 함수 (홈 화면 & 프로필 페이지 동시 반영)
function updateProfileImages(imageSrc) {
  if (!imageSrc) {
    imageSrc = localStorage.getItem(`${currentUser.username}-profileImg`) || "default-avatar.png";
  }

  if (profileImg) profileImg.src = imageSrc; // 프로필 페이지
  if (homeProfileImg) homeProfileImg.src = imageSrc; // 홈 화면 프로필
}

// 📌 다른 탭에서도 프로필 이미지 동기화 (storage 이벤트 추가)
window.addEventListener('storage', (event) => {
  if (event.key === `${currentUser.username}-profileImg` || event.key === 'currentUser') {
    updateProfileImages(); // 변경된 이미지 반영
  }
});

// 📌 페이지 로드 시 프로필 이미지 자동 업데이트
document.addEventListener('DOMContentLoaded', updateProfileImages);
