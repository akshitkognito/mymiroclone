import { CanvasMode, CanvasState, Color, LayerType } from '@/types/canvas';
import ToolButton from './ToolButton';
import {
  Circle,
  MousePointer2,
  MoveRight,
  Pencil,
  Slash,
  Square,
  Trash2,
  Type,
} from 'lucide-react';

interface ToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  selectedLayerId?: string | null;
  onDelete?: () => void;
  fontFamily?: string;
  fontSize?: number;
  textColor?: Color;
  onFontFamilyChange?: (fontFamily: string) => void;
  onFontSizeChange?: (fontSize: number) => void;
  onTextColorChange?: (color: Color) => void;
  isTextSelected?: boolean;
}

const Toolbar = ({
  canvasState,
  setCanvasState,
  selectedLayerId,
  onDelete,
  fontFamily = 'Arial',
  fontSize = 16,
  textColor = { r: 0, g: 0, b: 0 },
  onFontFamilyChange,
  onFontSizeChange,
  onTextColorChange,
  isTextSelected = false,
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
        <ToolButton
          label='Text'
          icon={Type}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Text,
            })
          }
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Text
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
      {isTextSelected && (
        <div className='bg-white rounded-md p-3 flex gap-x-3 items-center shadow-md mt-2'>
          <div className='flex items-center gap-x-2'>
            <label className='text-sm font-medium text-gray-700'>Font:</label>
            <select
              value={fontFamily}
              onChange={(e) => onFontFamilyChange?.(e.target.value)}
              className='px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='Arial'>Arial</option>
              <option value='Helvetica'>Helvetica</option>
              <option value='Times New Roman'>Times New Roman</option>
              <option value='Courier New'>Courier New</option>
              <option value='Georgia'>Georgia</option>
              <option value='Verdana'>Verdana</option>
            </select>
          </div>
          <div className='flex items-center gap-x-2'>
            <label className='text-sm font-medium text-gray-700'>Size:</label>
            <input
              type='number'
              value={fontSize}
              onChange={(e) => onFontSizeChange?.(parseInt(e.target.value) || 16)}
              min='8'
              max='72'
              className='w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div className='flex items-center gap-x-2'>
            <label className='text-sm font-medium text-gray-700'>Color:</label>
            <div className='flex gap-x-1'>
              {[
                { r: 0, g: 0, b: 0 },
                { r: 255, g: 0, b: 0 },
                { r: 0, g: 128, b: 0 },
                { r: 0, g: 0, b: 255 },
                { r: 255, g: 165, b: 0 },
                { r: 128, g: 0, b: 128 },
              ].map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => onTextColorChange?.(color)}
                  className='w-6 h-6 rounded border-2 hover:scale-110 transition-transform'
                  style={{
                    backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
                    borderColor:
                      textColor.r === color.r &&
                      textColor.g === color.g &&
                      textColor.b === color.b
                        ? '#3399FF'
                        : '#d1d5db',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
