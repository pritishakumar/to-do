const form = document.querySelector('form');
const list = document.querySelector('ul');
const addBut = document.getElementById("addBut")
let counter = 0; // line and list item id's
let backup =[]; // back up array for the session

function wantEmpty(bool) {
	/*- bool = true, list is to be empty, containing a default message
	  - bool = false, list needs default message removed, not empty anymore */
	if (bool) {
		let newLi = document.createElement('li');
		newLi.innerHTML = ' <i>-- Empty List, add new items --</i> ';
		newLi.id = 'empty';
		list.appendChild(newLi);
		backup = [];
		localStorage.removeItem('backup');
		counter = 0;
	} else {
		let empty = document.querySelector('#empty');
		list.removeChild(empty);
	}
}

function addItem(lineText,opt) {
	/*- accepts innerText to create HTML element
	  - opt= true, when backup array needs to be updated
	with the new item made
	  - opt= false, when backup array is already up to date,
	but new items are created on page content load, from 
	last session*/
	let newLi = document.createElement('li');
	newLi.innerText = lineText + '  ';
	newLi.id = counter;
	counter++;

	let newCheckbox = document.createElement('input');
	newCheckbox.setAttribute('type', 'checkbox');
	newLi.prepend(newCheckbox);
	if(!!opt){
		let newObj = {};
		newObj[lineText] = false;
		backup.push(newObj);
	};

	let newDelBut = document.createElement('button');
	newDelBut.className = 'delBut';
	newDelBut.innerHTML = 'X';
	newLi.appendChild(newDelBut);

	list.appendChild(newLi);
}


function updateArray(bool, index) {
	/*- bool= true, for importing info to page, localStorage -> page
	  - bool= false, for exporting info from page, page -> LocalStorage
	  - backup arr index */
	let line = document.getElementById(index);
	let checkbox = line.querySelector("input");
	let rawText = line.innerText;
	let cutText = rawText.slice(0, rawText.length - 2);
	
	if (bool) { // info localStorage/backup array -> page
		if (backup[index][cutText]) {
			checkbox.checked = true;
			line.classList.add('complete');
		} else {
			checkbox.checked = false;
		}
	} else {//export info page -> backup array/LocalStorage
		if (checkbox.checked) {
			backup[index][cutText] = true;
			line.classList.add('complete');
		} else {
			backup[index][cutText] = false;
			line.classList.remove('complete');
		}
		localStorage.setItem('backup', JSON.stringify(backup));
	}};


//Upon page load, checking for last session data
let lastSession;
try {
	lastSession = !!(localStorage.getItem('backup'));
} catch (e) {
	lastSession = false;
}
if (lastSession) { //if prior data exists
	backup = JSON.parse(localStorage.backup);
	let i=0;
	while (i<backup.length){
			if (backup[i]===null){
				backup.splice(i,1);
				localStorage.setItem('backup', JSON.stringify(backup));
			} else {
				let listText = Object.keys(backup[i])[0];
				addItem(listText,false);
				 updateArray(true, i);
				 i++;
			};
	} 
}	else { // if no prior data, start fresh
	wantEmpty(true);}


// Add Item button	
addBut.addEventListener('click',function(event){
	event.preventDefault();
    if (!!(document.querySelector("#empty"))){
		//if first item, remove empty default message
		wantEmpty(false);
	}
	let newText = document.getElementById("addText").value;
	addItem(newText,true);
	localStorage.setItem('backup', JSON.stringify(backup));
	document.getElementById("addText").value = "";
});


// Completion Checkbox
list.addEventListener('click', function(event){
	if(event.target.type === "checkbox"){
		let index = event.target.parentElement.id;
		updateArray(false,index); //update info in backup array & localStorage
	}
})


// Delete List Item Button
list.addEventListener('click', function(event){
	if(event.target.className === "delBut"){
		event.preventDefault();
		let line = event.target.parentElement;
		backup[line.id]= null;
		localStorage.setItem('backup', JSON.stringify(backup));
		line.remove();
		if(!document.querySelector('li')){
			// if list is empty, create empty default message
			wantEmpty(true);
		}}
})