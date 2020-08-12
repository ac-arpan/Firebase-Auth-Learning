// Add admin cloud function
const adminForm = document.querySelector('.admin-actions')
adminForm.addEventListener('submit', e => {
    e.preventDefault()
    const adminEmail = adminForm['admin-email'].value
    const addAdminRole = functions.httpsCallable('addAdminRole')
    addAdminRole({ email: adminEmail }).then(result => {
        console.log(result)
        adminForm.reset()
    })
})

// Listen for auth status changes [user === null when no user is logged in]
auth.onAuthStateChanged(user => {
    // console.log(user)
    if (user) {
        // console.log('User Logged in :', user)
        user.getIdTokenResult().then(idTokenResult => {
            // console.log(idTokenResult.claims)
            user.admin = idTokenResult.claims.admin   //[for admin users true, for normal users it will be undefined]
            setupUI(user)
        })
        // Get data from firestore
        db.collection('guides').onSnapshot(snapshot => {
            // console.log(snapshot.docs)
            setupGuides(snapshot.docs)
        }, err => {
            console.log(err.message)
        })
    } else {
        setupGuides([])
        setupUI()
    }
})

// Create New Guide
const createForm = document.querySelector('#create-form')
createForm.addEventListener('submit', e => {
    e.preventDefault()

    db.collection('guides').add({
        title: createForm['title'].value,
        content: createForm['content'].value
    }).then( () => {
        const modal = document.querySelector('#modal-create')
        M.Modal.getInstance(modal).close()

        createForm.reset()        
    }).catch( err => {
        console.log(err.message)
    })
})


// Sign Up
const signupForm = document.querySelector('#signup-form')
signupForm.addEventListener('submit', e => {
    e.preventDefault()

    // Get user info
    const email = signupForm['signup-email'].value
    const password = signupForm['signup-password'].value

    // Sign Up the user
    auth.createUserWithEmailAndPassword(email, password).then(userCred => {
        // console.log(userCred.user)
        return db.collection('users').doc(userCred.user.uid).set({
            bio: signupForm['signup-bio'].value
        })
    }).then(() => {
        const modal = document.querySelector('#modal-signup')
        M.Modal.getInstance(modal).close()

        signupForm.reset()
        signupForm.querySelector('.error').innerHTML = ''
    }).catch(err => {
        signupForm.querySelector('.error').innerHTML = err.message
    })
})


// Logout
const logout = document.querySelector('#logout')
logout.addEventListener('click', e => {
    e.preventDefault()

    // Signout the user
    auth.signOut().then(() => {
        // console.log('User is logged out!')
    })
})


//Login
const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', e => {
    e.preventDefault()

    //get user info
    const email = loginForm['login-email'].value
    const password = loginForm['login-password'].value

    // Signin the user
    auth.signInWithEmailAndPassword(email, password).then(userCred => {
        // console.log(userCred.user)
        const modal = document.querySelector('#modal-login')
        M.Modal.getInstance(modal).close()

        loginForm.reset()
        loginForm.querySelector('.error').innerHTML = ''
    }).catch(err => {
        loginForm.querySelector('.error').innerHTML = err.message
    })

})