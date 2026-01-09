// STOCKER LES PREFERENCES DANS LE LOCALSTORAGE

document.addEventListener("DOMContentLoaded", () => { 
    const savedPrefs = localStorage.getItem("preferences");
    if (!savedPrefs) return;

    const prefs = JSON.parse(savedPrefs); 


    const themeSelect = document.getElementById("theme"); 
    if (prefs.theme) {
        themeSelect.value = prefs.theme; 
    }


    if (prefs.theme === "dark") { 
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }

    
    if (prefs.display === "list") { 
        document.getElementById("radio-list").checked = true;
    } else if (prefs.display === "grid") {
        document.getElementById("radio-grid").checked = true;
    }
});



const form = document.getElementById("settings-form"); 

form.addEventListener("submit", (event) => { 
    event.preventDefault();  

    const theme = document.getElementById("theme").value; 

    let display;
    if (document.getElementById("radio-grid").checked) {
        display = "grid";
    } else {
        display = "list";
    }


    const preferences = { 
        theme,
        display
    };

    localStorage.setItem("preferences", JSON.stringify(preferences)); 


    if (theme === "dark") { 
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }


});
