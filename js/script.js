// Find our date picker inputs on the page
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days
// - Restrict dates to NASA's image archive
setupDateInputs(startInput, endInput);

const API_KEY = "cb2lwjHyTWHMDTAKsEKCIbOMpa0YUe73jqTXpV8w";

const loadBtn = document.getElementById("loadBtn");
const gallery = document.getElementById("gallery");
const loadingMessage = document.getElementById("loadingMessage");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalDesc = document.getElementById("modalDesc");
const closeModal = document.getElementById("closeModal");

// Random space fact (shows once on page load)
const facts = [
  "A day on Venus is longer than a year on Venus.",
  "Neutron stars can spin hundreds of times per second.",
  "Space is completely silent.",
  "The footprints on the Moon can last for millions of years.",
  "More stars exist in the universe than grains of sand on Earth."
];

const randomFact = facts[Math.floor(Math.random() * facts.length)];
loadingMessage.insertAdjacentHTML(
  "beforebegin",
  `<p id="spaceFact">🌌 Did You Know? ${randomFact}</p>`
);

// Button click
loadBtn.addEventListener("click", fetchData);

function fetchData() {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    alert("Please select a valid date range.");
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end - start;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays > 8) {
    loadingMessage.textContent = "Please choose a date range of 9 days or less.";
    gallery.innerHTML = "";
    return;
  }

  loadingMessage.textContent = "🔄 Loading space photos...";
  gallery.innerHTML = "";

  fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`)
    .then(response => response.json())
    .then(data => {
      loadingMessage.textContent = "";
      displayGallery(data);
    })
    .catch(error => {
      loadingMessage.textContent = "Error loading data.";
      console.error(error);
    });
}

function displayGallery(data) {
  gallery.innerHTML = "";

  data.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card");

    let mediaHTML = "";

    if (item.media_type === "image") {
      mediaHTML = `<img src="${item.url}" alt="${item.title}">`;
    } else {
      mediaHTML = `<a href="${item.url}" target="_blank" rel="noopener noreferrer">🎥 Watch Video</a>`;
    }

    card.innerHTML = `
      ${mediaHTML}
      <h3>${item.title}</h3>
      <p>${item.date}</p>
    `;

    card.addEventListener("click", () => openModal(item));

    gallery.appendChild(card);
  });
}

function openModal(item) {
  modal.classList.remove("hidden");

  if (item.media_type === "image") {
    modalImg.src = item.url;
    modalImg.style.display = "block";
  } else {
    modalImg.style.display = "none";
  }

  modalTitle.textContent = item.title;
  modalDate.textContent = item.date;

  if (item.media_type === "video") {
    modalDesc.innerHTML = `
      <p style="margin-bottom: 12px;">${item.explanation}</p>
      <p><a href="${item.url}" target="_blank" rel="noopener noreferrer">🎥 Open Video</a></p>
    `;
  } else {
    modalDesc.textContent = item.explanation;
  }
}

// Close modal with X
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Close modal when clicking outside modal content
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
});

// Optional: close modal with Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.classList.contains("hidden")) {
    modal.classList.add("hidden");
  }
});