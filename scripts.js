document.addEventListener("DOMContentLoaded", () => {
  fetch("header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header-placeholder").innerHTML = data;
    })
    .catch(error => console.error("Error loading header:", error));
  fetch("footer.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer-placeholder").innerHTML = data;
    })
    .catch(error => console.error("Error loading footer:", error));
});

        document.addEventListener('DOMContentLoaded', () => {
            // Select all skill-tags containers
            const skillTagsContainers = document.querySelectorAll('.skill-tags');
            
            // Define mapping of skill categories to summary indices
            const categoryMap = {
                'Languages': 0,
                'AI/ML & Data Science': 1,
                'Software Development': 2
            };
            
            // Get the skills-summary values
            const summaryValues = document.querySelectorAll('.skills-summary .value');
            
            // Iterate through each skill-tags container
            skillTagsContainers.forEach((container, index) => {
                // Count the number of <span> elements (skills)
                const skillCount = container.querySelectorAll('span').length;
                
                // Get the category name from the corresponding <h4> element
                const category = container.parentElement.querySelector('h4').textContent;
                
                // Update the corresponding summary value
                const summaryIndex = categoryMap[category];
                if (summaryIndex !== undefined && summaryValues[summaryIndex]) {
                    summaryValues[summaryIndex].textContent = skillCount;
                }
            });
        });