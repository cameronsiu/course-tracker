console.log("Client-side is running");
const toggles = Array.from(document.getElementsByClassName("toggle"));
console.log(toggles);

const sendToggle = (toggle) => {
    fetch('/toggled', {
        method: 'POST',
        body: JSON.stringify({
            toggle: toggle.checked,
            course: toggle.name
        }),
        headers: {'Content-Type':'application/json'}
    }).then(function(response) {
        if (response.ok) return response.json();
        throw new Error('Request failed.');
    })
    .then(function(data) {
        console.log(data);
    })
    .catch(function(error) {
        console.log(error);
    });
};

const getToggles = () => {
    fetch('/toggles', {method: 'GET'})
        .then(function(response) {
            if (response.ok) return response.json();
            throw new Error('Request failed.');
        })
        .then(function(data) {
            for (let i = 0; i < toggles.length; i++) {
                toggles[i].checked = data[i].toggle;
            }
        })
        .catch(function(error) {
            console.log(error);
        });
};

// const myToggle = (toggle) => {

//     if (toggle.checked) {
//         console.log(toggle.name + " Toggled On!")
//     } else {
//         console.log(toggle.name + " Toggled Off!");
//     }
//     sendToggle(toggle);
// };

getToggles();
toggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
            if (toggle.checked) {
                console.log(toggle.name + " Toggled On!")
            } else {
                console.log(toggle.name + " Toggled Off!");
            }
            sendToggle(toggle);
        });
});
