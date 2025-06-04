export const pagingSkipValue = (page, itemsPerPage) => {
  // Luon dam bao gia tri khong hop le return ve 0 het
  if (!page || !itemsPerPage) return 0
  if (page <= 0 || itemsPerPage <= 0) return 0

  return (page - 1) * itemsPerPage
}
