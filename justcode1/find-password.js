const findPasswordForm = document.getElementById('find-password-form');
const loginRedirect = document.getElementById('login-redirect');
const loginBtn = document.getElementById('login-btn');

findPasswordForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message');

    // 로컬스토리지에서 사용자 정보 가져오기
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.email === email);

    if (user) {
        // 사용자 정보가 존재하면 비밀번호 표시
        message.textContent = `비밀번호는 "${user.password}"입니다.`;
        message.style.color = "green";

        // 로그인 화면으로 이동 버튼 표시
        loginRedirect.style.display = "block";
    } else {
        // 사용자 정보가 없으면 경고 메시지
        message.textContent = "일치하는 사용자 정보를 찾을 수 없습니다.";
        message.style.color = "red";

        // 로그인 화면으로 이동 버튼 숨김
        loginRedirect.style.display = "none";
    }
});

// 로그인 버튼 클릭 시 로그인 화면으로 이동
loginBtn.addEventListener('click', () => {
    window.location.href = "login.html"; // 로그인 화면으로 이동
});
