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
            <Box sx={{ my: 3, mx: 2 }}>
                <Typography variant="h6">
                    Excel templates
                </Typography>
                <Typography >
                    Excel templates are the simplest ones. You can upload as template any .xlsx file. 
                </Typography>
                <Typography >
                    Our algorithm supports multiple spreadsheets!
                </Typography>
                <Typography >
                    Check for a template example below!
                </Typography>
            </Box>
            <Divider variant="middle"/>
            <Box sx={{ my: 3, mx: 2 }}>
                <Typography variant="h6">
                    JSON file
                </Typography>
                <Typography >
                    In order to fill a excel template it is needed to pass a JSON file which must be written following certain rules:
                </Typography>
                <List>
                    <ListItem >
                      <Typography >
                        1- The root of the JSON file should be an array. Each elemment of the array will refer to a spreadsheet.
                      </Typography>
                    </ListItem>
                    <ListItem >
                      <Typography >
                        2- Each spreadsheet consists on a object with the spreadsheet name as key and an array as value.
                      </Typography>
                    </ListItem>
                    <ListItem >
                      <Typography >
                        3- The array contains the cells data. Each cell is an elemment of the array with the key being the cell position &#40;A2, B10, AA7, etc&#41; and the value the cell's value after filling.
                      </Typography>
                    </ListItem>
                </List>  
                <Typography >
                    Check for a template example below!
                </Typography>        
            </Box>
            <Divider variant="middle"/>
            <Box sx={{ my: 3, mx: 2 }}>
                <Typography variant="h6">
                    Examples
                </Typography>      
                
                <Button sx={{ my: 3, mx: 2 }} color="primary" variant="outlined"  onClick={() => downloadFile('/static/template.xlsx', expanded === 'panel1')} >
                    <Typography >Template file</Typography>
                </Button> 
                <Button sx={{ my: 3, mx: 2 }}color="primary" variant="outlined"  onClick={() => downloadFile('/static/xlsx.json', expanded === 'panel1')} >
                    <Typography >JSON file</Typography>
                </Button> 
                <Button sx={{ my: 3, mx: 2 }} color="primary" variant="outlined"  onClick={() => downloadFile('/static/filled.xlsx', expanded === 'panel1')} >
                    <Typography >Filled file</Typography>
                </Button> 
            </Box>
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
                    Powerpoint templates consist on a single slide with variables declared as text.
                </Typography>
                <Typography > 
                    When filling the template our algorithm will replace those variables with the respective content declared in the JSON file.
                </Typography>
                <Typography >
                    Variables are written using the following syntax: &#123;VARIABLE_NAME&#125;
                </Typography>
                <Typography >
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
                <Typography >
                    Check for a JSON example below!
                </Typography>       
            </Box>
            <Divider variant="middle"/>
            <Box sx={{ my: 3, mx: 2 }}>
                <Typography variant="h6">
                    Examples
                </Typography>      
                
                <Button sx={{ my: 3, mx: 2 }} color="primary" variant="outlined"  onClick={() => downloadFile('/static/template.pptx', expanded === 'panel2')} >
                    <Typography >Template file</Typography>
                </Button> 
                <Button sx={{ my: 3, mx: 2 }}color="primary" variant="outlined"  onClick={() => downloadFile('/static/pptx.json', expanded === 'panel2')} >
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
            <Box sx={{ my: 3, mx: 2 }}>
                <Typography variant="h6">
                    Word templates
                </Typography>
                <Typography >
                    Word algorithm supports multiple variable types: 
                </Typography>
                <List>
                    <ListItem >
                      <Typography >
                        - Single variables, string or html, $&#123;VARIABLE_NAME&#125;
                      </Typography>
                    </ListItem>
                    <ListItem >
                      <Typography >
                        - Lists start with $&#123;#VARIABLE_NAME&#125; and end with $&#123;VARIABLE_NAME#&#125;
                      </Typography>
                    </ListItem>
                    <ListItem >
                     <Typography >
                       - The list contents can be accessed using $&#123;.ATTRIBUTE_NAME&#125; 
                      </Typography> 
                    </ListItem>
                    <ListItem >
                      <Typography >
                        - Tables $&#123;#VARIABLE_NAME&#125; in the first and last columns  with the content of the cells being $&#123;.ATTRIBUTE_NAME&#125;
                      </Typography>
                    </ListItem>
                </List>  
               
                <Typography >
                    Check for a template example below!
                </Typography>
            </Box>
            <Divider variant="middle"/>
            <Box sx={{ my: 3, mx: 2 }}>
                <Typography variant="h6">
                    JSON file
                </Typography>
                <Typography >
                    In order to fill a docx template it is needed to pass a JSON file which must be written following certain rules:
                </Typography>
                <List>
                    <ListItem >
                      <Typography >
                        1- The JSON starts as an object;
                      </Typography>
                    </ListItem>
                    <ListItem >
                      <Typography >
                        2- A simple variable has a key and the string value.
                      </Typography>
                    </ListItem>
                    <ListItem >
                      <Typography >
                        3- Variables can also be objects with the "type" key and "value" key. Type can be string or html and the value is what is displayed.
                      </Typography>
                    </ListItem>
                    <ListItem >
                      <Typography >
                        4- Lists are object arrays where each object can have multiple keys which will function as a attribute names.
                      </Typography>
                    </ListItem>
                    <ListItem >
                      <Typography >
                        5- Tables use the same syntax as lists.
                      </Typography>
                    </ListItem>
                </List>  
                <Typography >
                    Check for a template example below!
                </Typography>        
            </Box>
            <Divider variant="middle"/>
            <Box sx={{ my: 3, mx: 2 }}>
                <Typography variant="h6">
                    Examples
                </Typography>      
                
                <Button sx={{ my: 3, mx: 2 }} color="primary" variant="outlined"  onClick={() => downloadFile('/static/template.docx', expanded === 'panel3')} >
                    <Typography >Template file</Typography>
                </Button> 
                <Button sx={{ my: 3, mx: 2 }}color="primary" variant="outlined"  onClick={() => downloadFile('/static/docx.json', expanded === 'panel3')} >
                    <Typography >JSON file</Typography>
                </Button> 
                <Button sx={{ my: 3, mx: 2 }} color="primary" variant="outlined"  onClick={() => downloadFile('/static/filled.docx', expanded === 'panel3')} >
                    <Typography >Filled file</Typography>
                </Button> 
            </Box>
        </AccordionDetails>
      </Accordion>
    </div>
        </Card>
    )
}
