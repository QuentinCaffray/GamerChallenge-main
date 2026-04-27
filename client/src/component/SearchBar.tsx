import Image from 'next/image';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setCurrentPage: (value: number) => void;
  setPageBlockStart: (value: number) => void;
  filterModalArea?: boolean;
  setFilterModalArea?: (value: boolean) => void;
  setOrderFilterSearchBar?: (value: 'ASC' | 'DESC') => void;
  setFilterSelectorChoice?: (value: 'Popularity' | 'Date added' | 'Alphabetical') => void;
  page?: string;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  setCurrentPage,
  setPageBlockStart,
  filterModalArea,
  setFilterModalArea,
  setOrderFilterSearchBar,
  setFilterSelectorChoice,
  page
}: SearchBarProps) {
  return (
    <div className="mb-6">
      <div className="relative max-w-md md:max-w-2xl mx-auto">
        <div className="absolute inset-0 rounded-full bg-(--searchbar-color) ring-1 ring-foreground/10 shadow-[0_10px_30px_rgba(0,0,0,0.45)]" />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-12 w-12 flex items-center justify-center shadow">
          <Image
            src="/loupe.png"
            width={100}
            height={100}
            alt="Search Icon"
            className="opacity-80"
          />
        </div>

        <input
          type="text"
          placeholder={`Search a ${page ?? ''}...`}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
            setPageBlockStart(2);
          }}
          className="relative w-full rounded-full bg-transparent py-3 pl-14 pr-4  text-center text-xl  focus:outline-none placeholder:text-foreground/50  "
        />
        {setFilterModalArea !== undefined ? (
          <button
            type="button"
            onClick={() => {
              setFilterModalArea(!filterModalArea);
            }}
            className="absolute bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) rounded-full top-1/2 right-3 -translate-y-1/2 z-8 h-10 w-10 flex items-center justify-center shadow"
          >
            <Image
              src="/filter.png"
              width={100}
              height={100}
              alt="Search Icon"
              className="opacity-80"
            />
          </button>
        ) : null}
      </div>
      {/* Modal filter menu */}
      <div className="flex justify-center mt-2">
        {filterModalArea ? (
          <div className="absolute flex items-center-safe  justify-center bg-(--modal-filter-searchebar) outline-double  outline-(--button-select) p-3  rounded-4xl ">
            <p className="mr-3">Filter :</p>
            <div className="gap-2 m-2 flex flex-col ">
              <button
                type="button"
                onClick={() => {
                  setOrderFilterSearchBar('ASC');
                }}
                className="bg-(--button-select)/50 hover:bg-(--button-game-challenge-hover) rounded-4xl p-2"
              >
                Ascending ⬆️
              </button>
              <button
                type="button"
                onClick={() => {
                  setOrderFilterSearchBar('DESC');
                }}
                className="bg-(--button-select)/50 hover:bg-(--button-game-challenge-hover) rounded-4xl p-2"
              >
                Descending ⬇️
              </button>
            </div>
            <div className="gap-2 m-2 flex flex-col">
              <button
                type="button"
                onClick={() => {
                  setFilterSelectorChoice('Popularity');
                }}
                className="bg-(--button-select)/50 hover:bg-(--button-game-challenge-hover) rounded-4xl p-2"
              >
                Popularity
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilterSelectorChoice('Date added');
                }}
                className="bg-(--button-select)/50 hover:bg-(--button-game-challenge-hover) rounded-4xl p-2"
              >
                Date added
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilterSelectorChoice('Alphabetical');
                }}
                className="bg-(--button-select)/50 hover:bg-(--button-game-challenge-hover) rounded-4xl p-2"
              >
                Alphabetical
              </button>
            </div>
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}
