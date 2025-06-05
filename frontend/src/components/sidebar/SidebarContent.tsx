// import { Tables } from '@/supabase/types';
import { ContentType } from 'typings';
import { FC, useState } from 'react';
// import { SidebarCreateButtons } from './SidebarCreateButtons';
// import { SidebarDataList } from './SidebarDatalist';
// import { SidebarSearch } from './SidebarSearch';

interface SidebarContentProps {
  contentType: ContentType;
  // TODO: Adjust type as needed
  // data: DataListType;
  data: any;
  // TODO: Adjust type as needed
  // folders: Tables<'folders'>[];
  folders: any[];
}

export const SidebarContent: FC<SidebarContentProps> = ({ contentType, data, folders }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // @ts-ignore
  const filteredData: any = data.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    // Subtract 50px for the height of the workspace settings
    <div className="flex max-h-[calc(100%-50px)] grow flex-col">
      {/* <div className="mt-2 flex items-center">
        <SidebarCreateButtons contentType={contentType} hasData={data.length > 0} />
      </div>

      <div className="mt-2">
        <SidebarSearch contentType={contentType} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <SidebarDataList contentType={contentType} data={filteredData} folders={folders} /> */}
    </div>
  );
};
