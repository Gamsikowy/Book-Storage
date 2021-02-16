const leftSide = document.querySelector('.left-side');
const rightSide = document.querySelector('.right-side');
const firstElemWait = document.querySelector('.first-wait');
const secondElemWait = document.querySelector('.second-wait');

// Button management
leftSide.addEventListener('mouseenter', () => {
    firstElemWait.classList.add('to-discover-1');
});

rightSide.addEventListener('mouseenter', () => {
    secondElemWait.classList.add('to-discover-2');
});

leftSide.addEventListener('click', () => { leftSide.submit() });
rightSide.addEventListener('click', () => { rightSide.submit() });