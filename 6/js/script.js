const mainNav = document.querySelector('.main-header__navigation');
const menuButton = document.querySelector('.main-header__menu-btn');
const mainNavList = document.querySelector('.main-header__navigation-list');

mainNav.classList.remove('main-header__navigation--nojs');
mainNavList.classList.remove('main-header__navigation-list--nojs');
menuButton.classList.remove('main-header__menu-btn--nojs');

menuButton.addEventListener('click', function () {
  if (mainNav.classList.contains('main-header__navigation--closed')) {
    mainNav.classList.remove('main-header__navigation--closed');
    mainNav.classList.add('main-header__navigation--opened');
    menuButton.classList.remove('main-header__menu-btn--opened');
    menuButton.classList.add('main-header__menu-btn--closed');
  } else {
    mainNav.classList.add('main-header__navigation--closed');
    mainNav.classList.remove('main-header__navigation--opened');
    menuButton.classList.add('main-header__menu-btn--opened');
    menuButton.classList.remove('main-header__menu-btn--closed');
  }
});
