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