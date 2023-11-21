import {useState} from 'react';
import {Box, Button, CircularProgress, Stack, TextField, Typography} from '@mui/material';
import './App.css';
import SliderComponent from "./components/SliderComponent";

function App() {
    const [names, setNames] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [bedWidth, setBedWidth] = useState(220);
    const [tagXLength, setTagXLength] = useState(50);
    const [tagYLength, setTagYLength] = useState(15);
    const [tagZLength, setTagZLength] = useState(1);

    const handleGenerate = async () => {
        setIsGenerating(true);
        const body = {
            names,
            bedWidth,
            tagDims: [tagXLength, tagYLength, tagZLength],
        }
        try {
            const response = await fetch('http://localhost:5000/generate_tags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({body}),
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
                console.error(`Failed to generate tags: ${response.status} ${response.statusText} ${await response.text()}`);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsGenerating(false);
        }
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
                    onChange={(event) => setNames(event.target.value.split('\n'))}
                    variant="outlined"
                    fullWidth
                    sx={{textarea: {resize: 'both'}}}
                />
                <SliderComponent
                    label="Bed Width"
                    value={bedWidth}
                    min={50}
                    max={500}
                    onChange={setBedWidth}
                />
                <SliderComponent
                    label="Tag X Length"
                    value={tagXLength}
                    min={1}
                    max={bedWidth}
                    onChange={setTagXLength}
                />
                <SliderComponent
                    label="Tag Y Length"
                    value={tagYLength}
                    min={1}
                    max={50}
                    onChange={setTagYLength}
                />
                <SliderComponent
                    label="Tag Z Length"
                    value={tagZLength}
                    min={0.1}
                    max={5}
                    step={0.1}
                    onChange={(newValue) => setTagZLength(newValue)}
                />
                <Button id="generate" variant="contained" disabled={isGenerating}
                        onClick={handleGenerate} sx={{width: 'auto'}}>
                    Generate
                </Button>

                {isGenerating && <CircularProgress/>}
            </Stack>
        </Box>
    );
}

export default App;
