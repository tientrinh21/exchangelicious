export function SearchBar({ searchTerm, setSearchTerm }) {
  const handleFormSubmit = (event) => {
    event.preventDefault(); // 폼 제출시 새로고침 방지
  };

  return (
    <form className="max-w-full mx-auto" onSubmit={handleFormSubmit}>
      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-muted-foreground sr-only dark:text-white">Search</label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg className="w-4 h-4 text-secondary-foreground" aria-hidden="true" fill="none" viewBox="0 0 20 20">
            <path stroke="#B9C1CA" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="placeholder-custom block w-full p-4 pl-10 text-lg text-secondary-foreground font-medium bg-background border-b-2 border-secondary rounded-t-lg focus:outline-none focus:border-b-3 focus:border-primary focus:ring-0"
          placeholder="Search universities by name, region, country, etc :)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          required
        />
      </div>
    </form>
  );
}
