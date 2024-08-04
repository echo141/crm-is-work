document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('request-form');
    const tableBody = document.getElementById('requests-table').querySelector('tbody');
    const modal = document.getElementById('request-form-modal');
    const openFormBtn = document.getElementById('open-form-btn');
    const closeBtn = document.querySelector('.close-btn');

    // Функция для загрузки заявок
    function loadRequests() {
        fetch('/requests')
            .then(response => response.json())
            .then(requests => {
                tableBody.innerHTML = '';
                requests.forEach(request => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${request.initiator}</td>
                        <td>${request.service}</td>
                        <td>${request.status}</td>
                        <td>${request.description}</td>
                        <td>${request.responsible}</td>
                        <td>${request.due_date}</td>
                        <td>${request.comments}</td>
                    `;
                    tableBody.appendChild(row);
                });
            });
    }

    // Добавление новой заявки
    form.addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(form);
        const requestData = Object.fromEntries(formData);
        fetch('/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        }).then(() => {
            loadRequests();
            form.reset();
            modal.style.display = 'none';
        });
    });

    // Открытие модального окна
    openFormBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Закрытие модального окна
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Загрузка заявок при загрузке страницы
    loadRequests();
});
