#RecipeMakr

A 3-step web application that helps users generate personalized recipes using the Hack Club AI API. Users can select ingredients, specify preferences, and receive AI-generated recipes.

## Features

- **Step 1**: Interactive ingredient picker 
- **Step 2**: Special requests and dietary preferences input
- **Step 3**: AI-generated recipe display with formatting
- **Print Support**: Print-friendly recipe formatting
- **Copy/Share**: Copy recipe to clipboard or share via native sharing
- **Recipe Rating**: Rate generated recipes (optional feature)

  
<img width="1170" height="805" alt="image" src="https://github.com/user-attachments/assets/de1e99bf-986e-49a9-af5f-9b81f1dd8301" />

Check it out [here](https://recipemakr.vercel.app/) 

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js
- **AI API**: Hack Club AI

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Hack Club AI API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recipe-maker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get Hack Club AI API Key**
   - Visit [Hack Club AI](https://ai.hackclub.com/)

## Running the Application

### Development Mode
```bash
npm run dev
```


The application will be available at `http://localhost:3000`

## Usage

### Step 1: Choose Ingredients
- Search for ingredients you would like
- Continue button is enabled when at least one ingredient is selected

### Step 2: Special Requests
- Enter any dietary preferences or special requests
- Use the suggestion chips for common requests
- Examples: "Make it vegan", "No oven", "Spicy", "Indian-style"
- Character counter shows input length

### Step 3: Recipe Generation
- AI generates a personalized recipe
- Recipe includes title, ingredients, and step-by-step instructions
- Copy, share, or print the recipe
- Rate the recipe (optional)

