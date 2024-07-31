document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.scroll-container');
    const snapZones = document.querySelectorAll('.snap-zone');
    const snapHeight = window.innerHeight;
    
    let startY;
    let currentScrollTop = 0;

    scrollContainer.addEventListener('touchstart', (e) => {
        startY = e.touches[0].pageY;
    });

    scrollContainer.addEventListener('touchmove', (e) => {
        let touchY = e.touches[0].pageY;
        let touchMove = startY - touchY;

        scrollContainer.scrollTop = currentScrollTop + touchMove;
    });

    scrollContainer.addEventListener('touchend', () => {
        let scrollPosition = scrollContainer.scrollTop;
        let snapIndex = Math.round(scrollPosition / snapHeight);

        // Limit snapIndex to the number of snap zones
        snapIndex = Math.min(snapZones.length - 1, Math.max(0, snapIndex));

        currentScrollTop = snapIndex * snapHeight;

        scrollContainer.scrollTo({
            top: currentScrollTop,
            behavior: 'smooth'
        });
    });

    scrollContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        let scrollPosition = scrollContainer.scrollTop;
        let snapIndex = Math.round(scrollPosition / snapHeight);

        if (e.deltaY > 0) {
            snapIndex = Math.min(snapZones.length - 1, snapIndex + 1);
        } else {
            snapIndex = Math.max(0, snapIndex - 1);
        }

        currentScrollTop = snapIndex * snapHeight;

        scrollContainer.scrollTo({
            top: currentScrollTop,
            behavior: 'smooth'
        });
    });
});
