let cl = console.log;

const postContainer = document.getElementById("postContainer");
const postForm  = document.getElementById("postForm");
const titleControl = document.getElementById("title");
const contentControl = document.getElementById("content");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");


let baseUrl = `https://jsonplaceholder.typicode.com/posts/`;
// cl(baseUrl)
postArray = [];

/////////

const createCard = (postObj) => {
    let div = document.createElement("div");
    div.className = "card mb-4"
    div.innerHTML = `
                 <div class="card-header">${postObj.title}</div>
                    <div class="card-body">${postObj.body}</div>
                    <div class="card-footer text-right">
                        <button class="btn btn-primary" onclick="onEdit(this)"> Edit </button>
                        <button class="btn btn-danger"  onclick="onDelete(this)"> Delete </button>
                     </div>
                </div>
    `
    postContainer.append(div);
}

///////////

const onEdit = (ele) => {
    cl(ele.closest(".card").id);
    let id = ele.closest(".card").id;
    localStorage.setItem("updateId", id)
    let getSingleObjUrl = `${baseUrl}${id}`;
    makeApiCall("GET", getSingleObjUrl, null);
    updateBtn.classList.remove("d-none");
    submitBtn.classList.add("d-none");
}

const onDelete = (ele) => {
    let deleteId = ele.closest(".card").id;
    cl(deleteId);
    let deleteUrl = `${baseUrl}${deleteId}`;
    makeApiCall("DELETE", deleteUrl, null)
    ele.closest(".card").remove();

}




const templating = (arr) => {
    let result = '';
    arr.forEach(post => {
        result += `
                    <div class="card mb-4" id="${post.id}">
                        <div class="card-header">${post.title}</div>
                        <div class="card-body">${post.body}</div>
                        <div class="card-footer text-right">
                            <button class="btn btn-primary" onclick="onEdit(this)"> Edit </button>
                            <button class="btn btn-danger" onclick="onDelete(this)"> Delete </button>
                        </div>
                    </div>
        `
    }) 
    postContainer.innerHTML = result;
}

//////////////

const makeApiCall = (methodName, apiUrl, body) => {
    let xhr = new XMLHttpRequest();
    xhr.open(methodName, apiUrl)
    xhr.onload = function() {
        // cl(this.response)
        // cl(this.status)
        if(this.status === 200 ){
            postArray = JSON.parse(this.response);
            if(Array.isArray(JSON.parse(this.response))){
                    templating(postArray);
            }else if(methodName === "GET"){
                    //  return this.response;
                     titleControl.value = postArray.title;
                     contentControl.value = postArray.body;
            }  
         }else if(this.status === 201){
                    createCard(body)
        }
    }

    xhr.send(JSON.stringify(body));
}

makeApiCall("GET", baseUrl, null)

// xhr.open("METHOD", "URL", true) // byDefault 3rd argument is true (3RD ARGUMENT NOT MANDATORY)

const onPostSubmit = (eve) => {
    eve.preventDefault();
    cl("sumbitted !!!");
    let obj = {
        title: titleControl.value,
        body: contentControl.value,
        userId: Math.floor(Math.random() * 11 )
    }
    cl(obj);
    eve.target.reset();

     ///////

    makeApiCall("POST",baseUrl, obj)
//     let xhr = new XMLHttpRequest();
//     xhr.open("POST", baseUrl, true);
//     xhr.send(JSON.stringify(obj));
//     xhr.onload = function() {
//         if(this.status === 201 || this.status === 200){
//             cl(xhr.response);
//             obj.id = JSON.parse(xhr.response).id;
//             cl(obj);
//             postArray.push(obj);
//             createCard(obj);
//         }
//     } 
}

const onPostUpdate = (eve) => {
    let id = localStorage.getItem("updateId")
    let updateUrl = `${baseUrl}${id}`
    let obj = {
        title: titleControl.value,
        body: contentControl.value
    }
    makeApiCall("PATCH", updateUrl, JSON.stringify(obj));
    postForm.reset();
    updateBtn.classList.add("d-none");
    submitBtn.classList.remove("d-none");
    let card = document.getElementById(id);
    cl(card);
    card.innerHTML=`
            <div class="card-header">${obj.title}</div>
            <div class="card-body">${obj.body}</div>
            <div class="card-footer text-right">
                    <button class="btn btn-primary" onclick="onEdit(this)"> Edit </button>
                    <button class="btn btn-danger"  onclick="onDelete(this)"> Delete </button>
            </div>
            </div>
    `
}

postForm.addEventListener("submit", onPostSubmit);
updateBtn.addEventListener("click", onPostUpdate);


// GET >>  to get data
// POST >> to create new data
// DELETE >> to remove data
// PUT >>  to update complete object in database
// PATCH >> to update object partialy or completely (min 1 key change)

// readyState
// 0 >> unsend >> xhr object create but open method is not called yet
// 1 >> open method is called
// 2 >> send method called
// 3 >> loading >> Server is loading our request
// 4 >> Done >> request us proccessed and response us ready

// status code
// 200 | 201 >> api is successfull
// 400 >> api is failed (url not found )
// 403 >> forbidden 