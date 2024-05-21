import React from 'react';

const SortOptions = ({ sortType, setSortType }) => {
  const toggleSort = (field) => {
    const order = sortType === `${field}-asc` ? 'desc' : 'asc';
    setSortType(`${field}-${order}`);
  };

  const getIcon = (field) => {
    if (sortType.startsWith(field)) {
      return sortType.endsWith('asc') ? '▲' : '▼';
    }
    return '';
  };

  return (
    <div className="flex justify-between px-4 py-2 mt-5">
      <button
        className={`flex items-center font-semibold ${sortType.includes('name') ? 'text-primary' : 'text-muted'}`}
        onClick={() => toggleSort('name')}>
        University <span className="ml-1">{getIcon('name')}</span>
      </button>
      <button
        className={`flex items-center font-semibold ${sortType.includes('ranking') ? 'text-primary' : 'text-muted'}`}
        onClick={() => toggleSort('ranking')}>
        QS Ranking <span className="ml-1">{getIcon('ranking')}</span>
      </button>
    </div>
  );
};

export default SortOptions;
