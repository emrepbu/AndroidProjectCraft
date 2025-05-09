import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { ProjectConfig, ProjectStructure } from '../types';

interface ProjectState {
  config: ProjectConfig;
  structure: ProjectStructure | null;
  step: number;
  generating: boolean;
}

type ProjectAction =
  | { type: 'UPDATE_CONFIG'; payload: Partial<ProjectConfig> }
  | { type: 'SET_STRUCTURE'; payload: ProjectStructure }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'START_GENERATING' }
  | { type: 'FINISH_GENERATING' };

interface ProjectContextType {
  state: ProjectState;
  updateConfig: (config: Partial<ProjectConfig>) => void;
  setStructure: (structure: ProjectStructure) => void;
  setStep: (step: number) => void;
  startGenerating: () => void;
  finishGenerating: () => void;
}

const initialConfig: ProjectConfig = {
  projectName: 'MyAndroidApp',
  packageName: 'com.example.myandroidapp',
  minSdkVersion: 21,
  targetSdkVersion: 34,
  architecture: 'mvvm',
  ui: 'compose',
  networking: 'retrofit',
  database: 'room',
  di: 'hilt',
  imageLoading: 'coil',
  async: 'coroutines',
  useKotlinDsl: true
};

const initialState: ProjectState = {
  config: initialConfig,
  structure: null,
  step: 0,
  generating: false
};

const projectReducer = (state: ProjectState, action: ProjectAction): ProjectState => {
  switch (action.type) {
    case 'UPDATE_CONFIG':
      return {
        ...state,
        config: {
          ...state.config,
          ...action.payload,
        },
      };
    case 'SET_STRUCTURE':
      return { ...state, structure: action.payload };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'START_GENERATING':
      return { ...state, generating: true };
    case 'FINISH_GENERATING':
      return { ...state, generating: false };
    default:
      return state;
  }
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider = ({ children }: ProjectProviderProps) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  const updateConfig = (config: Partial<ProjectConfig>) => {
    dispatch({ type: 'UPDATE_CONFIG', payload: config });
  };

  const setStructure = (structure: ProjectStructure) => {
    dispatch({ type: 'SET_STRUCTURE', payload: structure });
  };

  const setStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const startGenerating = () => {
    dispatch({ type: 'START_GENERATING' });
  };

  const finishGenerating = () => {
    dispatch({ type: 'FINISH_GENERATING' });
  };


  return (
    <ProjectContext.Provider
      value={{
        state,
        updateConfig,
        setStructure,
        setStep,
        startGenerating,
        finishGenerating
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};