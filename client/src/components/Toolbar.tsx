import { CanvasMode, CanvasState, LayerType } from '@/types/canvas';
import ToolButton from './ToolButton';
import {
  Circle,
  MousePointer2,
  MoveRight,
  Pencil,
  Slash,
  Square,
  Trash2,
} from 'lucide-react';

interface ToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  selectedLayerId?: string | null;
  onDelete?: () => void;
}

const Toolbar = ({
  canvasState,
  setCanvasState,
  selectedLayerId,
  onDelete,
}: ToolbarProps) => {
  return (
    <div className='absolute top-[0%] left-[40%] translate-y-[50%] flex flex-col gap-y-4'>
      <div className='bg-white rounded-md p-1.5 flex gap-y-1 gap-x-1 items-center shadow-md'>
        <ToolButton
          label='Select'
          icon={MousePointer2}
          onClick={() => setCanvasState({ mode: CanvasMode.None })}
          isActive={
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Translating ||
            canvasState.mode === CanvasMode.Pressing
          }
        />
        <ToolButton
          label='Pencil'
          icon={Pencil}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Pencil,
            })
          }
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Pencil
          }
        />
        <ToolButton
          label='Rectangle'
          icon={Square}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Rectangle,
            })
          }
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Rectangle
          }
        />
        <ToolButton
          label='Circle'
          icon={Circle}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Circle,
            })
          }
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Circle
          }
        />
        <ToolButton
          label='Line'
          icon={Slash}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Line,
            })
          }
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Line
          }
        />
        <ToolButton
          label='Arrow'
          icon={MoveRight}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Arrow,
            })
          }
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Arrow
          }
        />
        <div className='w-px h-6 bg-gray-300 mx-1' />
        <ToolButton
          label='Delete (Del/Backspace)'
          icon={Trash2}
          onClick={onDelete}
          isDisabled={!selectedLayerId}
        />
      </div>
    </div>
  );
};

export default Toolbar;
