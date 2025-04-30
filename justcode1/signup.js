const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const email = document.getElementById('email').value;

  // 비밀번호 확인
  if (password !== confirmPassword) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  // 로컬스토리지에서 기존 사용자 정보 가져오기
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const existingUser = users.find(user => user.username === username);

  if (existingUser) {
    alert('이미 사용 중인 아이디입니다.');
    return;
  }

  // 새 사용자 정보 추가
  users.push({ username, password, email });
  localStorage.setItem('users', JSON.stringify(users));

  alert('회원가입이 완료되었습니다!');
  window.location.href = "login.html"; // 로그인 페이지로 이동
});
