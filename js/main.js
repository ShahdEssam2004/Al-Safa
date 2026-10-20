// firebase
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


// 1. Firebase Configuration

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



// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);


// 3. Get HTML Elements
const stars = document.querySelectorAll(
  "#ratingStars button"
);

const averageRating = document.getElementById("averageRating");
const ratingCount = document.getElementById("ratingCount");
const ratingMessage = document.getElementById("ratingMessage");


// 4. Variables
let currentUser = null;
let selectedRating = 0;
let hasVoted = false;
let isReady = false;


// 5. Display Stars
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


// 6. Hover Effect
stars.forEach((star) => {
  star.addEventListener("mouseenter", () => {
    if (!hasVoted) {
      showStars(Number(star.dataset.rating));
    }
  });

  // 7. Save Rating
  star.addEventListener("click", async () => {
    if (!isReady || !currentUser) {
      ratingMessage.textContent =
        "خدمة التقييم لسه بتجهز، حاولي كمان شوية.";
      return;
    }

    if (hasVoted) {
      ratingMessage.textContent =
        "سبق لكِ تقييم الموقع بالفعل ❤️";
      return;
    }

    const value = Number(star.dataset.rating);

    if (!Number.isInteger(value) || value < 1 || value > 5) {
      return;
    }

    // Prevent repeated clicks while saving
    stars.forEach((button) => {
      button.disabled = true;
    });

    ratingMessage.textContent = "جاري حفظ تقييمك...";

    try {
      const result = await runTransaction(
        ref(db, `ratings/${currentUser.uid}`),
        (currentData) => {
          // Each anonymous user can save one rating
          if (currentData !== null) {
            return;
          }

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
          "شكرًا ليكي على تقييمك ❤️";
      } else {
        // A rating already exists for this user
        hasVoted = true;

        const savedValue = Number(result.snapshot.val()?.stars);

        if (savedValue >= 1 && savedValue <= 5) {
          selectedRating = savedValue;
          showStars(selectedRating);
        }

        ratingMessage.textContent =
          "سبق لكِ تقييم الموقع من هذا الحساب ❤️";
      }
    } catch (error) {
      console.error("Saving rating error:", error);

      ratingMessage.textContent =
        "تعذر حفظ التقييم. تأكدي من إعدادات Firebase.";

      // Allow the user to retry
      stars.forEach((button) => {
        button.disabled = false;
      });
    }
  });
});


// 8. Reset Hover Effect
document.getElementById("ratingStars").addEventListener(
  "mouseleave",
  () => {
    showStars(selectedRating);
  }
);


// 9. Listen for All Ratings and Calculate Average
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


// 10. Initialize Anonymous Authentication
async function initializeRating() {
  try {
    const credential = await signInAnonymously(auth);

    currentUser = credential.user;

    // Check whether this user has already rated
    const existingRating = await get(
      ref(db, `ratings/${currentUser.uid}`)
    );

    if (existingRating.exists()) {
      hasVoted = true;

      selectedRating = Number(
        existingRating.val().stars
      );

      showStars(selectedRating);

      ratingMessage.textContent =
        "شكرًا، إنتِ قيّمتي الموقع بالفعل ❤️";
    } else {
      ratingMessage.textContent = "اختاري عدد النجوم";
    }

    isReady = true;

    if (hasVoted) {
      stars.forEach((button) => {
        button.disabled = true;
      });
    }
  } catch (error) {
    console.error("Authentication error:", error);

    ratingMessage.textContent =
      "تعذر الاتصال بخدمة التقييم. حاولي لاحقًا.";

    isReady = false;
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
