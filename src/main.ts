import { getImagesByQuery } from "./pixabay-api";
import { initRender } from "./render-functions";
import Pagination from "./pagination";

const pagination = new Pagination();
let query = "";

const searchForm = document.querySelector<HTMLFormElement>(".form");
const loadMoreButton = document.querySelector<HTMLButtonElement>(".load-more");
const gallery = document.querySelector<HTMLDivElement>(".gallery");
const loader = document.querySelector<HTMLDivElement>(".loader");


if (!searchForm) throw new Error("Missing .form element in HTML");
if (!loadMoreButton) throw new Error("Missing .load-more element in HTML");
if (!gallery) throw new Error("Missing .gallery element in HTML");
if (!loader) throw new Error("Missing .loader element in HTML");

const ui = initRender({
  gallery,
  loader,
  loadMoreButton,
});

searchForm.addEventListener("submit", onFormSubmit);
loadMoreButton.addEventListener("click", onLoadMoreClick);

async function onFormSubmit(event: Event) {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  query = (formData.get("search-text") as string).trim();

  if (!query) {
    ui.showToast("Please enter a search query.");
    return;
  }

  pagination.reset();
  ui.clearGallery();
  ui.hideLoadMoreButton();

  await fetchAndRender();
  form.reset();
}

async function onLoadMoreClick() {
  pagination.next();
  await fetchAndRender();
}
console.log("Pixabay key:", import.meta.env.VITE_PIXABAY_API_KEY);

async function fetchAndRender() {
  const isInitial = pagination.current === 1;

  try {
    ui.showLoader();
    ui.hideLoadMoreButton();

    const data = await getImagesByQuery(query, pagination.current);

    if (isInitial && data.hits.length === 0) {
      ui.showToast(
        "There are no images matching your search query. Try again!"
      );
      return;
    }

    ui.createGallery(data.hits);

    if (pagination.isEnd(data.totalHits)) {
      ui.showToast("You've reached the end of search results.");
      return;
    }

    ui.showLoadMoreButton();
  } catch {
    ui.showToast("An error occurred while fetching images. Try again.");
  } finally {
    ui.hideLoader();
  }
}
