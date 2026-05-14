/* ================================================
   EXIT INTENT POPUP JS - AGS Business Agency
   Powered by Web3Forms
   ================================================ */

(function () {

  // --- CONFIG ---
  var WEB3FORMS_API_KEY = "88d337cb-69e8-40df-9d83-46075f705646"; // 👈 Replace this
  var POPUP_DELAY_MS    = 3000;
  var COOLDOWN_DAYS     = 7;
  var STORAGE_KEY       = "ags_popup_closed";

  // --- HELPERS ---
  function setCookie(name, value, days) {
    var expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + "=" + value + "; expires=" + expires + "; path=/";
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  }

  function showPopup() {
    var overlay = document.getElementById("exit-popup-overlay");
    if (overlay) {
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  function hidePopup() {
    var overlay = document.getElementById("exit-popup-overlay");
    if (overlay) {
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }
    setCookie(STORAGE_KEY, "1", COOLDOWN_DAYS);
  }

  function showSuccessMessage() {
    var form    = document.getElementById("exit-popup-form");
    var success = document.getElementById("exit-success");
    var btn     = document.querySelector(".exit-submit-btn");

    if (form)    form.style.display    = "none";
    if (success) success.style.display = "block";
    if (btn)     btn.disabled          = false;

    // Reset button text
    if (btn) btn.textContent = "🚀 Claim My Free Audit";

    // Auto-close after 5 seconds
    setTimeout(function () {
      hidePopup();
      if (form)    form.style.display    = "flex";
      if (success) success.style.display = "none";
    }, 5000);

    setCookie(STORAGE_KEY, "1", COOLDOWN_DAYS);
  }

  function showError(message) {
    var btn = document.querySelector(".exit-submit-btn");
    if (btn) {
      btn.textContent = "❌ " + message + " — Try Again";
      btn.disabled    = false;
      setTimeout(function () {
        btn.textContent = "🚀 Claim My Free Audit";
      }, 3000);
    }
  }

  // --- INIT ---
  document.addEventListener("DOMContentLoaded", function () {

    // Don't show if recently dismissed
    if (getCookie(STORAGE_KEY)) return;

    var popupTriggered = false;

    // Activate exit-intent only after delay
    setTimeout(function () {

      // Desktop: mouse leaves top of viewport
      document.addEventListener("mouseleave", function (e) {
        if (e.clientY <= 5 && !popupTriggered) {
          popupTriggered = true;
          showPopup();
        }
      });

      // Mobile: user scrolls back up quickly
      var lastScrollY  = window.scrollY;
      var scrollUpCount = 0;

      window.addEventListener("scroll", function () {
        var currentScrollY = window.scrollY;
        if (currentScrollY < lastScrollY) {
          scrollUpCount++;
          if (scrollUpCount >= 3 && !popupTriggered && currentScrollY < 300) {
            popupTriggered = true;
            showPopup();
          }
        } else {
          scrollUpCount = 0;
        }
        lastScrollY = currentScrollY;
      });

    }, POPUP_DELAY_MS);

    // --- CLOSE BUTTON ---
    var closeBtn = document.getElementById("exit-close-btn");
    if (closeBtn) closeBtn.addEventListener("click", hidePopup);

    // --- CLOSE ON OVERLAY CLICK ---
    var overlay = document.getElementById("exit-popup-overlay");
    if (overlay) {
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) hidePopup();
      });
    }

    // --- CLOSE ON ESC KEY ---
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hidePopup();
    });

    // --- FORM SUBMISSION via Web3Forms ---
    var form = document.getElementById("exit-popup-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        var name    = document.getElementById("popup-name").value.trim();
        var email   = document.getElementById("popup-email").value.trim();
        var website = document.getElementById("popup-website").value.trim();
        var btn     = document.querySelector(".exit-submit-btn");

        if (!name || !email) return;

        // Show loading state
        if (btn) {
          btn.textContent = "Sending...";
          btn.disabled    = true;
        }

        // Build form data for Web3Forms
        var formData = {
          access_key: WEB3FORMS_API_KEY,
          subject:    "🔥 New Free Audit Request — AGS Website",
          from_name:  "AGS Website Popup",
          name:       name,
          email:      email,
          website:    website || "Not provided",
          message:    name + " requested a FREE Website Audit via the exit popup.\n\nEmail: " + email + "\nWebsite: " + (website || "Not provided"),
          // Optional: redirect after success (leave empty to handle in JS)
          redirect:   "false"
        };

        fetch("https://api.web3forms.com/submit", {
          method:  "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body:    JSON.stringify(formData)
        })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (data.success) {
            showSuccessMessage();
          } else {
            console.error("Web3Forms error:", data);
            showError("Something went wrong");
          }
        })
        .catch(function (err) {
          console.error("Network error:", err);
          showError("Network error");
        });

      });
    }

  });

})();