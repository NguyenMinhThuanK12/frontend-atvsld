interface paginationResponse<T> {
    data: T[];
    meta: PaginationMeta;
}