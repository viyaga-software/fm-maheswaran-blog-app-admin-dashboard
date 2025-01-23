'use client';

import { DataTable } from '@/components/shared/table/data-table';
import { DataTableResetFilter } from '@/components/shared/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/shared/table/data-table-search';
import { columns } from './columns';
import { useAdminTableFilters } from './use-admin-table-filters';

export default function AdminTable({ data, totalData}) {
  
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useAdminTableFilters();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="email"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
