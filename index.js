const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

let message = '';
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit', (req, res) => {
    const userInput = req.body.text;
    if (!userInput || userInput.trim() === '') {
        message = 'Error: Input cannot be empty.';
        return res.status(400).json({ error: message });
    }
    const latexOutput = convertToLatex(userInput);
    message = `LaTeX code:<br>${latexOutput.replace(/\n/g, '<br>')}`; 
    console.log("User Input:", userInput);
    console.log("Converted LaTeX:", latexOutput);
    res.json({ message: message, latex: latexOutput });
});


function convertToLatex(input) {
    // Mapping common logical expressions (both words and symbols) to LaTeX
    const operatorMap = {
        "(and)": "\\land",      "^": "\\land",   // Logical AND
        "(or)": "\\lor",        "v": "\\lor",    // Logical OR
        "(not)": "\\neg",       "~": "\\neg",    // Negation
        "(implies)": "\\rightarrow", "->": "\\rightarrow", // Implication
        "(iff)": "\\leftrightarrow", "<->": "\\leftrightarrow", // Bi-conditional
        "(forall)": "\\forall", "∀": "\\forall",  // Universal quantifier
        "(exists)": "\\exists", "∃": "\\exists",  // Existential quantifier
        "(subset)": "\\subset", "⊂": "\\subset",  // Subset
        "(subseteq)": "\\subseteq", "⊆": "\\subseteq", // Subset or equal
        "(intersect)": "\\cap", "∩": "\\cap",     // Intersection
        "(union)": "\\cup", "∪": "\\cup",         // Union
        "(provable)": "\\vdash", "⊢": "\\vdash",  // Provability
        "(models)": "\\models", "⊨": "\\models"   // Logical consequence
    };

    // Escape special LaTeX characters to prevent syntax errors
    const escapeLatex = str => str.replace(/([#%&{}_])/g, '\\$1');

    // Process each line of the input
    const lines = input.split('\n').map(line => {
        // Replace word-based operators first
        Object.keys(operatorMap).forEach(op => {
            const regex = new RegExp(op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'); // Escape for regex safety
            line = line.replace(regex, operatorMap[op]);
        });

        // Wrap non-math lines in \text{} for proper rendering
        if (!line.match(/[\\]/)) {
            line = `\\text{${escapeLatex(line)}}`;
        }

        return `&${line}&\\\\`; // Ensure alignment in LaTeX
    });

    // Construct the final LaTeX output
    return `\\begin{align*}\n    ${lines.join('\n    ')}\n\\end{align*}`;
}

app.get('/message', (req, res) => {
    res.json({ message });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
