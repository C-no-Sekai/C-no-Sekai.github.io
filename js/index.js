window.onload = () => {
  sessionStorage.clear();
};
let validate = async function () {
  const login = document.getElementById("login").value;
  const password = document.getElementById("password").value;
  const data = {
    login: login,
    password: password,
  };
  let response = await fetch("https://the-qalam.herokuapp.com/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  response = await response.json();
  console.log(response);
  if (response.result === "success") {
    sessionStorage.setItem("username", data.login);
    sessionStorage.setItem("name", response.name);
    window.location.href = "activities.html";
  } else {
    const error = document.getElementById("incorrect_pass");
    document.getElementById("password").value = "";
    error.textContent = "Entered Username or Password is Incorrect";
    error.style.display = "block";
  }
};

let register = () => {
  window.location.href = "register.html";
};
