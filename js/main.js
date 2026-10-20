
/* =========================
   1. Firebase Imports
========================= */

import { initializeApp } from
  "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";

import {
  getDatabase,
  ref,
  onValue,
  runTransaction,
  get
} from
  "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";

import {
  getAuth,
  signInAnonymously
} from
  "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";


/* =========================
   2. Firebase Configuration
========================= */

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDoPCzdWu5osVKEt9iZUPQgvpHhpt6z5hY",
  authDomain: "al-safa-631c7.firebaseapp.com",
  projectId: "al-safa-631c7",
  storageBucket: "al-safa-631c7.firebasestorage.app",
  messagingSenderId: "704007329718",
  appId: "1:704007329718:web:40891b2297c2d34c255317",
  measurementId: "G-TF86Y03FRX"
};


/* =========================
   3. Initialize Firebase
========================= */

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);


/* =========================
   4. Get HTML Elements
========================= */

const stars = document.querySelectorAll(
  "#ratingStars button"
);

const averageRating = document.getElementById("averageRating");
const ratingCount = document.getElementById("ratingCount");
const ratingMessage = document.getElementById("ratingMessage");


/* =========================
   5. Variables
========================= */

let currentUser = null;
let selectedRating = 0;
let hasVoted = false;
let isReady = false;
let isSaving = false;


/* =========================
   6. Display Stars
========================= */

function showStars(value) {
  stars.forEach((star) => {
    const rating = Number(star.dataset.rating);

    star.classList.toggle("active", rating <= value);

    star.setAttribute(
      "aria-pressed",
      String(rating === value)
    );
  });
}


/* =========================
   7. Hover and Update Rating
========================= */

stars.forEach((star) => {

  // Hover effect
  star.addEventListener("mouseenter", () => {
    if (isReady && !isSaving) {
      showStars(Number(star.dataset.rating));
    }
  });

  // Select or edit rating
  star.addEventListener("click", async () => {

    if (!isReady || !currentUser) {
      ratingMessage.textContent =
        "خدمة التقييم لسه بتجهز، حاولي كمان شوية.";
      return;
    }

    if (isSaving) return;

    const value = Number(star.dataset.rating);

    if (!Number.isInteger(value) || value < 1 || value > 5) {
      return;
    }

    // Prevent repeated clicks while saving
    isSaving = true;

    stars.forEach((button) => {
      button.disabled = true;
    });

    ratingMessage.textContent = hasVoted
      ? "جاري تعديل تقييمك..."
      : "جاري حفظ تقييمك...";

    try {
      const result = await runTransaction(
        ref(db, `ratings/${currentUser.uid}`),

        (currentData) => {
          // Create a rating or update the existing rating
          return {
            stars: value
          };
        }
      );

      if (result.committed) {
        hasVoted = true;
        selectedRating = value;

        showStars(selectedRating);

        ratingMessage.textContent =
          "تم حفظ تقييمك بنجاح ❤️";
      } else {
        ratingMessage.textContent =
          "لم يتم حفظ التقييم. حاولي مرة أخرى.";

        showStars(selectedRating);
      }

    } catch (error) {
      console.error("Saving rating error:", error);

      ratingMessage.textContent =
        "تعذر حفظ التقييم. تأكدي من اتصال الإنترنت وإعدادات Firebase.";

      showStars(selectedRating);

    } finally {
      isSaving = false;

      stars.forEach((button) => {
        button.disabled = !isReady;
      });
    }
  });
});


/* =========================
   8. Reset Hover Effect
========================= */

document.getElementById("ratingStars").addEventListener(
  "mouseleave",
  () => {
    showStars(selectedRating);
  }
);


/* =========================
   9. Calculate Average Rating
========================= */

onValue(
  ref(db, "ratings"),

  (snapshot) => {
    const data = snapshot.val() || {};

    const values = Object.values(data)
      .map((item) => Number(item?.stars))
      .filter(
        (value) =>
          Number.isInteger(value) &&
          value >= 1 &&
          value <= 5
      );

    const count = values.length;

    const average = count
      ? values.reduce((sum, value) => sum + value, 0) / count
      : 0;

    averageRating.textContent = count
      ? average.toFixed(1)
      : "--";

    ratingCount.textContent = count;
  },

  (error) => {
    console.error("Loading ratings error:", error);

    ratingMessage.textContent =
      "تعذر تحميل التقييمات حاليًا.";
  }
);


/* =========================
   10. Initialize Authentication
========================= */

async function initializeRating() {
  try {
    const credential = await signInAnonymously(auth);

    currentUser = credential.user;

    // Check for an existing rating
    const existingRating = await get(
      ref(db, `ratings/${currentUser.uid}`)
    );

    if (existingRating.exists()) {
      const savedValue = Number(
        existingRating.val()?.stars
      );

      if (
        Number.isInteger(savedValue) &&
        savedValue >= 1 &&
        savedValue <= 5
      ) {
        hasVoted = true;
        selectedRating = savedValue;

        showStars(selectedRating);

        ratingMessage.textContent =
          "تقييمك محفوظ ❤️ تقدري تغيّريه في أي وقت.";
      } else {
        ratingMessage.textContent =
          "اختاري عدد النجوم لتحديث تقييمك.";
      }
    } else {
      ratingMessage.textContent = "اختاري عدد النجوم";
    }

    // Allow selecting and editing ratings
    isReady = true;

    stars.forEach((button) => {
      button.disabled = false;
    });

  } catch (error) {
    console.error("Authentication error:", error);

    ratingMessage.textContent =
      "تعذر الاتصال بخدمة التقييم. حاولي لاحقًا.";

    isReady = false;

    stars.forEach((button) => {
      button.disabled = true;
    });
  }
}

initializeRating();


// End Firebase

// navbar

const navbar = document.querySelector(".container-fluid"); 
const navMenu = document.getElementById("navbarNavAltMarkup"); 

navMenu.addEventListener("shown.bs.collapse", () => {
 navbar.style.setProperty("background-color", "white", "important");
});

navMenu.addEventListener("hidden.bs.collapse", () => {
     navbar.style.backgroundColor = "";
});

// End navbar



// Portfolio


document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".fa-delete-left");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modalEl = button.closest(".modal");
      if (modalEl) {
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide(); // هنا بقى الاسكرول بيرجع طبيعي
      }
    });
  });
});
// End Portfolio


// Contact 


let callUs = document.getElementById("callUs");

callUs.addEventListener("click", function (e) {
  if (e.target.closest("a")) return;

  let choice = prompt(
    "اختار الرقم اللي عايز تتصل بيه:\n" +
    "1- 01021010423\n" +
    "2- 01222707263\n\n" +
    "اكتب 1 أو 2"
  );

  if (choice === "1") {
    window.location.href = "tel:01021010423";
  } else if (choice === "2") {
    window.location.href = "tel:01222707263";
  }
});



// End Contact
