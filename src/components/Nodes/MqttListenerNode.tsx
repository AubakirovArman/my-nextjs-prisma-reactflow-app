'use client';

import React, { useCallback, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

interface MqttListenerData {
  label?: string;
  topic?: string;
}

const MqttListenerNode = ({ id, data }: NodeProps<MqttListenerData>) => {
  const { setNodes } = useReactFlow();
  const [topicValue, setTopicValue] = useState(data.topic || '');

  const onTopicChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = evt.target.value;
      setTopicValue(newValue);
      setNodes((currentNodes) =>
        currentNodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, topic: newValue } } : n
        )
      );
    },
    [id, setNodes]
  );

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-teal-700 border-2 border-teal-800 text-white w-56">
      <div className="text-sm font-bold mb-2">{data.label || 'MQTT Listener'}</div>
      <div className="mb-2">
        <label className="block text-xs text-teal-200 mb-1">Topic:</label>
        <input
          type="text"
          value={topicValue}
          onChange={onTopicChange}
          className="w-full px-2 py-1 text-xs bg-teal-800 border border-teal-600 rounded text-white placeholder-teal-300"
          placeholder="sensors/temperature"
        />
      </div>
      <Handle type="source" position={Position.Right} id="output" className="!bg-slate-700 !w-3 !h-3" />
    </div>
  );
};

export default MqttListenerNode;
