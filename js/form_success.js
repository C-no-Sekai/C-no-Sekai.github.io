window.onload = () => {
  let username = sessionStorage.getItem("username");
  if (username === null) {
    window.location.href = "login.html";
  }
  let response = fetch("https://the-qalam.herokuapp.com/fillForms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ login: username }),
  });
};
let go_back = () => {
  window.location.href = "activities.html";
};
