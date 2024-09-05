// dynamic-divs.js

(function () {
    // Array of colors for the divs
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
    // Function to create and inject divs
    function createColoredDivs() {
        // Create a container div to hold the colored divs
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';

        // Create and style each colored div
        colors.forEach(color => {
            const div = document.createElement('div');
            div.style.backgroundColor = color;
            div.style.width = '100px';
            div.style.height = '100px';
            div.style.margin = '10px';
            div.textContent = color;
            div.style.color = 'white';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            div.style.fontFamily = 'Arial, sans-serif';
            // Append each div to the container
            container.appendChild(div);
        });

        // Append the container to the body (or another specified element)
        document.body.appendChild(container);
    }

    // Run the function when the window loads
    window.addEventListener('load', createColoredDivs);
})();
