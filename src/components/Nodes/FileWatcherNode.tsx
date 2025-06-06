'use client';

import React, { useCallback, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

interface FileWatcherData {
  label?: string;
  folder?: string;
}

const FileWatcherNode = ({ id, data }: NodeProps<FileWatcherData>) => {
  const { setNodes } = useReactFlow();
  const [folderValue, setFolderValue] = useState(data.folder || '');

  const onFolderChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = evt.target.value;
      setFolderValue(newValue);
      setNodes((currentNodes) =>
        currentNodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, folder: newValue } } : n
        )
      );
    },
    [id, setNodes]
  );

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-purple-700 border-2 border-purple-800 text-white w-56">
      <div className="text-sm font-bold mb-2">{data.label || 'File Watcher'}</div>
      <div className="mb-2">
        <label className="block text-xs text-purple-200 mb-1">Папка:</label>
        <input
          type="text"
          value={folderValue}
          onChange={onFolderChange}
          className="w-full px-2 py-1 text-xs bg-purple-800 border border-purple-600 rounded text-white placeholder-purple-300"
          placeholder="/path/to/folder"
        />
      </div>
      <Handle type="source" position={Position.Right} id="output" className="!bg-slate-700 !w-3 !h-3" />
    </div>
  );
};

export default FileWatcherNode;
