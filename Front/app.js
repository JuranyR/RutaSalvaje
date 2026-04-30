function cambiarTab(tabId, event) {

 
  document.querySelectorAll(".tab-content").forEach(el => {
    el.classList.remove("active");
  });

  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });

  
  document.getElementById(tabId).classList.add("active");

 
  event.target.classList.add("active");
}

document.addEventListener("DOMContentLoaded", function() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        });
});

document.addEventListener("DOMContentLoaded", function() {
    fetch('nav.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
            agregarColorLink()
        });
});

function agregarColorLink() {
  const currentPath = window.location.pathname;
  const items = document.querySelectorAll('li a')
  items.forEach(item=> {
    if(currentPath.includes(item.getAttribute('href'))) {
      item.classList.add('active');
    }
  })
}

