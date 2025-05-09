import { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Paper, 
  Typography, 
  LinearProgress, 
  Tabs, 
  Tab,
  IconButton
} from '@mui/material';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { 
  Folder, 
  InsertDriveFile,
  Code,
  KeyboardArrowRight
} from '@mui/icons-material';
import { useProject } from '../contexts/ProjectContext';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import kotlin from 'react-syntax-highlighter/dist/esm/languages/hljs/kotlin';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import { motion } from 'framer-motion';
import { generateProject } from '../utils/projectGenerator';
import { generateZip } from '../utils/zipGenerator';

SyntaxHighlighter.registerLanguage('kotlin', kotlin);
SyntaxHighlighter.registerLanguage('xml', xml);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`preview-tabpanel-${index}`}
      aria-labelledby={`preview-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `preview-tab-${index}`,
    'aria-controls': `preview-tabpanel-${index}`,
  };
}

// Create a file list with hierarchical structure
function renderFileList(files: string[], onFileClick: (file: string) => void, selectedFile: string | null) {
  // Filter and sort files by directory first, then by name
  const sortedFiles = [...files].sort((a, b) => {
    const aDepth = a.split('/').length;
    const bDepth = b.split('/').length;
    if (aDepth !== bDepth) return aDepth - bDepth;
    return a.localeCompare(b);
  });

  // Group files by their first parent directory
  const groupedFiles: Record<string, string[]> = {};
  
  sortedFiles.forEach(file => {
    const parts = file.split('/');
    if (parts.length === 1) {
      // Root files
      if (!groupedFiles['root']) groupedFiles['root'] = [];
      groupedFiles['root'].push(file);
    } else {
      const rootDir = parts[0];
      if (!groupedFiles[rootDir]) groupedFiles[rootDir] = [];
      groupedFiles[rootDir].push(file);
    }
  });

  // Create list items from file groups
  return Object.entries(groupedFiles).map(([dir, fileList]) => {
    const isRootDir = dir === 'root';
    const dirName = isRootDir ? 'Root' : dir;

    // Render root files directly
    if (isRootDir) {
      return fileList.map(file => renderFileItem(file, onFileClick, selectedFile));
    }

    // For directories with multiple files, create a collapsible section
    return (
      <FileGroupItem 
        key={dir} 
        groupName={dirName} 
        files={fileList} 
        onFileClick={onFileClick} 
        selectedFile={selectedFile} 
        defaultExpanded={['app', 'app/src', 'app/src/main'].includes(dir)}
      />
    );
  });
}

// Component for a group of files (directory)
function FileGroupItem({ groupName, files, onFileClick, selectedFile, defaultExpanded = false }: {
  groupName: string;
  files: string[];
  onFileClick: (file: string) => void;
  selectedFile: string | null;
  defaultExpanded?: boolean;
}) {
  const [open, setOpen] = useState(defaultExpanded);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleToggle} sx={{ py: 0.5 }}>
        <ListItemIcon sx={{ minWidth: 36 }}>
          <Folder fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText 
          primary={<Typography variant="body2">{groupName}</Typography>} 
          sx={{ m: 0 }}
        />
        {open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
      </ListItemButton>
      <Collapse in={open} timeout="auto">
        <List dense component="div" disablePadding>
          {files.map(file => {
            // Only render direct children of this directory
            const parts = file.split('/');
            if (parts[0] === groupName && parts.length === 2) {
              return renderFileItem(file, onFileClick, selectedFile);
            } 
            // For subdirectories, create nested groups
            else if (parts[0] === groupName && parts.length > 2) {
              // Get the next level directory
              const subDir = parts.slice(0, 2).join('/');
              const subFiles = files.filter(f => f.startsWith(subDir + '/'));
              
              // Only render each subdirectory once
              if (file === subFiles[0]) {
                return (
                  <FileGroupItem 
                    key={subDir} 
                    groupName={parts[1]} 
                    files={subFiles} 
                    onFileClick={onFileClick} 
                    selectedFile={selectedFile} 
                    defaultExpanded={['app/src', 'app/src/main'].includes(subDir)}
                  />
                );
              }
            }
            return null;
          }).filter(Boolean)}
        </List>
      </Collapse>
    </>
  );
}

// Component for individual file items
function renderFileItem(file: string, onFileClick: (file: string) => void, selectedFile: string | null) {
  const fileName = file.split('/').pop() || file;
  const isSelected = file === selectedFile;
  
  return (
    <ListItem 
      key={file} 
      disablePadding 
      dense 
      sx={{ pl: file.split('/').length > 1 ? 2 : 0 }}
    >
      <ListItemButton 
        onClick={() => onFileClick(file)}
        selected={isSelected}
        sx={{ 
          py: 0.5, 
          pl: 2,
          borderRadius: 1 
        }}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          <InsertDriveFile fontSize="small" sx={{ color: getFileIconColor(fileName) }} />
        </ListItemIcon>
        <ListItemText 
          primary={<Typography variant="body2" noWrap>{fileName}</Typography>} 
          sx={{ m: 0 }}
        />
        <KeyboardArrowRight fontSize="small" color="action" sx={{ opacity: 0.5 }} />
      </ListItemButton>
    </ListItem>
  );
}

// Get color for file icon based on file extension
function getFileIconColor(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'kt':
      return '#A97BFF'; // Kotlin files
    case 'xml':
      return '#F44336'; // XML files
    case 'gradle':
    case 'kts':
      return '#03A9F4'; // Gradle files
    case 'properties':
      return '#4CAF50'; // Properties files
    case 'md':
      return '#9E9E9E'; // Markdown files
    default:
      return '#757575'; // Default color
  }
}

const ProjectPreview = () => {
  const { state, setStructure, setStep, startGenerating, finishGenerating } = useProject();
  const { config, generating } = state;
  const [activeTab, setActiveTab] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [projectFiles, setProjectFiles] = useState<string[]>([]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleGenerateProject = async () => {
    startGenerating();
    setGenerateProgress(0);
    
    try {
      // Simulate project generation with progress
      const interval = setInterval(() => {
        setGenerateProgress((prev) => {
          const newProgress = prev + Math.random() * 15;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 300);
      
      // Generate the project structure
      setTimeout(async () => {
        clearInterval(interval);
        setGenerateProgress(100);
        
        const structure = generateProject(config);
        setStructure(structure);
        
        const files = structure.files.map(file => file.path);
        setProjectFiles(files);
        
        if (files.length > 0) {
          setSelectedFile(files[0]);
          setFileContent(structure.files[0].content);
        }
        
        // Generate the ZIP file
        const zipBlob = await generateZip(structure);
        const url = URL.createObjectURL(zipBlob);
        setDownloadUrl(url);
        
        finishGenerating();
      }, 3000);
    } catch (error) {
      console.error('Error generating project:', error);
      finishGenerating();
    }
  };

  const handleBack = () => {
    setStep(3);
  };

  // Handle selecting a file to view
  const handleFileClick = (filePath: string) => {
    const structure = state.structure;
    if (!structure) return;
    
    const fileData = structure.files.find(file => file.path === filePath);
    if (fileData) {
      setSelectedFile(filePath);
      setFileContent(fileData.content);
    }
  };

  // Clean up download URL on unmount
  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const getLanguage = (filePath: string) => {
    if (filePath.endsWith('.kt')) return 'kotlin';
    if (filePath.endsWith('.xml')) return 'xml';
    if (filePath.endsWith('.gradle') || filePath.endsWith('.kts')) return 'kotlin';
    return 'text';
  };

  return (
    <Box>
      <Card 
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        sx={{ mb: 3 }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Project Preview and Generation
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Preview your project configuration and generate the final project
          </Typography>
          
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="preview tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Project Structure" {...a11yProps(0)} />
              <Tab 
                label="Code Preview" 
                {...a11yProps(1)} 
                disabled={!state.structure} 
              />
            </Tabs>
            
            <TabPanel value={activeTab} index={0}>
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Project Configuration Summary
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="body2">
                        <strong>Project Name:</strong> {config.projectName}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Package Name:</strong> {config.packageName}
                      </Typography>
                      <Typography variant="body2">
                        <strong>SDK Versions:</strong> Min {config.minSdkVersion}, Target {config.targetSdkVersion}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Build Script:</strong> {config.useKotlinDsl ? 'Kotlin DSL' : 'Groovy DSL'}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="body2">
                        <strong>Architecture:</strong> {config.architecture.toUpperCase()}
                      </Typography>
                      <Typography variant="body2">
                        <strong>UI Framework:</strong> {config.ui === 'compose' ? 'Jetpack Compose' : 'XML Layouts'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Libraries:</strong> {Object.entries({
                          Networking: config.networking,
                          Database: config.database,
                          'Dependency Injection': config.di,
                          'Image Loading': config.imageLoading,
                          Async: config.async
                        })
                          .filter(([, value]) => value !== 'none')
                          .map(([, value]) => `${value}`)
                          .join(', ') || 'None'}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
                
                {generating ? (
                  <Box sx={{ mt: 3 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={generateProgress} 
                      sx={{ height: 10, borderRadius: 5 }} 
                    />
                    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                      Generating Project: {Math.round(generateProgress)}%
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={handleGenerateProject}
                      disabled={generating}
                    >
                      Generate Project
                    </Button>
                  </Box>
                )}
                
                {downloadUrl && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="large"
                      href={downloadUrl}
                      download={`${config.projectName}.zip`}
                    >
                      Download Project
                    </Button>
                  </Box>
                )}
              </Box>
            </TabPanel>
            
            <TabPanel value={activeTab} index={1}>
              {state.structure ? (
                <Grid container spacing={2}>
                  <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 4' } }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1,
                        maxHeight: '400px',
                        overflow: 'auto',
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ mb: 1, px: 1, display: 'flex', alignItems: 'center' }}>
                        <Folder fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                        Project Files
                      </Typography>
                      <List
                        dense
                        sx={{
                          width: '100%',
                          bgcolor: 'background.paper',
                          maxHeight: '350px',
                          overflow: 'auto',
                          '& .MuiListItemButton-root:hover': {
                            bgcolor: 'action.hover'
                          }
                        }}
                      >
                        {renderFileList(projectFiles, handleFileClick, selectedFile)}
                      </List>
                    </Paper>
                  </Grid>
                  
                  <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 8' } }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1,
                        height: '400px',
                        overflow: 'auto',
                      }}
                    >
                      {selectedFile && fileContent ? (
                        <>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 1, 
                            px: 1, 
                            pb: 1,
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}>
                            <Code fontSize="small" sx={{ mr: 1, color: getFileIconColor(selectedFile.split('/').pop() || '') }} />
                            <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                              {selectedFile}
                            </Typography>
                            <IconButton 
                              size="small" 
                              color="primary"
                              aria-label="Copy code"
                              title="Copy code to clipboard"
                              onClick={() => {
                                navigator.clipboard.writeText(fileContent);
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="currentColor">
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                              </svg>
                            </IconButton>
                          </Box>
                          <SyntaxHighlighter
                            language={getLanguage(selectedFile)}
                            style={githubGist}
                            customStyle={{ 
                              margin: 0, 
                              padding: '12px',
                              borderRadius: '4px',
                              fontSize: '13px'
                            }}
                            wrapLines
                            wrapLongLines
                            showLineNumbers
                          >
                            {fileContent}
                          </SyntaxHighlighter>
                        </>
                      ) : (
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column',
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          height: '100%' 
                        }}>
                          <InsertDriveFile sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            Select a file from the tree to preview
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1">
                    Generate the project to view code preview
                  </Typography>
                </Box>
              )}
            </TabPanel>
            
          </Paper>
        </CardContent>
      </Card>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleBack}
          sx={{ minWidth: 120 }}
        >
          Back
        </Button>
        {downloadUrl && (
          <Button
            variant="contained"
            color="secondary"
            href={downloadUrl}
            download={`${config.projectName}.zip`}
            sx={{ minWidth: 120 }}
          >
            Download
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ProjectPreview;