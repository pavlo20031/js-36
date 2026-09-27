import debounce from "lodash.debounce";
import * as PNotifyMobile from "@pnotify/mobile/dist/PNotifyMobile.js";
import { success, error, info } from "@pnotify/core/dist/PNotify.js";
import "@pnotify/mobile/dist/PNotifyMobile.css";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/mobile/dist/PNotifyMobile.css";
import { fetchCountries } from "./js/fetchCountries";

const inputRef = document.querySelector(".search-input");
const listRef = document.querySelector(".list");

inputRef.addEventListener(
  "input",
  debounce((event) => {
    listRef.innerHTML = "";
    let search = event.target.value.toLowerCase().trim();
    fetchCountries(search)
      .then((data) => {
        if (data.data.objects.length > 10) {
          info({
            text: "Напишіть більше букв",
            delay: 1200,
          });
        } else if (
          data.data.objects.length < 10 &&
          data.data.objects.length > 1
        ) {
          listRef.innerHTML = "";
          const createMarkup = data.data.objects
            .map(({ names: { common } }) => {
              return `
                  <li class="list-items">
                    <p>${common}</p>
                  </li>
        `;
            })
            .join("");

          listRef.innerHTML = createMarkup;
        } else if (data.data.objects.length === 1) {
          listRef.innerHTML = "";
          success({
            text: "Інформація про одну країну",
            delay: 1200,
          });
          const createMarkups = data.data.objects
            .map(
              ({
                names: { common },
                capitals,
                population,
                flag: { url_png },
                languages,
              }) => {
                return `<li class="list-item">
                        <h2 class="list-title">${common}</h2>
                        <div class="list-box">
                        <div>
                          <p><span class="list-text">Capital:</span> ${capitals[0].name}</p>  
                          <p class="list-subtitle"><span class="list-text">Population:</span> ${population}</p>
                          <p class="list-text">Languages:</p>
                          <ul class="list-lister">${languages
                            .map(({ name }) => {
                              return `<li>
                                      <p>${name}</p>
                                    </li>`;
                            })
                            .join("")}</ul>
                        </div>
                        <img class="list-img" src="${url_png}" alt="${common}">
                        </div>
                      </li>`;
              },
            )
            .join("");
          listRef.innerHTML = createMarkups;
        } else if (!data.data.objects || data.data.objects.length === 0) {
          error({
            text: "Не знайдено країн, перевірте чи правильно ви написали",
            delay: 3000,
          });
        }
      })
  }, 500),
);
