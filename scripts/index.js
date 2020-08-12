const guideList = document.querySelector('.guides')
const loggedOutLinks = document.querySelectorAll('.logged-out')
const loggedInLinks = document.querySelectorAll('.logged-in')
const accountDetails = document.querySelector('.account-details')
const adminItems = document.querySelectorAll('.admin')

// setup ui
const setupUI = user => {
  if (user) {
    if(user.admin) {
      adminItems.forEach(item => item.style.display = 'block')
    }
    // Account Info
    db.collection('users').doc(user.uid).get().then(doc => {
      const html = `<div>Logged in as ${user.email}</div>
                    <div>${doc.data().bio}</div>
                    <div class="pink-text">${user.admin ? 'Admin': ''}</div>`
      accountDetails.innerHTML = html
    })

    // toggle UI Elements
    loggedInLinks.forEach(item => item.style.display = 'block')
    loggedOutLinks.forEach(item => item.style.display = 'none')
  } else {
    // Hide account info
    accountDetails.innerHTML = ''
    // toggle UI Elements
    loggedInLinks.forEach(item => item.style.display = 'none')
    loggedOutLinks.forEach(item => item.style.display = 'block')
    adminItems.forEach(item => item.style.display = 'none')
  }
}
// setup the guidess
const setupGuides = docs => {
  if (docs.length) {
    let html = ''
    docs.forEach(doc => {
      let guide = `<li>
                      <div class="collapsible-header grey lighten-4">${doc.data().title}</div>
                       <div class="collapsible-body white">${doc.data().content}</div>
                    </li>
                    `
      html += guide
    })
    guideList.innerHTML = html

  } else {
    guideList.innerHTML = `<h5 class="center-align">Login to view guides</h5>`
  }

}

// setup materialize components
document.addEventListener('DOMContentLoaded', function () {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});

