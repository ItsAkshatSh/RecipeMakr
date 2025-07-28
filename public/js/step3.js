document.addEventListener('DOMContentLoaded', function() {
    const recipeContent = document.querySelector('.recipe-content');
    const printBtn = document.querySelector('button[onclick="window.print()"]');
    const newRecipeBtn = document.querySelector('a[href="/restart"]');

    if (printBtn) {
        printBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.print();
        });
    }

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn btn-secondary';
    copyBtn.innerHTML = '📋 Copy Recipe';
    copyBtn.style.marginRight = '10px';
    
    copyBtn.addEventListener('click', function() {
        const recipeText = recipeContent.textContent;
        navigator.clipboard.writeText(recipeText).then(() => {
            const originalText = this.innerHTML;
            this.innerHTML = '✅ Copied!';
            this.style.background = '#48bb78';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy recipe:', err);
            alert('Failed to copy recipe to clipboard');
        });
    });

    if (printBtn) {
        printBtn.parentNode.insertBefore(copyBtn, printBtn);
    }

    if (navigator.share) {
        const shareBtn = document.createElement('button');
        shareBtn.className = 'btn btn-secondary';
        shareBtn.innerHTML = '📤 Share Recipe';
        shareBtn.style.marginRight = '10px';
        
        shareBtn.addEventListener('click', function() {
            const recipeText = recipeContent.textContent;
            navigator.share({
                title: 'My Generated Recipe',
                text: recipeText,
                url: window.location.href
            }).catch(err => {
                console.error('Failed to share recipe:', err);
            });
        });

        copyBtn.parentNode.insertBefore(shareBtn, copyBtn);
    }

    const recipeText = document.querySelector('.recipe-text');
    if (recipeText) {
        let content = recipeText.innerHTML;
        
        content = content.replace(/(<br>)?([A-Z][^<]*?Recipe[^<]*?)(<br>)?/gi, '<br><h2 style="color: #2d3748; margin: 20px 0 15px 0; font-size: 1.5rem;">$2</h2><br>');
        
        content = content.replace(/(\d+\.\s*)([^<]+)/g, '<div style="margin: 10px 0; padding: 10px; background: #f7fafc; border-radius: 8px; border-left: 4px solid #4299e1;"><strong>$1</strong>$2</div>');
        
        content = content.replace(/(Ingredients?:?)(<br>)?/gi, '<h3 style="color: #2d3748; margin: 20px 0 10px 0;">$1</h3>');
        content = content.replace(/(Instructions?:?)(<br>)?/gi, '<h3 style="color: #2d3748; margin: 20px 0 10px 0;">$1</h3>');
        
        recipeText.innerHTML = content;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    recipeContent.style.animation = 'slideInUp 0.8s ease-out';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .recipe-content {
            animation: slideInUp 0.8s ease-out;
        }
        
        .btn {
            transition: all 0.3s ease;
        }
        
        .btn:hover {
            transform: translateY(-2px);
        }
        
        @media print {
            .btn {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            window.print();
        }
    });

    const ratingContainer = document.createElement('div');
    ratingContainer.className = 'recipe-rating';
    ratingContainer.style.cssText = `
        text-align: center;
        margin: 20px 0;
        padding: 20px;
        background: #f7fafc;
        border-radius: 8px;
    `;
    
    ratingContainer.innerHTML = `
        <h4 style="margin-bottom: 15px; color: #2d3748;">How was this recipe?</h4>
        <div class="rating-stars">
            ${[1, 2, 3, 4, 5].map(star => `
                <button class="star-btn" data-rating="${star}" style="
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #e2e8f0;
                    transition: color 0.2s ease;
                ">⭐</button>
            `).join('')}
        </div>
        <p class="rating-text" style="margin-top: 10px; color: #718096; font-size: 0.9rem;">Click a star to rate</p>
    `;

    const actionsContainer = document.querySelector('.form-actions');
    if (actionsContainer) {
        actionsContainer.parentNode.insertBefore(ratingContainer, actionsContainer);
    }

    const starBtns = document.querySelectorAll('.star-btn');
    const ratingText = document.querySelector('.rating-text');
    
    starBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            
            starBtns.forEach((star, index) => {
                star.style.color = index < rating ? '#f6ad55' : '#e2e8f0';
            });
            
            const texts = ['', 'Not great', 'Okay', 'Good', 'Very good', 'Excellent!'];
            ratingText.textContent = texts[rating];
            
            localStorage.setItem('recipeRating', rating);
        });
        
        btn.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            starBtns.forEach((star, index) => {
                star.style.color = index < rating ? '#f6ad55' : '#e2e8f0';
            });
        });
        
        btn.addEventListener('mouseleave', function() {
            const currentRating = localStorage.getItem('recipeRating') || 0;
            starBtns.forEach((star, index) => {
                star.style.color = index < currentRating ? '#f6ad55' : '#e2e8f0';
            });
        });
    });
}); 