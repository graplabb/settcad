document.addEventListener('DOMContentLoaded', () => {
    function trackGoal(goalName) {
        if (window.SETCAD_METRIKA_ID && typeof window.ym === 'function') {
            window.ym(window.SETCAD_METRIKA_ID, 'reachGoal', goalName);
        }
        if (typeof window.gtag === 'function') {
            window.gtag('event', goalName);
        }
    }

    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', () => trackGoal('phone_click'));
    });

    // 1. Управление модальным окном
    const modal = document.getElementById('modal');
    const openButtons = document.querySelectorAll('[data-modal-open]');
    const closeButtons = document.querySelectorAll('[data-modal-close]');

    openButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            trackGoal('modal_open');
            document.body.style.overflow = 'hidden'; 
        });
    });

    function closeModal() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal__backdrop')) {
            closeModal();
        }
    });

    // 2. Отправка форм через Web3Forms
    const forms = document.querySelectorAll('.form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const formData = new FormData(form);
            const successMsg = form.querySelector('.form__success');
            const submitBtn = form.querySelector('button[type="submit"]');
            
            // Меняем текст кнопки на время отправки
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;

            // Отправляем данные на сервер Web3Forms
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(async (response) => {
                if (response.status == 200) {
                    successMsg.hidden = false;
                    trackGoal(form.id === 'modalForm' ? 'modal_form_success' : 'contact_form_success');
                    form.reset(); 
                    
                    submitBtn.textContent = 'Отправить';
                    submitBtn.disabled = false;
                    
                    setTimeout(() => {
                        successMsg.hidden = true;
                    }, 5000);
                }
            })
            .catch(error => {
                console.log('Ошибка отправки:', error);
                submitBtn.textContent = 'Ошибка. Попробуйте еще раз';
                submitBtn.disabled = false;
            });
        });
    });
});
