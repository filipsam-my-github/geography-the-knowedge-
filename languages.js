// Language Selector
const languageSelector = document.getElementById("language-selector");

fetch('languages.json')
    .then(response => response.json())
    .then(translations => {
        function setLanguage(language) {
            const langData = translations[language];

            // Update the document title
            document.title = langData.title;

            // Update elements with `data-key`
            document.querySelectorAll('[data-key]').forEach(el => {
                const key = el.getAttribute('data-key');
                if (langData[key]) {
                    el.innerHTML = langData[key]; // Use innerHTML for rendering HTML content
                }
            });

            // Update placeholder attributes
            const searchInput = document.querySelector('.search-bar input');
            if (searchInput && langData.search) {
                searchInput.setAttribute('placeholder', langData.search);
            }
        }

        // Add event listener for language changes
        languageSelector.addEventListener('change', () => {
            setLanguage(languageSelector.value);
        });

        // Initialize the language to the default selected in the dropdown
        setLanguage(languageSelector.value);
    })
    .catch(error => console.error('Error loading translations:', error));


// Function to load content into the main content area from lesson files
function loadMainContent(lesson) {
    // Remove active class from all lessons
    const allLessons = document.querySelectorAll('.left-sidebar a');
    allLessons.forEach(link => {
        link.classList.remove('active');
    });

    // Add the 'active' class to the clicked lesson
    const currentLessonLink = document.querySelector(`.left-sidebar a[data-key="${lesson}"]`);
    if (currentLessonLink) {
        currentLessonLink.classList.add('active');
    }

    // Fetch and load the lesson content
    fetch(`lessons/${lesson}.html`)
        .then(response => response.text())
        .then(content => {
            const mainContent = document.querySelector('.main-content');
            mainContent.innerHTML = content; // Inject the content into mainContent div
            updateContentWithLanguage(); // Update the content based on language
        })
        .catch(error => {
            console.error('Error loading content:', error);
            document.querySelector('.main-content').innerHTML = `<p>Sorry, we couldn't load the content.</p>`;
        });
}

// Function to update the content with language after it's loaded
function updateContentWithLanguage() {
    const languageSelector = document.getElementById("language-selector");
    const lang = languageSelector.value;
    fetch('languages.json')
        .then(response => response.json())
        .then(translations => {
            const langData = translations[lang];
            document.querySelectorAll('[data-key]').forEach(el => {
                const key = el.getAttribute('data-key');
                if (langData[key]) {
                    el.innerHTML = langData[key]; // Use innerHTML to interpret HTML content
                }
            });
        })
        .catch(error => console.error('Error updating content with language:', error));
}


// Content Update on Sidebar Link Click
const lessonLinks = document.querySelectorAll('.left-sidebar a');

lessonLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior

        // Get the lesson name from the link's data-key (e.g., 'lesson1')
        const lesson = this.getAttribute('data-key');

        // Load the content from the respective lesson file
        loadMainContent(lesson);

        // Optionally, update the language after the content switch (if necessary)
        setLanguage(languageSelector.value);
    });
});



document.querySelectorAll('.left-sidebar a').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default link behavior

        // Get the lesson name from the link's data-key attribute
        const lesson = this.getAttribute('data-key');

        // Load the content from the respective lesson file
        loadMainContent(lesson);
    });
});

// Load the home page content by default
window.onload = function () {
    loadMainContent('home'); // Load 'home.html' by default
};

document.querySelectorAll('.styled-list li').forEach(item => {
    item.addEventListener('click', () => {
        const description = item.querySelector('p');
        if (description) {
            description.style.display = description.style.display === 'none' ? 'block' : 'none';
        }
    });
});
