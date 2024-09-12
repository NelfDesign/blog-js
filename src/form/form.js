import "./form.scss";
import "/assets/styles/styles.scss";
import "/assets/javascripts/topbar.js";

const form = document.querySelector("form");
const errorElement = document.querySelector("#errors");
let errors = [];

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const entries = formData.entries();
  const article = Object.fromEntries(entries);

  if (formIsValid(article)) {
    //fetch
    try {
      const json = JSON.stringify(article);
      const response = await fetch("https://restapi.fr/api/article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: json,
      });
      const body = await response.json();
      console.log(body);
    } catch (error) {
        console.log('error = ', error);
    }
  }
});

const formIsValid = (article) => {
  if (!article.author || !article.category || !article.content || !article.img || !article.title) {
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
