//import section
import "./styles.scss";
import axios from "axios";

//DOM elements section
const submitButton = document.querySelector("btn");

//variables section
const baseServerPath = "https://sexyurlshortner.herokuapp.com";

//send get post requst with the origin URL and return new sequence for route to this URL.
const getShortenVersion = async (_originUrl) => {
  try {
    const body = { originUrl: `${_originUrl}` };
    const response = await axios.post(
      `${baseServerPath}` + "/api/shorturl/",
      body,
      { headers: { "content-type": "application/json" } }
    );
    return response.data;
  } catch (err) {
    clearResultDiv();
    const errorsDiv = document.querySelector(".errors");
    errorsDiv.textContent = err;
    setTimeout(() => {
      errorsDiv.firstChild.remove();
    }, 3000);
  }
  throw "INVAILD URL";
};

// delete elements from the results div and leave it empty
const clearResultDiv = () => {
  const result = document.getElementById("resultUrl");
  result.textContent = "";
};

// creat link to the new URL for route to the origin Url and button for stats.
const createResultDiv = (element, newSequence) => {
  //create link
  element.appendChild(
    createElement("a", `${baseServerPath}/${newSequence}`, ["shortLink"], {
      href: `${baseServerPath}/${newSequence}`,
    })
  );
  //create button
  element.appendChild(
    createElement(
      "button",
      [createElement("span", "stats")],
      ["statsBtn", "btn"],
      { "data-shorturl": newSequence }
    )
  );
  element.children[1].addEventListener("click", (event) => handlerStat(event));
};

//handler function to the Submit button the create new URL and show it.
const serveUrl = async () => {
  const inputValue = document.getElementById("urlInput").value;
  const newSequence = await getShortenVersion(inputValue);
  const result = document.getElementById("resultUrl");
  clearResultDiv();
  createResultDiv(result, newSequence);
  //.append(`${baseServerPath}` + `/${originUrl}`);
};

//request for the server to get stats of the sequence that represents the origin URL
const getStats = async (sequence) => {
  try {
    const stats = await axios.get(`${baseServerPath}/api/stats/${sequence}`);
    return stats;
  } catch (err) {
    throw { status: 500, message: { error: "Cant Reach Stats" } };
  }
};

//handler for click on the stats button that open pop up card with stats
const handlerStat = async (event) => {
  let sequence;
  if (event.target.tagName === "SPAN") {
    sequence = event.target.parentElement.dataset.shorturl;
  } else {
    sequence = event.target.dataset.shorturl;
  }
  const stats = await getStats(sequence);
  const modal = document.getElementById("modal");
  modal.style.display = "flex";
  document.getElementById("wrapper").style.display = "none";
  for (let stat in stats.data) {
    const statData = createElement(
      "LI",
      [`${stat}: ${stats.data[stat]}`],
      ["statLi"]
    );
    modal.children[1].append(statData);
  }
};

//handler function to close the pop up stats viewer
const closeStatsInfo = () => {
  const modal = document.getElementById("modal");
  document.querySelector(".details-modal-content").textContent = "";
  modal.style.display = "none";
  document.getElementById("wrapper").style.display = "flex";
};

//function that create create new element by getting propertys
const createElement = (
  tagName,
  children = [],
  classes = [],
  attributes = {}
) => {
  // create new element in more comfortable
  const el = document.createElement(tagName);
  for (let child of children) {
    // append childs of element
    el.append(child);
  }
  for (let cls of classes) {
    // add all the classes to the element
    el.classList.add(cls);
  }
  for (let attr in attributes) {
    // add all attributes to the element
    el.setAttribute(attr, attributes[attr]);
  }
  return el;
};

//eventlisteners sections
document.getElementById("submitBtn").addEventListener("click", serveUrl);
document
  .getElementById("closeStatInfo")
  .addEventListener("click", () => closeStatsInfo());
