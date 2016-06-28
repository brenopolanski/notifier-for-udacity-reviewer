function loadOptions() {
  var devToken = localStorage.udacityReviewDevToken;
  if (typeof devToken === "undefined") {
    devToken = '';
  }
  document.getElementById("dev-token").value = devToken;
}

function saveOptions() {
  var devToken = document.getElementById("dev-token").value;
  localStorage.udacityReviewDevToken = devToken;
}

window.addEventListener('load', function () {
  loadOptions();
  document.getElementById("save-btn").addEventListener("click", saveOptions);
}, false );
