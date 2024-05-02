import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export function SearchBar({ searchTerm, setSearchTerm }) {
  const handleFormSubmit = (event:any) => {
    event.preventDefault(); 
  };

  return (
    <form className="max-w-full mx-auto" onSubmit={handleFormSubmit}>
      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-muted-foreground sr-only dark:text-white">Search</label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <MagnifyingGlassIcon className="h-6 w-6 text-muted" />
        </div> 
        <input
          type="search"
          id="default-search"
          className="placeholder-custom block w-full p-4 pl-14 text-lg text-secondary-foreground font-medium bg-background border-b-2 border-secondary rounded-t-lg focus:outline-none focus:border-b-3 focus:border-primary focus:ring-0"
          placeholder="Search universities by name, region, country, etc :)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ textOverflow: 'ellipsis' }}
          required
        />
      </div>
    </form>
  );
}
