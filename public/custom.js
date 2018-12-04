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

function readEnglish() {
  var e = document.getElementsByClassName("englishDiv");
  for (var i=0; i<e.length; i++) {
    e[i].style.display = "block";
  }
  var s = document.getElementsByClassName("spanishDiv");
  for (var i=0; i<s.length; i++) {
    s[i].style.display = "none";
  }
}

function readSpanish() {
  var e = document.getElementsByClassName("englishDiv");
  for (var i=0; i<e.length; i++) {
    e[i].style.display = "none";
  }
  var s = document.getElementsByClassName("spanishDiv");
  for (var i=0; i<s.length; i++) {
    s[i].style.display = "block";
  }
}
