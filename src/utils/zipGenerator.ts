import JSZip from 'jszip';
import type { ProjectStructure, ProjectFile } from '../types';

export const generateZip = async (project: ProjectStructure): Promise<Blob> => {
  const zip = new JSZip();
  
  // Add all project files to the ZIP
  project.files.forEach((file: ProjectFile) => {
    const path = file.path;
    const content = file.content;
    
    // Check if the file is binary
    if ((file as any).isBinary) {
      // Convert Base64 to binary
      zip.file(path, content, { base64: true });
    } else {
      // Add as text
      zip.file(path, content);
    }
  });
  
  // Generate the ZIP file
  return await zip.generateAsync({ type: 'blob' });
};