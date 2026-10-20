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
