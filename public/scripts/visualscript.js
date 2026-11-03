// visualscript.js

//    - menuIcon: The clickable element (anchor tag)
//    - mobileNav: The navigation container (nav element)
const menuIcon = document.getElementById('menuIcon');
const mobileNav = document.getElementById('mobileNav');

// 2. Define the function that runs when the icon is clicked
function toggleMenu() {
    //classList.toggle('className') automatically adds the class if it's missing 
    //and removes it if it's present.
    mobileNav.classList.toggle('menu-open');
}

// 3. Attach the function to the click event of the menu icon
menuIcon.addEventListener('click', toggleMenu);