document.addEventListener('DOMContentLoaded', function() {
    const ingredientInput = document.getElementById('ingredientInput');
    const addIngredientBtn = document.getElementById('addIngredientBtn');
    const ingredientsList = document.getElementById('ingredientsList');
    const suggestions = document.getElementById('suggestions');
    const nextBtn = document.getElementById('nextBtn');
    const form = document.getElementById('ingredientForm');

    let selectedIngredients = [];
    let suggestionIndex = -1;

    const commonIngredients = [
    'chicken', 'beef', 'pork', 'salmon', 'shrimp', 'tofu', 'eggs',
    'rice', 'pasta', 'quinoa', 'bread', 'potatoes', 'sweet potatoes',
    'tomatoes', 'onions', 'garlic', 'bell peppers', 'carrots', 'broccoli',
    'spinach', 'kale', 'mushrooms', 'zucchini', 'eggplant', 'corn',
    'cheese', 'milk', 'yogurt', 'butter', 'olive oil', 'coconut oil',
    'soy sauce', 'lemon', 'lime', 'ginger', 'basil', 'oregano', 'thyme',
    'salt', 'pepper', 'sugar', 'flour', 'honey', 'maple syrup','cabbage', 
    'lettuce', 'peas', 'green beans', 'chickpeas', 'lentils', 'cucumber',
    'apple', 'banana', 'orange', 'grapes', 'blueberries', 'strawberries', 'avocado',
    'couscous', 'barley', 'oats', 'tortillas', 'noodles','turkey', 'lamb', 'duck',
    'bacon', 'ham', 'tempeh', 'seitan','ketchup', 'mustard', 'mayonnaise', 'vinegar',
    'hot sauce', 'sriracha', 'bbq sauce','peanut butter', 'tahini', 'miso paste',
    'cumin', 'paprika', 'chili powder', 'coriander', 'cinnamon', 'nutmeg', 'cloves',
    'turmeric', 'curry powder', 'rosemary', 'parsley', 'dill',
    'baking powder', 'baking soda', 'cornstarch', 'vanilla extract', 'yeast', 
    'breadcrumbs', 'cocoa powder', 'chocolate chips', 'nuts', 'raisins'
];

    function addIngredient(ingredient) {
        const trimmedIngredient = ingredient.trim().toLowerCase();
        
        if (!trimmedIngredient) return;
        
        // check whether ingrediesnt are added
        if (selectedIngredients.includes(trimmedIngredient)) {
            showMessage('This ingredient is already added!', 'warning');
            return;
        }

        // Add
        selectedIngredients.push(trimmedIngredient);
        updateIngredientsList();
        updateNextButton();
        
        // Clear 
        ingredientInput.value = '';
        hideSuggestions();
        
        showMessage(`Added: ${trimmedIngredient}`, 'success');
    }

    function updateIngredientsList() {
        if (selectedIngredients.length === 0) {
            ingredientsList.innerHTML = '<p class="no-ingredients">No ingredients added yet. Start typing above!</p>';
            return;
        }

        ingredientsList.innerHTML = selectedIngredients.map(ingredient => `
            <span class="ingredient-tag">
                ${ingredient}
                <button type="button" class="remove-ingredient" data-ingredient="${ingredient}">×</button>
            </span>
        `).join('');

        document.querySelectorAll('.remove-ingredient').forEach(btn => {
            btn.addEventListener('click', function() {
                const ingredientToRemove = this.dataset.ingredient;
                selectedIngredients = selectedIngredients.filter(ing => ing !== ingredientToRemove);
                updateIngredientsList();
                updateNextButton();
                showMessage(`Removed: ${ingredientToRemove}`, 'info');
            });
        });
    }

    function updateNextButton() {
        nextBtn.disabled = selectedIngredients.length === 0;
        
        if (selectedIngredients.length > 0) {
            nextBtn.textContent = `Continue to Step 2 (${selectedIngredients.length} ingredients)`;
        } else {
            nextBtn.textContent = 'Continue to Step 2';
        }
    }

    function showSuggestions(input) {
        const query = input.toLowerCase().trim();
        if (!query) {
            hideSuggestions();
            return;
        }

        const filtered = commonIngredients.filter(ingredient => 
            ingredient.includes(query) && !selectedIngredients.includes(ingredient)
        ).slice(0, 8);

        if (filtered.length === 0) {
            hideSuggestions();
            return;
        }

        suggestions.innerHTML = filtered.map((ingredient, index) => `
            <div class="suggestion-item ${index === suggestionIndex ? 'selected' : ''}" 
                 data-ingredient="${ingredient}">
                ${ingredient}
            </div>
        `).join('');

        suggestions.style.display = 'block';

        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', function() {
                addIngredient(this.dataset.ingredient);
            });
        });
    }

    function hideSuggestions() {
        suggestions.style.display = 'none';
        suggestionIndex = -1;
    }

    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        const inputContainer = document.querySelector('.ingredient-input-container');
        inputContainer.parentNode.insertBefore(messageDiv, inputContainer.nextSibling);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    ingredientInput.addEventListener('input', function() {
        showSuggestions(this.value);
    });

    ingredientInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (suggestionIndex >= 0) {
                const selectedSuggestion = suggestions.querySelector('.suggestion-item.selected');
                if (selectedSuggestion) {
                    addIngredient(selectedSuggestion.dataset.ingredient);
                }
            } else {
                addIngredient(this.value);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const items = suggestions.querySelectorAll('.suggestion-item');
            if (items.length > 0) {
                suggestionIndex = Math.min(suggestionIndex + 1, items.length - 1);
                updateSuggestionSelection();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const items = suggestions.querySelectorAll('.suggestion-item');
            if (items.length > 0) {
                suggestionIndex = Math.max(suggestionIndex - 1, -1);
                updateSuggestionSelection();
            }
        } else if (e.key === 'Escape') {
            hideSuggestions();
        }
    });

    addIngredientBtn.addEventListener('click', function() {
        addIngredient(ingredientInput.value);
    });

    function updateSuggestionSelection() {
        document.querySelectorAll('.suggestion-item').forEach((item, index) => {
            item.classList.toggle('selected', index === suggestionIndex);
        });
    }

    document.addEventListener('click', function(e) {
        if (!ingredientInput.contains(e.target) && !suggestions.contains(e.target)) {
            hideSuggestions();
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (selectedIngredients.length === 0) {
            showMessage('Please add at least one ingredient before continuing.', 'error');
            return;
        }

        selectedIngredients.forEach(ingredient => {
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'ingredients';
            hiddenInput.value = ingredient;
            form.appendChild(hiddenInput);
        });

        nextBtn.disabled = true;
        nextBtn.textContent = 'Loading...';
        
        form.submit();
    });

    ingredientInput.focus();
});

const style = document.createElement('style');
style.textContent = `
    .ingredient-input-container {
        display: flex;
        gap: 10px;
        margin-bottom: 10px;
    }
    
    .form-input {
        flex: 1;
        padding: 12px 15px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }
    
    .form-input:focus {
        outline: none;
        border-color: #4299e1;
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    }
    
    .suggestions-dropdown {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
    }
    
    .suggestion-item {
        padding: 10px 15px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    
    .suggestion-item:hover,
    .suggestion-item.selected {
        background-color: #f7fafc;
    }
    
    .ingredient-tag {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: #4299e1;
        color: white;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
        margin: 5px;
    }
    
    .remove-ingredient {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s ease;
    }
    
    .remove-ingredient:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
    
    .no-ingredients {
        color: #718096;
        font-style: italic;
        text-align: center;
        padding: 20px;
    }
    
    .message {
        padding: 10px 15px;
        border-radius: 8px;
        margin: 10px 0;
        font-weight: 500;
    }
    
    .message-success {
        background-color: #c6f6d5;
        color: #22543d;
        border: 1px solid #9ae6b4;
    }
    
    .message-warning {
        background-color: #fef5e7;
        color: #744210;
        border: 1px solid #fbd38d;
    }
    
    .message-error {
        background-color: #fed7d7;
        color: #742a2a;
        border: 1px solid #fc8181;
    }
    
    .message-info {
        background-color: #bee3f8;
        color: #2a4365;
        border: 1px solid #90cdf4;
    }
    
    .form-group {
        position: relative;
    }
`;
document.head.appendChild(style); 

