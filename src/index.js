const toyCollection = document.querySelector("#toy-collection");
let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.querySelector("#new-toy-btn");
    const toyFormContainer = document.querySelector(".container");
    addBtn.addEventListener("click", () => {
        // hide & seek with the form
        addToy = !addToy;
        if (addToy) {
            toyFormContainer.style.display = "block";
        } else {
            toyFormContainer.style.display = "none";
        }
    });

    // GET request to fetch all the toy objects, with the response data, make a <div class="card"> for each toy and add it to the toy-collection div

    fetch("http://localhost:3000/toys", {
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {

            data.forEach(toy => {
                const card = document.createElement("div");
                card.classList.add("card");
                card.innerHTML = `
    <div class="card-body">
      <h2 class="card-title">${toy.name}</h5>
      <img class="toy-avatar" src="${toy.image}" alt="${toy.name}" >
      <p>${toy.likes}</p>
      <button type="button"  class="like-btn" id="${toy.id}">Like ❤️</button>
      `
                toyCollection.appendChild(card);

                // Add event listener for the like button
                card.querySelector(".like-btn").addEventListener("click", (e) => {
                    e.preventDefault();
                    const id = e.target.id;
                    const card = e.target.parentElement;
                    const like = parseInt(card.querySelector('p').innerText) + 1;

                    fetch(`http://localhost:3000/toys/${id}`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json"
                            },
                            body: JSON.stringify({
                                "likes": like
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            card.querySelector('p').innerText = `${like}`;
                        })
                })
            })
        })

    // When a user submits the toy form, two things should happen: POST request to create a new toy, with the response data, 
    // toy should be added to the toy-collection WITHOUT reloading the page

    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const toyName = document.querySelector('#input-text').value;
        const toyImage = document.querySelector('#input-image').value;

        fetch("http://localhost:3000/toys", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                "name": toyName,
                "image": toyImage,
                "likes": 0
            })

        })

    })

})