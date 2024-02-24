//------------------| varaibles |----------------//
let $ = document;
let addBoxEl = $.querySelector(".add-box");
let wrapperEl = $.querySelector(".wrapper");
let popupBoxEl = $.querySelector(".popup-box");
let popupEl = $.querySelector(".popup");
let popupTitleEl = $.querySelector("#popupTitle");
let popupBtnEl = $.querySelector("#popupBtn");
let popupInpTitleEl = $.querySelector("#popupInpTitle");
let popupInpTextEl = $.querySelector("#popupInpText");
let closePopupBtnEl = $.querySelector("#closePopupBtn");
let notes = [];
let isUpdate = false,
  updateId = null;
//------------------| functions |----------------//
function addToArr(noteTitle, noteDescription, noteArr) {
  noteArr.push({
    id: notes.length + 1,
    Title: noteTitle,
    desc: noteDescription,
    createdDate: nowDate(),
  });
}
function addToLocalStorage(arr) {
  localStorage.setItem("notes", JSON.stringify(arr));
}
// function createRandomNumber() {
// randNumArr=[]  randNum=0
//    randNum = Math.floor(Math.random()*1000)
//   if (randNumArr.includes(randNum)) {
//     createRandomNumber()
//     console.log("exist");
//   }else{
//     randNumArr.push(randNum)
//     return randNum
//   }
// }
function addToDOM() {
  notes = JSON.parse(localStorage.getItem("notes")) || [];
  $.querySelectorAll(".note").forEach((item) => item.remove());
  notes.forEach((item) => {
    wrapperEl.insertAdjacentHTML(
      "beforeend",
      `
    <li class="note">
    <div class="details">
      <p>${item.Title}</p>
      <span>${item.desc}</span>
    </div>
    <div class="bottom-content">
      <span>${item.createdDate}</span>
      <div class="settings">
        <i class="uil uil-ellipsis-h" onclick="showActionMenu(this)"></i>
        <ul class="menu">
          <li  onclick="editNote(${item.id}, this)">
            <i class="uil uil-pen" onclick=""></i>Edit
          </li>
          <li  onclick="removeNote(${item.id} , this)">
            <i class="uil uil-trash"></i>Delete
          </li>
        </ul>
      </div>
    </div>
  </li>
    `
    );
  });
}
function showActionMenu(e) {
  e.parentElement.classList.add("show");
  document.addEventListener("click", (event) => {
    if (event.target.tagName !== "I" || event.target != e) {
      e.parentElement.classList.remove("show");
    }
  });
}
function closeActionMenu(e) {
  e.closest(".settings").classList.remove("show");
}
function nowDate() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let d = new Date();
  return `${months[d.getMonth()]} ${d.getDay()},${d.getFullYear()}`;
}
function closePopUp() {
  popupBoxEl.classList.remove("show");
  popupInpTitleEl.value = "";
  popupInpTextEl.value = "";
}
function showPopUp(boolIsUpdate) {
  isUpdate = boolIsUpdate;
  if (!isUpdate) {
    popupTitleEl.innerHTML = "New Note";
    popupBtnEl.innerHTML = "Add New Note";
  } else {
    popupTitleEl.innerHTML = "Update Note";
    popupBtnEl.innerHTML = "Update A Note";
  }
  popupBoxEl.classList.add("show");
}
function removeNote(noteId, ev) {
  closeActionMenu(ev);
  notes = JSON.parse(localStorage.getItem("notes"));
  let findedIndexItem = notes.findIndex((item) => noteId === item.id);
  notes.splice(findedIndexItem, 1);
  addToLocalStorage(notes);
  addToDOM();
}
function editNote(noteId, ev) {
  closeActionMenu(ev);
  notes = JSON.parse(localStorage.getItem("notes"));
  showPopUp(true);
  let findedNote = notes.find((note) => noteId === note.id);
  popupInpTitleEl.value = findedNote.Title;
  popupInpTextEl.value = findedNote.desc;
  updateId = noteId;
}
//------------------| events |----------------//
popupBtnEl.addEventListener("click", () => {
  if (!isUpdate) {
    if (popupInpTitleEl.value && popupInpTextEl.value) {
      popupInpTitleEl.focus();
      addToArr(
        popupInpTitleEl.value.trim(),
        popupInpTextEl.value.trim(),
        notes
      );
      addToLocalStorage(notes);
      addToDOM();
      closePopUp();
    }
  } else {
    if (popupInpTitleEl.value && popupInpTextEl.value) {
      notes.some((note, index) => {
        if (note.id === updateId) {
          note.Title = popupInpTitleEl.value;
          note.desc = popupInpTextEl.value;
        }
      });
      addToLocalStorage(notes);
      addToDOM();
      closePopUp();
    }
  }
});

// show notes event
window.addEventListener("load", () => {
  addToDOM();
});
// show popup event on click add note box
addBoxEl.addEventListener("click", () => {
  showPopUp(false);
});
// close popup event on click * button
closePopupBtnEl.addEventListener("click", closePopUp);
// close popup event on click * button
document.addEventListener("keydown", (e) => {
  if (e.key == "Escape") {
    closePopUp();
  }
});
// close popup event on click * button
popupBoxEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("popup-box")) {
    closePopUp();
  }
});
