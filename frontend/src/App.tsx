import {useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CircularProgress,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './App.css';
import SliderComponent from "./components/SliderComponent";

function App() {
    const [names, setNames] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [bedWidth, setBedWidth] = useState(220);
    const [tagXLength, setTagXLength] = useState(72);
    const [tagYLength, setTagYLength] = useState(10);
    const [tagZLength, setTagZLength] = useState(1);

    const handleGenerate = async () => {
        setIsGenerating(true);
        const body = {
            names: names.split('\n'),
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
                    rows={8}
                    value={names}
                    onChange={(event) => setNames(event.target.value)}
                    variant="outlined"
                    fullWidth
                    sx={{textarea: {resize: 'both'}}}
                />
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography variant="h6">Settings</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
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
                            onChange={setTagZLength}
                        />
                    </AccordionDetails>
                </Accordion>
                <Button id="generate" variant="contained"
                        disabled={isGenerating || names.trim() === ''}
                        onClick={handleGenerate} sx={{width: 'fit-content'}}>
                    Generate
                </Button>

                {isGenerating && <CircularProgress/>}
            </Stack>
        </Box>
    );
}

export default App;
