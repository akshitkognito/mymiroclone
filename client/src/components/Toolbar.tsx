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

interface LeftToolBarProps {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  selectedLayerId?: string | null;
  onDelete?: () => void;
}

interface RightToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  fontFamily?: string;
  fontSize?: number;
  textColor?: Color;
  onFontFamilyChange?: (fontFamily: string) => void;
  onFontSizeChange?: (fontSize: number) => void;
  onTextColorChange?: (color: Color) => void;
  isTextSelected?: boolean;
}

const colors = [
  { name: 'Red', rgb: { r: 255, g: 0, b: 0 } },
  { name: 'Blue', rgb: { r: 59, g: 130, b: 246 } },
  { name: 'Green', rgb: { r: 34, g: 197, b: 94 } },
  { name: 'Purple', rgb: { r: 168, g: 85, b: 247 } },
  { name: 'Orange', rgb: { r: 249, g: 115, b: 22 } },
];

const LeftToolBar = ({
  canvasState,
  setCanvasState,
  selectedLayerId,
  onDelete,
}: LeftToolBarProps) => {
  return (
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
  );
};

const RightToolbar = ({
  canvasState,
  setCanvasState,
  fontFamily = 'Arial',
  fontSize = 16,
  textColor = { r: 0, g: 0, b: 0 },
  onFontFamilyChange,
  onFontSizeChange,
  onTextColorChange,
  isTextSelected = false,
}: RightToolbarProps) => {
  const rgbToString = (rgb: { r: number; g: number; b: number }) =>
    `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  const rgbToValue = (rgb: { r: number; g: number; b: number }) =>
    JSON.stringify(rgb);

  const parseRGB = (val: string) =>
    JSON.parse(val) as { r: number; g: number; b: number };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rgb = parseRGB(e.target.value);
    onTextColorChange?.(rgb);
  };

  return (
    <div className='bg-white rounded-md p-1.5 flex gap-y-1 gap-x-3 items-center shadow-md'>
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
      <div className='flex items-center gap-x-2'>
        <label className='text-sm font-medium text-gray-700'>Font:</label>
        <select
          value={fontFamily}
          onChange={(e) => onFontFamilyChange?.(e.target.value)}
          className='px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          disabled={!isTextSelected}
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
          disabled={!isTextSelected}
        />
      </div>
      <div className='flex gap-x-2 items-center'>
        <label htmlFor='color' className='font-normal text-gray-700'>
          Color:
        </label>
        <div className='relative w-24'>
          <select
            id='color'
            value={rgbToValue(textColor)}
            onChange={handleTextColorChange}
            className='w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-sm shadow-sm focus:border-blue-500 focus:outline-none'
          >
            {colors.map((color) => (
              <option key={color.name} value={rgbToValue(color.rgb)}>
                {color.name}
              </option>
            ))}
          </select>

          <div
            className='absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-gray-400'
            style={{ backgroundColor: rgbToString(textColor) }}
          ></div>
        </div>
      </div>
    </div>
  );
};

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
    <div className='absolute top-0 left-0 p-2 flex w-full justify-between content-between'>
      <LeftToolBar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        selectedLayerId={selectedLayerId}
        onDelete={onDelete}
      />
      <RightToolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        fontFamily={fontFamily}
        fontSize={fontSize}
        textColor={textColor}
        onFontFamilyChange={onFontFamilyChange}
        onFontSizeChange={onFontSizeChange}
        onTextColorChange={onTextColorChange}
        isTextSelected={isTextSelected}
      />
    </div>
  );
};

export default Toolbar;
