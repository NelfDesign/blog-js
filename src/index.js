import "/assets/styles/styles.scss";
import "./index.scss";
import "./assets/javascripts/topbar.js";

const articleContainerElement = document.querySelector(".articles-container");

const createArticles = (articles) => {
  const articleDOM = articles.map((article) => {
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

const fetchArticles = async () => {
  try {
    const response = await fetch("https://restapi.fr/api/article");
    let articles = await response.json();
    // Restapi retourne un objet s'il n'y a qu'un seul article
    // nous devons donc le transformer en tableau :
    if (!Array.isArray(articles)) {
      articles = [articles];
    }
    console.log(articles);
    createArticles(articles);
  } catch (error) {
    console.log("error in get:", error);
  }
};

fetchArticles();
