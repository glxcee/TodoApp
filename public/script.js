
var todoLen = 0
function refreshLen() {
    todoLen = Number(document.getElementById("todo-len").innerText)
}

refreshLen()
var shown = Array.prototype.fill(false,0,todoLen)

function invertShown(i,id) {
    shown[i] = !shown[i]
    let icon = document.getElementById("v"+i)
    
    if(shown[i])
        icon.classList.add("bi-caret-up-fill")
    else 
        icon.classList.remove("bi-caret-up-fill")

    console.log(shown[i])
}

function toggleCheck(box,checked,id) {

    const title = box.nextElementSibling

    fetch("/posts/checked/"+id+"/"+(!checked).toString(), {method:'POST'})
        .then(res => console.log(res))

    location.reload();
}
