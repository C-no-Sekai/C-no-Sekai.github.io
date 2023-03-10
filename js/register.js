window.onload = () => {
  sessionStorage.clear();
};

async function submitForm() {
  const login = document.getElementById("login");
  const password = document.getElementById("password");
  const section = document.getElementById("section");
  const data = {
    login: login.value,
    password: password.value,
    section: section.value,
  };
  request = await fetch("https://the-qalam.herokuapp.com/addUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  request = await request.json();
  if (request.result === "pending") {
    const wait = document.getElementById("incorrect_pass");
    wait.textContent =
      "Request Received! Your Account will be created after Verification";
    wait.style.display = "block";

    setTimeout(() => (window.location.href = "login.html"), 4000);
  } else {
    const error = document.getElementById("incorrect_pass");
    document.getElementById("password").value = "";
    error.textContent = "Entered Username or Password is Incorrect";
    error.style.display = "block";
  }
}
