const form = document.querySelector("#updateForm");
const submitBtn = form.querySelector("input[type='submit']");
form.addEventListener("change", function () {
  submitBtn.removeAttribute("disabled");
  form.submit();
});
