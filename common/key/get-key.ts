export const getProjKeyPerfix = () => `proj`;

export const getProjectsKey = () => `projs`;

export const getProjKey = (projId: string) => `${getProjKeyPerfix()}:${projId}`;

export const getConfigKey = (projId: string) => `${getProjKey(projId)}:config`;

export const getBatchKeyPerfix = (apiKey: string) => `apiKey:${apiKey}:batch`;

export const getBatchKey = (apiKey: string, batchId: string) => `${getBatchKeyPerfix(apiKey)}:${batchId}`;

export const getFileInfoKeyPerfix = (apiKey: string) => `apiKey:${apiKey}:file`;

export const getFileInfoKey = (apiKey: string, fileId: string) => `${getFileInfoKeyPerfix(apiKey)}:${fileId}`;

export const getBatchesKeyPerfix = (apiKey: string) => `apiKey:${apiKey}:batches`;

export const getFilesKeyPerfix = (apiKey: string) => `apiKey:${apiKey}:files`;

export const getBatchesKey = (apiKey: string, offset: number, limit: number) => `${getBatchesKeyPerfix(apiKey)}:${offset}:${limit}`;

export const getFilesKey = (apiKey: string, offset: number, limit: number) => `${getFilesKeyPerfix(apiKey)}:${offset}:${limit}`;
