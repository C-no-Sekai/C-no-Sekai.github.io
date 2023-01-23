window.onload = () => {
  let username = sessionStorage.getItem("name");
  if (username === null) {
    window.location.href = "index.html";
  }
  document.getElementById(
    "username_session"
  ).innerHTML = `<h3 class="username_session_name">Welcome ${username}</h3>`;
  get_terms();
};
let get_terms = async function () {
  // Get term List from API
  let username_fetch_data = { login: sessionStorage.getItem("username") };
  console.log(sessionStorage.getItem("username"));
  let response = await fetch("http://127.0.0.1:8000/getTerms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(username_fetch_data),
  });
  response = await response.json();
  let terms = response.terms;
  const display_list = document.getElementById("terms");
  new_html = "";
  terms.forEach((element) => {
    new_html += `<li class="d-inline mx-5 align-self-center py-3"><input class="terms_radio" type="radio" name="radAnswer" onclick="update_table()"/>${element}</li>`;
  });
  display_list.innerHTML = new_html;
};

let update_table = async () => {
  const btns = document.getElementsByClassName("terms_radio");
  let active = 0;
  for (let index = 0; index < btns.length; index++) {
    if (btns[index].checked) {
      // Use this to get results of table from API
      active = index;
      btns[index].addEventListener("click", () => {});
    } else {
      btns[index].addEventListener("click", update_table);
    }
  }
  // Results From API fetched, now draw table
  results = await fetch("http://127.0.0.1:8000/getGrades", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: sessionStorage.getItem("username"),
      term: btns[active].nextSibling.textContent.toLowerCase(),
      login: sessionStorage.getItem("username"),
    }),
  });
  results = await results.json();
  results = results.grades;
  new_html = "";
  results.forEach((subject) => {
    new_html += "<tr>";
    for (let i = 0; i < 13; i++) {
      new_html += `<td>${subject[i]}</td>`;
      if (i === 12) {
        new_html += `<td><button class='edit_btn btn btn-warning' onclick='view(this)' id=${
          subject[0] + "Trend"
        }>${subject[0]}</button></td>`;
      }
    }
    if (subject[1] != "-") {
      new_html += `<td><button class='edit_btn btn btn-danger' onclick='edit_record(this)' id=${subject[0]}>Edit</button></td>`;
    } else {
      new_html += `<td><button class='edit_btn btn btn-danger' onclick='edit_record(this)' id=${subject[0]} disabled>Edit</button></td>`;
    }

    new_html += "</tr>";
  });
  document.getElementById("footer_call").classList.add("position-sticky");
  const my_table = document.getElementById("table_body");
  my_table.innerHTML = new_html;
};
let save_record = async (btn) => {
  let sum = 0;
  const fields = document.getElementsByClassName("editable-field");
  for (let i = 0; i < fields.length; i++) {
    sum += parseFloat(fields[i].value);
  }
  if (sum !== 100) {
    alert(`The sum of the fields must be equal to 100! Current Sum = ${sum}`);
    return;
  }

  btn.setAttribute("class", "edit_btn btn btn-danger");
  const btns_ = document.getElementsByClassName("edit_btn");
  for (let index = 0; index < btns_.length; index++)
    btns_[index].setAttribute("onclick", "edit_record(this)");

  btn.textContent = "Edit";

  const final = document.getElementById("final1");
  const oht = document.getElementById("oht1");
  const project = document.getElementById("project1");
  const lab = document.getElementById("lab1");
  const assign = document.getElementById("assign1");
  const quiz = document.getElementById("quiz1");

  const aggregate = final.parentElement.nextElementSibling;
  const students = aggregate.nextElementSibling;
  const predicted = students.nextElementSibling;
  const drop = predicted.nextElementSibling;
  const rise = drop.nextElementSibling;

  // Send the data to API
  final_score = final.value;
  oht_score = oht.value;
  project_score = project.value;
  lab_score = lab.value;
  assign_score = assign.value;
  quiz_score = quiz.value;

  const btns = document.getElementsByClassName("terms_radio");
  let index = 0;
  for (; index < btns.length; index++) {
    if (btns[index].checked) {
      break;
    }
  }
  term = btns[index].nextSibling.textContent.toLowerCase();
  subject = quiz.parentElement.previousElementSibling.textContent;

  let body = {
    term: term,
    id: sessionStorage.getItem("username"),
    login: sessionStorage.getItem("username"),
    subject: subject,
    quiz_weight: quiz_score,
    assign_weight: assign_score,
    lab_weight: lab_score,
    project_weight: project_score,
    midterm_weight: oht_score,
    finals_weight: final_score,
  };
  results = await fetch("http://127.0.0.1:8000/editWeightage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      term: term,
      login: sessionStorage.getItem("username"),
      subject: subject,
      quiz_weight: quiz_score,
      assign_weight: assign_score,
      lab_weight: lab_score,
      project_weight: project_score,
      midterm_weight: oht_score,
      finals_weight: final_score,
    }),
  });
  results = await results.json();
  results = results.result;
  new_html = "";

  // New set of data received from server have to send values for term and subject name for recal
  // Will be in the form of keypairs again

  quiz.parentElement.innerHTML = results[1];
  assign.parentElement.innerHTML = results[2];
  lab.parentElement.innerHTML = results[3];
  project.parentElement.innerHTML = results[4];
  oht.parentElement.innerHTML = results[5];
  final.parentElement.innerHTML = results[6];
  aggregate.innerHTML = results[7];
  students.innerHTML = results[8];
  predicted.innerHTML = results[9];
  drop.innerHTML = results[10];
  rise.innerHTML = results[11];
};

let edit_record = (btn) => {
  btn.textContent = "Save";

  // Disable the other editors
  const btns = document.getElementsByClassName("edit_btn");
  for (let index = 0; index < btns.length; index++) {
    btns[index].setAttribute("onclick", "");
  }

  // Start Save Listener
  btn.setAttribute("onclick", "save_record(this)");
  btn.setAttribute("class", "save_btn btn btn-success");

  const temp =
    btn.parentNode.previousElementSibling.previousElementSibling
      .previousElementSibling.previousElementSibling.previousElementSibling
      .previousElementSibling;

  const final = temp.previousElementSibling;
  const oht = final.previousElementSibling;
  const project = oht.previousElementSibling;
  const lab = project.previousElementSibling;
  const assign = lab.previousElementSibling;
  const quiz = assign.previousElementSibling;

  oht.innerHTML = `<input type='number' id='oht1' value=${oht.textContent} style="width: 4vw;" class="editable-field"\>`;
  project.innerHTML = `<input type='number' id='project1' value=${project.textContent} style="width: 4vw;" class="editable-field" \>`;
  lab.innerHTML = `<input type='number' id='lab1' value=${lab.textContent} style="width: 4vw;" class="editable-field" \>`;
  final.innerHTML = `<input type='number' id='final1' value=${final.textContent} style="width: 4vw;" class="editable-field" \>`;
  assign.innerHTML = `<input type='number' id='assign1' value=${assign.textContent} style="width:4vw;" class="editable-field" \>`;
  quiz.innerHTML = `<input type='number' id='quiz1' value=${quiz.textContent} style="width: 4vw;" class="editable-field" \>`;
};
