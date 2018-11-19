let currOpen;

function openModal(id) {
  console.log("open modal");
  var m = "modal"+id[id.length-1];
	var modal = document.getElementById(m);
  console.log(m);
  currOpen = modal;
	modal.style.display = "block";
}

function closeModal() {
	currOpen.style.display = "none";
}

document.addEventListener('click', function (event) {
  if (event.target == currOpen) {
		currOpen.style.display = "none";
	}
}, false);
