function openTab(tabName) {
    // Hide all tab contents
    const tabContents = document.getElementsByClassName('tab-content');
    for (let content of tabContents) {
        content.classList.remove('active');
    }

    // Deactivate all buttons
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let button of tabButtons) {
        button.classList.remove('active');
    }

    // Show the selected tab content and activate the button
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Ensure DOM is fully loaded and processed
setTimeout(() => {
    const mouseFollower = document.querySelector('.mouse-follower');
    if (!mouseFollower) return; // Safety check
    
    let cheeseQueue = [];
    let isEating = false;
    let mouseX = 0;
    let mouseY = 0;
    let isMobileDevice = false;
    let currentPosition = { x: 0, y: 0 };
    
    // Check if the device is mobile
    function checkMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               window.matchMedia("(max-width: 768px)").matches;
    }
    
    isMobileDevice = checkMobileDevice();
    
    // Hide mouse follower on mobile devices initially
    if (isMobileDevice) {
        mouseFollower.style.opacity = '0.7';
        mouseFollower.style.transform = 'scale(0.8)';
    }
    
    // Handle touch events for mobile
    document.addEventListener('touchstart', function(e) {
        if (e.target.closest('.nav-tabs')) return;
        
        // Get touch position
        const touch = e.touches[0];
        const touchX = touch.clientX;
        const touchY = touch.clientY;
        
        // Create cheese element
        const cheese = document.createElement('div');
        cheese.className = 'cheese';
        cheese.innerHTML = '🧀';
        cheese.style.left = (touchX - 15) + 'px';
        cheese.style.top = (touchY - 15) + 'px';
        document.body.appendChild(cheese);
        
        // Add to queue
        cheeseQueue.push({
            x: touchX,
            y: touchY,
            element: cheese
        });
        
        // If on mobile, immediately show the mouse follower
        if (isMobileDevice) {
            mouseFollower.style.opacity = '1';
        }
    });
    
    // Handle mouse events for desktop
    document.addEventListener('click', function(e) {
        // Don't create cheese if clicking on nav-tabs
        if (e.target.closest('.nav-tabs')) return;
        
        // Skip on touch devices (will be handled by touchstart)
        if (isMobileDevice && e.pointerType === 'touch') return;

        // Create cheese element
        const cheese = document.createElement('div');
        cheese.className = 'cheese';
        cheese.innerHTML = '🧀';
        cheese.style.left = (e.clientX - 15) + 'px';
        cheese.style.top = (e.clientY - 15) + 'px';
        document.body.appendChild(cheese);
        
        // Add to queue
        cheeseQueue.push({
            x: e.clientX,
            y: e.clientY,
            element: cheese
        });
    });
    
    // Track mouse position on desktop
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Track touch movement on mobile
    document.addEventListener('touchmove', function(e) {
        if (isMobileDevice) {
            const touch = e.touches[0];
            mouseX = touch.clientX;
            mouseY = touch.clientY;
        }
    });
    
    // Update mouse follower position
    function updatePosition() {
        if (cheeseQueue.length > 0 && !isEating) {
            const target = cheeseQueue[0];
            const targetX = target.x - 20;
            const targetY = target.y - 20;
            
            // Get current mouse follower position
            const rect = mouseFollower.getBoundingClientRect();
            currentPosition.x = rect.left;
            currentPosition.y = rect.top;
            
            // Move mouse follower
            mouseFollower.style.left = targetX + 'px';
            mouseFollower.style.top = targetY + 'px';
            
            // Wait for the transition to complete before checking distance
            setTimeout(() => {
                if (!isEating && cheeseQueue.length > 0 && cheeseQueue[0] === target) {
                    const newRect = mouseFollower.getBoundingClientRect();
                    const cheeseRect = target.element.getBoundingClientRect();
                    
                    // Calculate center points for more accurate distance
                    const mouseCenterX = newRect.left + newRect.width / 2;
                    const mouseCenterY = newRect.top + newRect.height / 2;
                    const cheeseCenterX = cheeseRect.left + cheeseRect.width / 2;
                    const cheeseCenterY = cheeseRect.top + cheeseRect.height / 2;
                    
                    const distance = Math.sqrt(
                        Math.pow(mouseCenterX - cheeseCenterX, 2) + 
                        Math.pow(mouseCenterY - cheeseCenterY, 2)
                    );
                    
                    if (distance < 20) {
                        eatCheese(target);
                    }
                }
            }, 500); // Match this with the CSS transition duration
        } else if (!isEating) {
            // Follow cursor if no cheese or not eating
            if (isMobileDevice && cheeseQueue.length === 0) {
                // On mobile, keep the mouse follower out of the way
                currentPosition.x = window.innerWidth - 60;
                currentPosition.y = window.innerHeight - 60;
            } else {
                currentPosition.x = mouseX + 30;
                currentPosition.y = mouseY + 30;
            }
            mouseFollower.style.left = currentPosition.x + 'px';
            mouseFollower.style.top = currentPosition.y + 'px';
        }
        
        requestAnimationFrame(updatePosition);
    }
    
    function eatCheese(target) {
        if (isEating) return;
        isEating = true;
        
        // Add eating animations
        mouseFollower.classList.add('eating');
        target.element.classList.add('being-eaten');
        
        // Remove cheese after animation
        setTimeout(() => {
            target.element.remove();
            cheeseQueue.shift();
            mouseFollower.classList.remove('eating');
            isEating = false;
        }, 500);
    }
    
    // Start the animation loop
    updatePosition();
    
    // Handle orientation changes
    window.addEventListener('resize', function() {
        isMobileDevice = checkMobileDevice();
    });
}, 100); // Small delay to ensure everything is ready

// Add click handler for tutorial element
document.addEventListener('DOMContentLoaded', function() {
    const tutorial = document.querySelector('.cheeseTutorial');
    if (tutorial) {
        tutorial.addEventListener('click', function() {
            this.style.display = 'none';
        });
        
        // Also add touch event for mobile
        tutorial.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.style.display = 'none';
        });
    }
});
