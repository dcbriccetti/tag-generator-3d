import React, {useState} from 'react';
import {Box, Button, CircularProgress, Stack, TextField, Typography} from '@mui/material';
import './App.css';

function App() {
    const [names, setNames] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('http://localhost:5000/generate_tags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({names}),
            });

            if (response.ok) {
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = 'tags.stl';
                link.click();
                window.URL.revokeObjectURL(downloadUrl); // Clean up
            } else {
                console.error('Failed to generate tags');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleNamesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNames(event.target.value.split('\n'));
    };

    return (
        <Box className="App">
            <Stack spacing={2} sx={{width: 'fit-content'}}>
                <Typography variant="h4">Tag Generator</Typography>
                <TextField
                    label="Names"
                    multiline
                    rows={4}
                    value={names.join('\n')}
                    onChange={handleNamesChange}
                    variant="outlined"
                    fullWidth
                    sx={{textarea: {resize: 'both'}}}
                />
                <Button id="generate" variant="contained"
                        onClick={handleGenerate} sx={{width: 'auto'}}>
                    Generate
                </Button>

                {isGenerating && <CircularProgress/>}
            </Stack>
        </Box>
    );
}

export default App;
