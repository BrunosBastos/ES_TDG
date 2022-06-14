import React, { useState, useEffect,createRef } from 'react';
import { toast } from 'react-toastify';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';

// material
import {
    Card,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Divider,
    List,
    ListItem,
    IconButton,
    Box,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';


export default function HelpTemplates() {

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    
    
    /**
     * Takes the path of a file and downloads it.
     * The file should only be downloade if the arcodion was expanded.
     * @param {string} the path 
     * @param {boolen} the expanded flag 
     */
    const downloadFile = (path, expanded) => {
        if(expanded){
            window.location.href = path;
        }
    }

    return (
        <Card>
            <div>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            How do I fill excel files?
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>See JSON and xlsx file specifications</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
            Aliquam eget maximus est, id dignissim quam.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>How do I fill powerpoint files?</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            See JSON  and pptx file specifications
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Box sx={{ my: 3, mx: 2 }}>
                <Typography variant="h6">
                    Powerpoint template
                </Typography>
                <Typography >
                    Powerpoint templates consist on a single slide with variables declared as text. <p></p>
                    When filling the template our algorithm will replace those variables with the respective content declared in the JSON file.
                </Typography>
                <Typography >
                    Variables are written using the following syntax: &#123;VARIABLE_NAME&#125;<p></p>
                    Check for a template example below!
                </Typography>
            </Box>
            <Divider variant="middle"/>
            <Box sx={{ my: 3, mx: 2 }}>
                <Typography variant="h6">
                    JSON file
                </Typography>
                <Typography >
                    In order to fill a powerpoint template it is needed to pass a JSON file which must be written following certain rules:
                </Typography>
                <List>
                    <ListItem >
                      <Typography >
                        1- The root of the JSON file should consist of an array with key "records".
                      </Typography>
                    </ListItem>
                    <ListItem >
                      <Typography >
                        2- Each record consists on a dictionary with one or more key/value pairs. A new slide will be created for each record.
                      </Typography>
                    </ListItem>
                    <ListItem >
                      <Typography >
                        3- The key corresponds to the variable name in the powerpoint and it will be replaced by the corresponding value.
                      </Typography>
                    </ListItem>
                </List>          
            </Box>
            <Divider variant="middle"/>
            <Box sx={{ my: 3, mx: 2 }}>
                <Typography variant="h6">
                    Examples
                </Typography>      
                
                <Button sx={{ my: 3, mx: 2 }} color="primary" variant="outlined"  onClick={() => downloadFile('/static/template.pptx', expanded === 'panel2')} >
                    <Typography >Template file</Typography>
                </Button> 
                <Button sx={{ my: 3, mx: 2 }}color="primary" variant="outlined"  onClick={() => downloadFile('/static/pptx,json', expanded === 'panel2')} >
                    <Typography >JSON file</Typography>
                </Button> 
                <Button sx={{ my: 3, mx: 2 }} color="primary" variant="outlined"  onClick={() => downloadFile('/static/filled.pptx', expanded === 'panel2')} >
                    <Typography >Filled file</Typography>
                </Button> 
            </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
             How do I fill word files?
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            See JSON  and docx file specifications
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
            amet egestas eros, vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
        </Card>
    )
}
