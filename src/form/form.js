import "./form.scss";
import "/assets/styles/styles.scss";
import "/assets/javascripts/topbar.js";

const form = document.querySelector("form");
const errorElement = document.querySelector("#errors");
const cancelButton = document.querySelector(".btn-secondary");
let errors = [];
let articleId;

// Nous allons créer une fonction asynchrone que nous invoquons de suite.
// Nous parsons l’URL de la page et vérifions si nous avons un paramètre id.
// Si nous avons un id, nous récupérons l’article correspondant.
const initForm = async () => {
  const params = new URL(location.href);
  articleId = params.searchParams.get("id");
  if (articleId) {
    try {
      const response = await fetch(
        `https://restapi.fr/api/article/${articleId}`
      );
      if (response.status < 300) {
        const article = await response.json();
        fillForm(article);
      }
    } catch (error) {}
  }
};

initForm();

// Nous remplissons tous les champs de notre formulaire en créant des références
// et en utilisant les informations récupérées du serveur.
const fillForm = (article) => {
  const author = document.querySelector('input[name="author"]');
  const img = document.querySelector('input[name="img"]');
  const category = document.querySelector('input[name="category"]');
  const title = document.querySelector('input[name="title"]');
  const content = document.querySelector("textarea");
  author.value = article.author || "";
  img.value = article.img || "";
  category.value = article.category || "";
  title.value = article.title || "";
  content.value = article.content || "";
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const entries = formData.entries();
  const article = Object.fromEntries(entries);

  if (formIsValid(article)) {
    //fetch
    try {
      const json = JSON.stringify(article);
      let response;
      if (articleId) {
        response = await fetch(`https://restapi.fr/api/article/${articleId}`, {
          method: "PATCH",
          body: json,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        response = await fetch("https://restapi.fr/api/article", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: json,
        });
      }

      if (response.status < 300) {
        location.assign("/index.html");
      }
    } catch (error) {
      console.log("error = ", error);
    }
  }
});

cancelButton.addEventListener("click", (event) => {
  event.preventDefault();
  location.assign("/index.html");
});

const formIsValid = (article) => {
  errors = [];
  if (
    !article.author ||
    !article.category ||
    !article.content ||
    !article.img ||
    !article.title
  ) {
    errors.push("Tous les champs doivent être remplis");
  }
  if (article.content.length < 20) {
    errors.push("Le contenu de votre article est trop court !");
  } else {
    errors = [];
  }
  if (errors.length) {
    let errorHtml = "";
    errors.forEach((e) => {
      errorHtml += `<li>${e}</li>`;
    });
    errorElement.innerHTML = errorHtml;
    return false;
  } else {
    errorElement.innerHTML = "";
    return true;
  }
};
