import React from 'react';
import { Box, Slider, Typography } from '@mui/material';

type SliderComponentProps = {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (newValue: number) => void;
};

const SliderComponent: React.FC<SliderComponentProps> = ({ label, value, min, max, step, onChange }) => {
    return (
        <Box width="20em">
            <Typography id={`${label}-input-slider`} gutterBottom>
                {label} (mm): {value}
            </Typography>
            <Slider
                aria-labelledby={`${label}-input-slider`}
                value={value}
                onChange={(_, newValue) => {
                    if (typeof newValue === 'number') {
                        onChange(newValue);
                    }
                }}
                min={min}
                max={max}
                step={step}
            />
        </Box>
    );
};

export default SliderComponent;
