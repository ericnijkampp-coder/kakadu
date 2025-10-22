document.addEventListener('DOMContentLoaded', function() {
    // Auth state management
    let currentUser = JSON.parse(localStorage.getItem('kansimo_user')) || null;
    
    // Update UI based on auth state
    const updateAuthUI = () => {
        const authButton = document.querySelector('.auth-button');
        const depositButton = document.querySelector('.deposit-button');
        
        if (currentUser) {
            authButton.textContent = 'Logout';
            authButton.onclick = logout;
            depositButton.style.display = 'inline-block';
        } else {
            authButton.textContent = 'Login';
            authButton.onclick = openLoginModal;
            depositButton.style.display = 'none';
        }
    };
    
    // Check auth state on load
    updateAuthUI();
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a, .footer-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only apply smooth scroll to anchor links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Smooth scroll to the element
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Offset for header
                        behavior: 'smooth'
                    });
                    
                    // Update active navigation link
                    document.querySelectorAll('nav a').forEach(navLink => {
                        navLink.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            }
        });
    });
    
    // Update active navigation link on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Mobile navigation toggle (for responsive design)
    const createMobileNav = () => {
        const header = document.querySelector('header');
        const nav = document.querySelector('nav');
        
        // Create mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.classList.add('mobile-menu-btn');
        mobileMenuBtn.innerHTML = '<span></span><span></span><span></span>';
        header.insertBefore(mobileMenuBtn, nav);
        
        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    };
    
    // Call mobile navigation setup
    createMobileNav();
    
    // Auth Modal Functions
    window.openLoginModal = function() {
        document.getElementById('loginModal').style.display = 'flex';
    };
    
    window.openSignupModal = function() {
        document.getElementById('signupModal').style.display = 'flex';
    };
    
    window.closeModal = function(modalId) {
        document.getElementById(modalId).style.display = 'none';
    };
    
    window.switchToSignup = function() {
        closeModal('loginModal');
        openSignupModal();
    };
    
    window.switchToLogin = function() {
        closeModal('signupModal');
        openLoginModal();
    };
    
    window.handleLogin = function(event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Get stored users
        const storedUsers = JSON.parse(localStorage.getItem('kansimo_users') || '[]');
        const foundUser = storedUsers.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
            const userData = {
                id: foundUser.id,
                email: foundUser.email,
                balance: foundUser.balance || 1000
            };
            
            // Store logged in user
            localStorage.setItem('kansimo_user', JSON.stringify(userData));
            currentUser = userData;
            
            // Update UI
            updateAuthUI();
            closeModal('loginModal');
            
            // Show success message
            alert('Login successful!');
        } else {
            alert('Invalid email or password');
        }
    };
    
    window.handleSignup = function(event) {
        event.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        
        // Get stored users
        const storedUsers = JSON.parse(localStorage.getItem('kansimo_users') || '[]');
        const existingUser = storedUsers.find(u => u.email === email);
        
        if (existingUser) {
            alert('User with this email already exists');
            return;
        }
        
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            balance: 1000 // Starting bonus
        };
        
        // Add new user to storage
        storedUsers.push(newUser);
        localStorage.setItem('kansimo_users', JSON.stringify(storedUsers));
        
        // Log in the new user
        const userData = {
            id: newUser.id,
            email: newUser.email,
            balance: newUser.balance
        };
        
        localStorage.setItem('kansimo_user', JSON.stringify(userData));
        currentUser = userData;
        
        // Update UI
        updateAuthUI();
        closeModal('signupModal');
        
        // Show success message
        alert('Account created successfully! You have received 1000 bonus coins.');
    };
    
    window.logout = function() {
        localStorage.removeItem('kansimo_user');
        currentUser = null;
        updateAuthUI();
        alert('You have been logged out');
    };
    
    // Simple game filter functionality
    const setupGameFilters = () => {
        const filterButtons = document.querySelectorAll('.game-filter');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                
                // Update active filter button
                document.querySelectorAll('.game-filter').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                
                // Filter game cards
                document.querySelectorAll('.game-card').forEach(card => {
                    if (filterValue === 'all') {
                        card.style.display = 'block';
                    } else {
                        if (card.classList.contains(filterValue)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
    };
    
    // Initialize game filters if they exist
    if (document.querySelector('.game-filter')) {
        setupGameFilters();
    }
});