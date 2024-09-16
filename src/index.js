import "/assets/styles/styles.scss";
import "./index.scss";
import "./assets/javascripts/topbar.js";
import { openModal } from "./assets/javascripts/modal.js";

const articleContainerElement = document.querySelector(".articles-container");
const categoriesContainerElement = document.querySelector(".categories");
const selectElement = document.querySelector("select");
let filter;
let articles;
let sortBy = "desc";

selectElement.addEventListener("change", () => {
  sortBy = selectElement.value;
  fetchArticles();
});

const createArticles = () => {
  const articleDOM = articles
    .filter((article) => {
      if (filter) {
        return article.category === filter;
      } else {
        return true;
      }
    })
    .map((article) => {
      const articleDOM = document.createElement("div");
      articleDOM.classList.add("article");
      articleDOM.innerHTML = `
        <img src="${article.img}" alt="profile"/>
        <h2>${article.title}</h2>
        <p class="article-author">${article.author} - ${new Date(
        article.createdAt
      ).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}</p>
        <p class="article-content"> ${article.content}</p>
        <div class="article-actions">
          <button class="btn btn-danger" data-id=${
            article._id
          }>Supprimer</button>
          <button class="btn btn-primary" data-id=${
            article._id
          } >Modifier</button>
        </div>
    `;
      return articleDOM;
    });
  articleContainerElement.innerHTML = "";
  articleContainerElement.append(...articleDOM);

  //suppression d'elements au click sur supprimer
  const deleteButtons = articleContainerElement.querySelectorAll(".btn-danger");
  const editButtons = articleContainerElement.querySelectorAll(".btn-primary");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const result = await openModal(
        "Etes vous sûr de vouloir supprimer votre article?"
      );
      if (result === true) {
        try {
          const target = event.target;
          const articleId = target.dataset.id;
          const response = await fetch(
            `https://restapi.fr/api/article/${articleId}`,
            {
              method: "DELETE",
            }
          );
          let articles = await response.json();

          fetchArticles();
        } catch (error) {
          console.log("error in delete:", error);
        }
      }
    });
  });

  editButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const target = event.target;
      const articleId = target.dataset.id;
      location.assign(`/form/form.html?id=${articleId}`);
    });
  });
};

const displayMenuCategories = (catagoriesArr) => {
  const liElement = catagoriesArr.map((arr) => {
    const li = document.createElement("li");
    li.innerHTML = `${arr[0]} (<strong>${arr[1]}</strong>)`;
    if (arr[0] === filter) {
      li.classList.add("active");
    }
    li.addEventListener("click", (event) => {
      if (filter === arr[0]) {
        filter = null;
        li.classList.remove("active");
        createArticles();
      } else {
        filter = arr[0];
        liElement.forEach((li) => {
          li.classList.remove("active");
        });
        li.classList.add("active");
        createArticles();
      }
    });
    return li;
  });

  categoriesContainerElement.innerHTML = "";
  categoriesContainerElement.append(...liElement);
};

const createMenuCategories = () => {
  const categories = articles.reduce((acc, article) => {
    if (acc[article.category]) {
      acc[article.category]++;
    } else {
      acc[article.category] = 1;
    }
    return acc;
  }, {});

  const categoriesArr = Object.keys(categories)
    .map((category) => {
      return [category, categories[category]];
    })
    .sort((a, b) => a[0].localeCompare(b[0]));
  displayMenuCategories(categoriesArr);
};

const fetchArticles = async () => {
  try {
    const response = await fetch(
      `https://restapi.fr/api/article?sort=createdAt:${sortBy}`
    );
    articles = await response.json();
    // Restapi retourne un objet s'il n'y a qu'un seul article
    // nous devons donc le transformer en tableau :
    if (!Array.isArray(articles)) {
      articles = [articles];
    }
    createArticles();
    createMenuCategories();
  } catch (error) {
    console.log("error in get:", error);
  }
};

fetchArticles();
