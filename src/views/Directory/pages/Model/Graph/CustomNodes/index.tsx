import { FC, memo } from "react";
import {
  Handle,
  NodeProps,
  NodeToolbar,
  Position,
  ReactFlowState,
  useStore,
} from "reactflow";
import styled from "styled-components";

import { theme } from "../../../../../../theme";

const ObjectType = styled.div`
  width: 120px;
  height: 40px;
  padding: 8px;
  color: ${theme.grey100};
  .react-flow__handle {
    opacity: 0;
  }
  .react-flow__handle-top {
    top: -1px;
  }
  .react-flow__handle-bottom {
    bottom: -1px;
  }
  .react-flow__handle-left {
    left: -1px;
  }
  .react-flow__handle-right {
    right: -1px;
  }
`;

const Permission = styled(ObjectType)`
  width: 140px;
`;
const Operator = styled(ObjectType)`
  width: 40px;
`;

const RelationTypes = styled(ObjectType)`
  width: 140px;
  .react-flow__handle {
    opacity: 0;
  }
`;

const NodeLabel = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 16px;
  text-align: center;
  line-height: 20px;
`;

const Tooltip = styled.span`
  color: ${theme.grey100};
`;

// collect zoom level changes
const zoomSelector = (s: ReactFlowState) => s.transform[2];

export const ObjectTypeNode: FC<NodeProps> = memo(({ data }) => {
  const zoomLevel = useStore(zoomSelector) || 1;
  const fontSize = zoomLevel * 16;
  const offset = zoomLevel * 4;

  return (
    <>
      <ObjectType>
        <NodeToolbar
          isVisible={data.toolbarVisible && data.toolbarValue?.length > 11}
          offset={offset}
          position={data.toolbarPosition}
        >
          <Tooltip
            style={{
              fontSize: `${fontSize || 16}px`,
            }}
          >
            {data.toolbarValue}
          </Tooltip>
        </NodeToolbar>
        {!!data.targetHandle && (
          <Handle position={Position.Left} type="target" />
        )}
        <NodeLabel>{data.label}</NodeLabel>
        {!!data.sourceHandle && (
          <Handle position={Position.Right} type="source" />
        )}
      </ObjectType>
    </>
  );
});

export const PermissionNode: FC<NodeProps> = memo(({ data }) => {
  const zoomLevel = useStore(zoomSelector) || 1;
  const fontSize = zoomLevel * 16;
  const offset = zoomLevel * 4;

  return (
    <>
      <Permission>
        <NodeToolbar
          isVisible={data.toolbarVisible && data.toolbarValue?.length > 15}
          offset={offset}
          position={data.toolbarPosition}
        >
          <Tooltip
            style={{
              fontSize: `${fontSize || 16}px`,
            }}
          >
            {data.toolbarValue}
          </Tooltip>
        </NodeToolbar>
        {!!data.targetHandle && (
          <Handle position={Position.Left} type="target" />
        )}
        {!!data.targetHandle && (
          <Handle
            id="relation"
            position={Position.Bottom}
            style={{ left: 76 }}
            type="target"
          />
        )}
        {!!data.targetHandle && (
          <Handle
            id="permission"
            position={Position.Bottom}
            style={{ left: 88 }}
            type="target"
          />
        )}
        {!!data.targetHandle && (
          <Handle
            id="parent-relation"
            position={Position.Bottom}
            style={{ left: 64 }}
            type="target"
          />
        )}
        <NodeLabel>{data.label}</NodeLabel>
        {!!data.sourceHandle && (
          <Handle position={Position.Right} type="source" />
        )}
      </Permission>
    </>
  );
});

export const RelationTypesNode: FC<NodeProps> = memo(({ data }) => {
  const zoomLevel = useStore(zoomSelector) || 1;
  const fontSize = zoomLevel * 16;
  const offset = zoomLevel * 4;

  return (
    <>
      <NodeToolbar
        isVisible={data.toolbarVisible && data.toolbarValue?.length > 15}
        offset={offset}
        position={data.toolbarPosition}
      >
        <Tooltip
          style={{
            fontSize: `${fontSize || 16}px`,
          }}
        >
          {data.toolbarValue}
        </Tooltip>
      </NodeToolbar>
      <RelationTypes>
        {!!data.targetHandle && (
          <Handle position={Position.Left} type="target" />
        )}
        <NodeLabel>{data.label}</NodeLabel>
        {!!data.sourceHandle && (
          <Handle position={Position.Right} type="source" />
        )}
        {!!data.sourceHandle && (
          <Handle id="permission" position={Position.Bottom} type="source" />
        )}
      </RelationTypes>
    </>
  );
});

export const OperatorNode: FC<NodeProps> = memo(({ data }) => {
  return (
    <>
      <Operator>
        {!!data.targetHandle && (
          <Handle position={Position.Left} type="target" />
        )}
        <NodeLabel>{data.label}</NodeLabel>
        {!!data.sourceHandle && (
          <Handle position={Position.Right} type="source" />
        )}
        {!!data.sourceHandle && (
          <Handle id="permission" position={Position.Bottom} type="source" />
        )}
      </Operator>
    </>
  );
});
