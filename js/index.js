
const addToList = (item) => {
    const searchType = document.querySelector("#search-by").value;

    const list = searchType=== "users" ? document.querySelector("#user-list") : document.querySelector("#repos-list");
    const itemKey = searchType=== "users" ? "login" : "name"

    const newUser = document.createElement("li");
    newUser.textContent = item[itemKey];

    if (searchType === "repositories") {
        // if searching repositories, add user information
        newUser.textContent = `${newUser.textContent}, owned by: ${item.owner.login}`
    }

    newUser.addEventListener("click", () => {
        renderRepos(item[itemKey]);

        const listItems = Array.from(list.children);
        listItems.forEach(li => {
            if (li.textContent === item[itemKey]) {
                li.className = "selected"
            }
            else {
                li.className = ""
            }
        })
    })

    list.append(newUser);
}

const searchInfo = () => {
    const searchForm = document.querySelector("#github-form")
    
    searchForm.addEventListener("submit", (e)=> {
        e.preventDefault();

        const searchTerm = searchForm.search.value;
        renderSearchList(searchTerm);
    })
}

const renderSearchList = (searchTerm='') => {
    document.querySelector("#user-list").innerHTML = ""
    document.querySelector("#repos-list").innerHTML = ""

    const searchType = document.querySelector("#search-by").value
    const gitURL = "https://api.github.com/search/";

    fetch(`${gitURL}${searchType}?q=${searchTerm}`)
    .then(res => {
        if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => data.items.forEach(addToList))
    }

function renderRepo(repo) {
    const repoList = document.querySelector("#repos-list");

    const newRepo = document.createElement("li");
    newRepo.textContent = repo.name;

    repoList.append(newRepo)
}

function renderRepos(userName) {
    document.querySelector("#repos-list").innerHTML = ""

    const repoURL = "https://api.github.com/users";

    fetch(`${repoURL}/${userName}/repos`)
    .then(res => {
        if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
        .then(data => {

            const repoData = data.reduce((accumulator, repoDict) => {
                const repoInfo = {owner: repoDict.owner.login,
                                    name: repoDict.name}
                
                const newEntry =  { [repoDict.id]: repoInfo };
                return { ...accumulator, ...newEntry };
            }, {})

            const repoArr = Object.values(repoData);
            
            repoArr.forEach(renderRepo);
        })
    }

document.addEventListener("DOMContentLoaded", ()=>{
    searchInfo();
})
