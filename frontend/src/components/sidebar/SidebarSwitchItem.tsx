import { ContentType } from '@/types';
import { FC } from 'react';
import { TabsTrigger } from '../ui/tabs';
import { WithTooltip } from '../ui/with-tooltip';

interface SidebarSwitchItemProps {
  contentType: ContentType;
  icon: React.ReactNode;
  onContentTypeChange: (contentType: ContentType) => void;
}

export const SidebarSwitchItem: FC<SidebarSwitchItemProps> = ({ contentType, icon, onContentTypeChange }) => {
  return (
    <TabsTrigger className="hover:opacity-50" value={contentType} onClick={() => onContentTypeChange(contentType as ContentType)}>
      {icon}
    </TabsTrigger>
  );
};
