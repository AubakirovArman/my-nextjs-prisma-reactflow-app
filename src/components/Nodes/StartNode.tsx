// src/components/Nodes/StartNode.tsx
'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

// NodeProps содержит все пропсы, передаваемые узлу, включая data
const StartNode = ({ data }: NodeProps<{ label: string }>) => {
  return (
    <div style={{
      background: '#90EE90', // Светло-зеленый
      padding: '10px 20px',
      borderRadius: '8px',
      border: '1px solid #2E8B57', // Темно-зеленый
      textAlign: 'center',
      minWidth: '100px'
    }}>
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
      <div>
        <strong>{data.label || 'Start'}</strong>
      </div>
    </div>
  );
};

export default StartNode;