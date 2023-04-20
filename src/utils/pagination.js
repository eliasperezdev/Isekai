const port = process.env.PORT || 3000;

const urlBase = process.env.APP_URL_PRODUCTION ? `${process.env.APP_URL_PRODUCTION}` : `http://localhost:${port}`;

/**
 * Create page url string for different contexts
 * @param relativeUrl Relative Url from the request
 * @param numberPage Number page
 * @param offset
 * @param limit
 * @returns URL string
 */
const buildUrl: Function = (
  relativeUrl:string,
  numberPage: number,
  offset:number,
  limit:number,
) : string => (`${urlBase}${relativeUrl}?page=${numberPage}&offset=${offset}&limit=${limit}`);

/**
 * Create pagination url string for different request
 * @param totalRecords
 * @param currentPage Number page
 * @param offset
 * @param limit
 * @param relativeUrl Relative Url from the request
 * @returns Object pagination
 */
const calculatePage = (
  totalRecords: number,
  currentPage: number,
  offset: number,
  limit: number,
  relativeUrl: string,
) : Object => {
  const totalPages = Math.ceil(totalRecords / limit);
  const previos = (currentPage === 1 || currentPage > totalPages + 1) ? undefined : currentPage - 1;
  const next = totalPages < currentPage + 1 ? undefined : currentPage + 1;

  return {
    page: buildUrl(relativeUrl, currentPage, offset, limit),
    next: next ? buildUrl(relativeUrl, next, offset, limit) : undefined,
    previus: previos ? buildUrl(relativeUrl, previos, offset, limit) : undefined,
    lastpage: totalPages === 0 ? undefined : buildUrl(relativeUrl, totalPages, offset, limit),
    count: totalPages,
  };
};

export default calculatePage;