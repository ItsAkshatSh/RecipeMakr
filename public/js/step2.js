document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('requestsForm');
    const textarea = document.getElementById('specialRequests');
    const submitBtn = form.querySelector('button[type="submit"]');

    
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    });

    form.addEventListener('submit', function(e) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Generating Recipe...';
        
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Generating Recipe...';
    });

    const charCounter = document.createElement('div');
    charCounter.className = 'char-counter';
    charCounter.style.cssText = `
        text-align: right;
        font-size: 0.8rem;
        color: #718096;
        margin-top: 5px;
    `;
    textarea.parentNode.appendChild(charCounter);

    function updateCharCounter() {
        const count = textarea.value.length;
        const max = 500;
        charCounter.textContent = `${count}/${max} characters`;
        
        if (count > max * 0.8) {
            charCounter.style.color = count > max ? '#e53e3e' : '#f6ad55';
        } else {
            charCounter.style.color = '#718096';
        }
    }

    textarea.addEventListener('input', updateCharCounter);
    updateCharCounter();

    const suggestions = [
        'Make it vegan',
        'No oven needed',
        'Spicy',
        'Indian-style',
        'Quick and easy',
        'Gluten-free',
        'Low-carb',
        'High protein',
        'Budget-friendly',
        'Kid-friendly'
    ];

    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'suggestions';
    suggestionsContainer.style.cssText = `
        margin-top: 15px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    `;

    suggestions.forEach(suggestion => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'suggestion-chip';
        chip.textContent = suggestion;
        chip.style.cssText = `
            background: #e2e8f0;
            border: none;
            padding: 6px 12px;
            border-radius: 15px;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.2s ease;
        `;

        chip.addEventListener('click', function() {
            const currentValue = textarea.value;
            const separator = currentValue && !currentValue.endsWith(', ') ? ', ' : '';
            textarea.value = currentValue + separator + suggestion;
            textarea.focus();
            updateCharCounter();
            
            textarea.dispatchEvent(new Event('input'));
        });

        chip.addEventListener('mouseenter', function() {
            this.style.background = '#4299e1';
            this.style.color = 'white';
        });

        chip.addEventListener('mouseleave', function() {
            this.style.background = '#e2e8f0';
            this.style.color = '#333';
        });

        suggestionsContainer.appendChild(chip);
    });

    textarea.parentNode.appendChild(suggestionsContainer);

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            form.submit();
        }
    });

    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s ease-in-out infinite;
            margin-right: 8px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .suggestion-chip:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);
}); 