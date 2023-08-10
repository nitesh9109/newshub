let API_KEY = "bdc65cf922384c319a9731db119b2579";
let url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => {
  let top_headlines = "top-headlines";
  window.location.hash = top_headlines;
  fetchNews(top_headlines);
  // window.addEventListener("scroll", () => handleScroll(top_headlines));
  scrollToTop();
});

let isLoading = false;
var page = 1;

async function fetchNews(query, page = 1, callBack) {
  showLoadingAnimation();

  try {
    let res = await fetch(`${url}${query}&page=${page}&apiKey=${API_KEY}`);

    const data = await res.json();

    bindData(data.articles, page);

    if (typeof callBack === "function") {
      callBack();
    }

    hideLoadingAnimation();
  } catch (e) {
    alert("Too many request in given time");
  }
}

function bindData(articles, page) {
  let cardContainer = document.querySelector(".cards");

  if (page <= 1) {
    cardContainer.innerHTML = "";
  }

  articles.forEach((res) => {
    if (!res.urlToImage) {
      return;
    }
    let card = articleElement(res);
    cardContainer.appendChild(card);
  });
}

function articleElement(article) {
  let articleElement = document.createElement("div");
  articleElement.classList.add("card");

  let imageContainer = document.createElement("div");
  imageContainer.classList.add("img");
  let contentContainer = document.createElement("div");
  contentContainer.classList.add("content");

  let imageElement = document.createElement("img");
  imageElement.src = article.urlToImage;
  imageContainer.appendChild(imageElement);

  let titleElement = document.createElement("h3");
  titleElement.innerHTML = article.title;
  titleElement.classList.add("title");
  contentContainer.appendChild(titleElement);

  let sourceElement = document.createElement("h6");
  sourceElement.innerHTML = `${getArticleSource(
    article["source"]
  )} -${getIndianTime(article.publishedAt)}`;
  sourceElement.classList.add("source");
  contentContainer.appendChild(sourceElement);

  let descElement = document.createElement("p");
  descElement.innerHTML = article.description;
  descElement.classList.add("description");
  contentContainer.appendChild(descElement);

  articleElement.append(imageContainer, contentContainer);

  articleElement.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
  return articleElement;
}

function getIndianTime(publishedAt) {
  const date = new Date(publishedAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const capitalizedDateString = date.replace(/\b(?:am|pm)\b/gi, (match) =>
    match.toUpperCase()
  );

  return capitalizedDateString;
}

function getArticleSource(article) {
  return article["id"] ?? article["name"];
}

let currentSelected = null;

function onlinkClick(id) {
  if (id == "home") {
    window.location.hash = "top-headlines";
    id = "top-headlines";
    currentSelected?.classList.remove("active");
    fetchNews(id);
    scrollToTop();
    return;
  }
  fetchNews(id);
  const navItem = document.getElementById(id);
  currentSelected?.classList.remove("active");
  currentSelected = navItem;
  currentSelected.classList.add("active");
  scrollToTop();
}

let inputText = document.getElementById("inputText");
let submitBtn = document.getElementById("submitBtn");

let activeSelected = null;

submitBtn.addEventListener("click", () => {
  if (!inputText.value) return;
  currentSelected?.classList.remove("active");
  activeSelected?.classList.remove("active");
  page = 1;
  window.location.hash = inputText.value;
  fetchNews(inputText.value);
  scrollToTop();
  window.addEventListener("scroll", () => handleScroll(inputText.value));
});

inputText.addEventListener("keypress", (e) => {
  if (!inputText.value) return;
  if (e.key == "Enter") {
    currentSelected?.classList.remove("active");
    activeSelected?.classList.remove("active");
    page = 1;
    window.location.hash = inputText.value;
    fetchNews(inputText.value);
    scrollToTop();
    window.addEventListener("scroll", () => handleScroll(inputText.value));
  }
});

const loadingSpinner = document.querySelector("figure");

function showLoadingAnimation() {
  loadingSpinner.style.display = "block";
}

function hideLoadingAnimation() {
  loadingSpinner.style.display = "none";
}

function handleScroll(id) {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

  if (id == "home") {
    window.location.hash = "top-headlines";
  }

  const threshold = 100;

  if (!isLoading && distanceToBottom < threshold) {
    isLoading = true;
    fetchNews(id, page, () => {
      isLoading = false;
      page++;
    });
  }
}

window.addEventListener("scroll", () => {
  let hashFragment = window.location.hash.slice(1);
  handleScroll(hashFragment);
});

window.addEventListener("hashchange", handleHashChange);

function handleHashChange() {
  const hashFragment = window.location.hash.slice(1);

  switch (hashFragment) {
    case "home":
    case "headlines":
    case "politics":
    case "tech":
    case "india":
      page = 1;
      handleScroll(hashFragment);
      break;
  }
}

function scrollToTop() {
  window.scrollTo(0, 0);
}

// function reload() {
//   window.location.reload();
// }
