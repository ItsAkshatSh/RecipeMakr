const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'recipe-maker-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.get('/', (req, res) => {
    res.render('step1');
});

app.post('/step2', (req, res) => {
    const selectedIngredients = req.body.ingredients || [];
    req.session.selectedIngredients = selectedIngredients;
    res.render('step2', { selectedIngredients });
});

app.post('/generate-recipe', async (req, res) => {
    try {
        const selectedIngredients = req.session.selectedIngredients || [];
        const specialRequests = req.body.specialRequests || '';
        
        const prompt = `You are a recipe generator.

Create a detailed cooking recipe using the following ingredients:
${selectedIngredients.join(', ')}

The user has the following special requests or preferences:
${specialRequests}

The recipe should include:
- A creative recipe title
- A clear list of required ingredients
- Step-by-step cooking instructions (numbered)
- Simple and easy-to-follow language

Avoid including any ingredients not listed unless absolutely necessary (e.g., water, oil, salt). Keep the recipe practical and concise.`;

        const response = await axios.post('https://ai.hackclub.com/chat/completions', {
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
            temperature: 0.7,
            max_tokens: 1000
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const recipe = response.data.choices[0].message.content;
        
        res.render('step3', { 
            recipe,
            selectedIngredients: selectedIngredients,
            specialRequests
        });

    } catch (error) {
        console.error('Error generating recipe:', error);
        res.render('error', { 
            message: 'Failed to generate recipe. Please try again.',
            error: error.message 
        });
    }
});

app.get('/restart', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        message: 'Something went wrong!',
        error: err.message 
    });
});

app.listen(PORT, () => {
    console.log(`Recipe Maker app running on http://localhost:${PORT}`);
}); 


