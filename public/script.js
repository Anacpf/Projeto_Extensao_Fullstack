
document.addEventListener('DOMContentLoaded', () => {

    
    const menuIcon = document.getElementById('menuIcon');
    const sidebar = document.getElementById('mySidebar');
    const mainContent = document.getElementById('main');

    if (menuIcon && sidebar && mainContent) {
        let menuTimeout;

        const openMenu = () => {
            clearTimeout(menuTimeout);
            sidebar.style.left = '0';
            
        };

        const closeMenu = () => {
            sidebar.style.left = '-250px';
        };

        
        menuIcon.addEventListener('mouseenter', openMenu);

        
        sidebar.addEventListener('mouseleave', () => {
            menuTimeout = setTimeout(closeMenu, 300); 
        });

        
        sidebar.addEventListener('mouseenter', () => {
            clearTimeout(menuTimeout);
        });

        
        sidebar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

   
    const form = document.querySelector(".contact-form");
    const successMessage = document.getElementById("success-message");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: { Accept: "application/json" },
            })
            .then((response) => {
                if (response.ok) {
                    successMessage.style.display = "block";
                    form.reset();
                    setTimeout(() => {
                        successMessage.style.display = "none";
                    }, 4000); 
                } else {
                    alert("Erro ao enviar a mensagem. Tente novamente.");
                }
            })
            .catch(() => alert("Ocorreu um erro. Verifique sua conexão e tente novamente."));
        });
    }


    const swiper = new Swiper(".mySwiper", {
        loop: true,
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: {
            rotate: 10,
            stretch: 80,
            depth: 200,
            modifier: 1,
            slideShadows: false,
        },
        pagination: {
            el: ".swiper-pagination",
        },
    });
});