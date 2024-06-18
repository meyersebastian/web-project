document.addEventListener('DOMContentLoaded', () => {
    const fetchDataButton = document.getElementById('fetch-data');
    const dataResults = document.getElementById('data-results');

    fetchDataButton.addEventListener('click', async () => {
        const userName = document.getElementById('user-name').value;
        let url = 'http://localhost:4000/data';
        if (userName) {
            url += `?name=${encodeURIComponent(userName)}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            displayData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            dataResults.textContent = 'Error fetching data';
        }
    });

    function displayData(data) {
        if (Array.isArray(data)) {
            dataResults.innerHTML = data.map(item => `
                <div>
                    <h3>${item.name}</h3>
                    <p>Score: ${item.score}</p>
                </div>
            `).join('');
        } else {
            dataResults.innerHTML = `
                <div>
                    <h3>${data.name}</h3>
                    <p>Score: ${data.score}</p>
                </div>
            `;
        }
    }
});
