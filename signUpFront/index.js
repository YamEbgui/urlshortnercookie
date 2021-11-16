import axios from "axios";
import "./style.scss";

const Base_Server_Path = "";

async function creatrNewUser(event) {
  event.preventDefualt();
  const newUser = {
    userName: document.getElementById("username").value,
    password: document.getElementById("password").value,
    email: document.getElementById("email").value,
  };
  try {
    await axios.post(`${Base_Server_Path}/signup`, {
      newUser,
    });
    window.location.href = "/login";
  } catch (err) {
    alert("sign up failed");
  }
}

document.getElementById("signup").addEventListener("click", creatrNewUser);
