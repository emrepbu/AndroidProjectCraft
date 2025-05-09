export type Architecture = 'mvvm' | 'clean' | 'mvi' | 'mvp' | 'simple';

export type UIFramework = 'compose' | 'xml';

export type NetworkLibrary = 'retrofit' | 'ktor' | 'none';

export type DatabaseLibrary = 'room' | 'realm' | 'sqldelight' | 'none';

export type DILibrary = 'hilt' | 'koin' | 'none';

export type ImageLibrary = 'glide' | 'coil' | 'none';

export type AsyncLibrary = 'coroutines' | 'rxjava' | 'none';

export interface ProjectConfig {
  projectName: string;
  packageName: string;
  minSdkVersion: number;
  targetSdkVersion: number;
  architecture: Architecture;
  ui: UIFramework;
  networking: NetworkLibrary;
  database: DatabaseLibrary;
  di: DILibrary;
  imageLoading: ImageLibrary;
  async: AsyncLibrary;
  useKotlinDsl: boolean;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  config: ProjectConfig;
  thumbnail: string;
}

export interface ProjectFile {
  path: string;
  content: string;
}

export interface ProjectStructure {
  files: ProjectFile[];
}