import { FileText, Linkedin } from 'lucide-react';
import ToolButton from './ToolButton';

const Portfoliobar = () => {
  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className='absolute bottom-0 right-0 p-2 flex w-full justify-between content-between'>
      <div className='bg-white rounded-md p-1.5 flex gap-y-1 gap-x-3 items-center shadow-md'>
        <ToolButton
          label='LinkedIn'
          icon={Linkedin}
          onClick={() =>
            openInNewTab('https://www.linkedin.com/in/akshit-yadav/')
          }
        />
        <ToolButton
          label='Resume'
          icon={FileText}
          onClick={() =>
            openInNewTab(
              'https://drive.google.com/file/d/1S2oNZ2ukPwi3mN5WyRBK2og0a5Kb9rVe/view?usp=sharing'
            )
          }
        />
      </div>
    </div>
  );
};

export default Portfoliobar;
