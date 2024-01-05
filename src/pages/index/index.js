// Boostrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
// AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

// Shared
import '../../shared/css/font.css';
import './style.css';
import { markdownToHtml } from './app/markdownToHtml.js';
import { getSearchResults} from './app/getSearchResults.js';
import { displaySearchResults }  from './app/displaySearchResults.js';
// Import the functions from the other modules
import { startLoadingAnimation, stopLoadingAnimation } from './app/loading.js';

document.addEventListener('DOMContentLoaded', () => {


  // Get the search form and button
  const searchForm = document.getElementById('searchForm');
  const searchButton = document.getElementById('searchButton');

  // Function to handle search
  const handleSearch = (event) => {
    event.preventDefault(); // Prevent default form submission
    startLoadingAnimation("I'm getting the articles that best match your query. -L.S.O.A.R.");

    // Get the search input
    const searchInput = document.getElementById('searchInput');
    let userQuery = searchInput.value;
    searchInput.value = "";
    console.log("Query:", userQuery);

  getSearchResults(userQuery)
      .then(data => {
        stopLoadingAnimation();
        displaySearchResults(data);
      })
      .catch(error => {
        stopLoadingAnimation();
        alert('An error occurred: ' + error);
      });
  };

  // Attach event listener to the form for submit event
  searchForm.addEventListener('submit', handleSearch);

  // Attach event listener to the button for click event
  searchButton.addEventListener('click', handleSearch);

  // Initialize AOS
  AOS.init();
  // Copyright
  const setCopyrightYear = () => {
    const currentYear = new Date().getFullYear();
    document.querySelector('#copyright-year').textContent = currentYear;
  };
  // Dynamic Auth Button for login/logout
  const updateAuthButton = (isAuthenticated) => {
  const authButton = document.getElementById('authButton');
  if (isAuthenticated) {
    authButton.textContent = 'Logout';
    authButton.addEventListener('click', () => {
      signOut().then(() => {
        window.location.href = '/';
      });
    });
  } else {
    authButton.textContent = 'Login';
    authButton.addEventListener('click', () => {
      window.location.href = '/login';
    });
  }
};


});
