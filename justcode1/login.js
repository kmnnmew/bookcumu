const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // 로컬스토리지에서 사용자 정보 가져오기
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    // 로그인 성공 시 currentUser에 로그인 정보 저장
    localStorage.setItem('currentUser', JSON.stringify(user));
    alert(`${user.username}님, 환영합니다!`);
    window.location.href = "home.html"; // 로그인 후 홈으로 이동
  } else {
    alert('아이디 또는 비밀번호가 올바르지 않습니다.');
  }

  loginForm.reset();
});
