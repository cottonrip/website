document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.scroll-container');
    const snapZones = document.querySelectorAll('.snap-zone');
    const snapHeight = window.innerHeight;

    let isScrolling;

    scrollContainer.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);

        isScrolling = setTimeout(() => {
            let scrollPosition = scrollContainer.scrollTop;
            let snapIndex = Math.round(scrollPosition / snapHeight);

            // Limit snapIndex to the number of snap zones
            snapIndex = Math.min(snapZones.length - 1, Math.max(0, snapIndex));

            scrollContainer.scrollTo({
                top: snapIndex * snapHeight,
                behavior: 'smooth'
            });
        }, 66);
    });
});
