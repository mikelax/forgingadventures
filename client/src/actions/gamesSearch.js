export const SEARCH = 'search';

export function search(searchParams) {
  return {
    type: SEARCH,
    searchParams
  };
}
