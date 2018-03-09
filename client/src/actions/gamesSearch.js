export const SEARCH = 'search';
export const RESET_SEARCH = 'reset_search';

export function search(searchParams) {
  return {
    type: SEARCH,
    searchParams
  };
}

export function resetSearch() {
  return {
    type: RESET_SEARCH
  };
}
