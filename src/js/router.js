import Navigo from "navigo";
import { App } from "@capacitor/app";

const router = new Navigo("/");
const body = document.querySelector("body");

const render = (content) => (document.querySelector("#page_container").innerHTML = content);

router
  .on("/", (match) => {
    body.dispatchEvent(new CustomEvent("page-changed", { detail: { page: "Home", tab: 0 } }));
    updateTabbar(0);
    render(`<div class="page"><h1>Home</h1></div>`);
  })
  .on("/posts", (match) => {
    body.dispatchEvent(new CustomEvent("page-changed", { detail: { page: "Posts", tab: 1 } }));
    updateTabbar(1);
    render(`<div class="page"><div class="posts">
    <a href="/posts/1" data-navigo>Post 1</a>
    <a href="/posts/2" data-navigo>Post 2</a>
    <a href="/posts/3" data-navigo>Post 3</a>
    </div>
  </div>`);
  })
  .on("/settings", (match) => {
    body.dispatchEvent(new CustomEvent("page-changed", { detail: { page: "Settings", tab: 2 } }));
    updateTabbar(2);
    render(`<div class="page"><h1>Settings</h1></div>`);
  })
  .on("/posts/:id", (match) => {
    console.log(match);
    const id = match.data.id;
    body.dispatchEvent(new CustomEvent("page-changed", { detail: { page: `Post ${id}`, tab: 1, back: true } }));
    updateTabbar(1);
    render(`<div class="page"><h1>POST DETAILS: ${id}</h1></div>`);
  })
  .resolve();

function updateTabbar(activeIndex) {
  const tabs = document.getElementsByClassName("tab");

  for (let i = 0; i < tabs.length; i++) {
    if (i === activeIndex) {
      tabs[i].classList.add("tab-active");
      tabs[i].classList.remove("tab-button");
    } else {
      tabs[i].classList.add("tab-button");
      tabs[i].classList.remove("tab-active");
    }
  }
}

App.addListener("appUrlOpen", (event) => {
  const pathArray = event.url.split("capacitorvanilla://");
  if (pathArray.length > 1) {
    const url = pathArray.pop();
    router.navigate(url);
  }
});
