export default function Pagination(props) {
  const { perPage, articles, totalPages } = props

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="m-auto hidden md:-mt-px md:flex">
        {totalPages.map((page) => {
          return (
            <a
              key={page}
              href={`/${page}`}
              className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              {page}
            </a>
          )
        })}
      </div>
    </nav>
  )
}
